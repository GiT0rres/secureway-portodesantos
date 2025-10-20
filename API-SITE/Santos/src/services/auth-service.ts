import * as httpResponse from "../utils/http-helper";
import { findUserByEmail } from "../repositories/user-repo";
import { createSession } from "../repositories/persistent-session-repo";
import * as crypto from "../utils/hash-helper";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { PersistentSession } from "../models/persistent-session-model";

/**
 * SERVIÇO DE AUTENTICAÇÃO
 * Coração do sistema de login - valida credenciais, gerencia tokens e sessões
 */

/**
 * Serviço de login - valida credenciais e cria sessão
 * @param email Email do usuário
 * @param password Senha em texto puro
 * @param ip Endereço IP do usuário
 * @param agent User Agent do navegador
 * @returns Resposta HTTP com tokens ou erro
 */
export const loginService = async (email: string, password: string, ip: string, agent: string) => {
    // 1. Busca usuário pelo email no banco de dados
    const user = await findUserByEmail(email);
    let response = null;
    
    // 2. Verifica se usuário existe E se a senha está correta usando Argon2
    // O verifyArgon2 compara a senha digitada com o hash armazenado no banco
    if (user && await crypto.verifyArgon2(password, user.senhaHash)) {
        // 3. Gera tokens JWT - refresh token (longo) e access token (curto)
        const refreshToken = genRefreshToken(user.id);
        const accessToken = genAccessToken(user.id);
        
        // 4. Cria sessão no banco de dados com hash do refresh token
        // IMPORTANTE: Nunca armazenamos o token original, apenas seu hash
        await createSession(user, refreshToken, ip, agent);
        
        // 5. Retorna resposta de sucesso com tokens para o cliente
        // O refresh token será armazenado em cookie HTTP-only no cliente
        // O access token será usado nas requisições via Authorization header
        response = await httpResponse.created({
            "refresh-token": refreshToken,
            "access-token": accessToken
        });
    } else {
        // Credenciais inválidas - não diz qual está errado por segurança
        response = await httpResponse.unauthorized("Email ou senha incorretos");
    }
    
    return response;
}

/**
 * Serviço principal de autenticação - verifica e renova tokens
 * Este é o middleware que protege as rotas e gerencia a renovação de tokens
 * @param req Request do Express
 * @param res Response do Express (para setar cookies)
 * @returns Objeto com tokens e userId ou null se não autenticado
 */
export const auth = async (req: Request, res: Response) => {
    // ========== ETAPA 1: Verificar Access Token (mais comum) ==========
    
    // Pega o token do header Authorization (formato: "Bearer <token>")
    // Exemplo: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    const authorizationHeader = req.headers["authorization"] || "";
    const accessToken = authorizationHeader.split(" ").length == 2 
        ? authorizationHeader.split(" ")[1] 
        : "";
    
    // Tenta verificar o access token usando a chave secreta
    let result = handleJWTVerify(accessToken, "" + process.env.ACCESS_TOKEN_SECRET);
    
    // Se o access token é válido e não expirou, retorna os dados sem renovação
    // Isso é o caso mais comum - usuário já tem um token válido
    if (result) {
        return {
            "access-token": accessToken, 
            userId: result.id, 
            changed: false  // Token não foi renovado (performance)
        };
    }
    
    // ========== ETAPA 2: Access Token inválido, tentar com Refresh Token ==========
    // Chegamos aqui quando o access token expirou ou é inválido
    
    // Pega refresh token dos cookies HTTP-only (mais seguro que localStorage)
    const refreshToken = req.cookies["refresh-token"];
    if (!refreshToken) return null; // Não tem refresh token = não autenticado
    
    // Busca a sessão no banco pelo hash do refresh token
    // Usamos hash para proteger o token real mesmo se o banco for comprometido
    const refreshTokenHash = await crypto.sha256Hash(refreshToken);
    const refreshTokenRow = await PersistentSession.findOne({ 
        where: { refreshTokenHash: refreshTokenHash } 
    }) as PersistentSession;
    
    // Verifica se a sessão existe, é válida e não expirou
    // Esta é uma defesa em profundidade - mesmo se o JWT for válido, verificamos no banco
    if (!refreshTokenRow || !refreshTokenRow.valid || (new Date() > new Date(refreshTokenRow.expiresAt))) {
        return null; // Sessão inválida ou expirada
    }
    
    // ========== ETAPA 3: Verificar e renovar tokens (Rotação de Tokens) ==========
    // Chegamos aqui quando temos um refresh token válido no banco
    
    // Verifica o refresh token JWT com a chave secreta de refresh
    result = handleJWTVerify(refreshToken, "" + process.env.REFRESH_TOKEN_SECRET);
    
    if (result) {
        // Gera NOVOS tokens (rotação de tokens - boa prática de segurança)
        // Isso invalida tokens antigos e limita o tempo de uso de qualquer token
        const newRefreshToken = genRefreshToken(result.id);
        const newAccessToken = genAccessToken(result.id);
        
        const response = {
            "access-token": newAccessToken, 
            "userId": result.id, 
            "changed": true  // Tokens foram renovados (cliente pode precisar saber)
        };
        
        // 1. Invalida a sessão antiga no banco (por segurança)
        // Isso previne reutilização do refresh token antigo se foi comprometido
        await PersistentSession.update(
            { 
                valid: false, 
                expiredAt: new Date()  // Marca quando foi invalidada
            }, 
            { 
                where: { id: refreshTokenRow.id } 
            }
        );
        
        // 2. Cria NOVA sessão com o novo refresh token
        // Busca o usuário da sessão antiga para criar a nova
        const user = await refreshTokenRow.getUser();
        await createSession(user, newRefreshToken, "" + req.ip, "" + req.get("User-Agent"));
        
        // 3. Define o NOVO refresh token como cookie HTTP-only
        // HTTP-only previne acesso via JavaScript (proteção contra XSS)
        res.cookie("refresh-token", newRefreshToken, {
            httpOnly: true,    
            secure: process.env.NODE_ENV === "production", // HTTPS apenas em produção
            sameSite: "lax",   // Proteção contra CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias em milissegundos
        });
        
        // 4. Atualiza o header Authorization com o novo access token
        // Isso permite que o próximo middleware já use o token novo
        req.headers["authorization"] = "Bearer " + response["access-token"];
        
        return response;
    }
    
    return null; // Falha na autenticação em todas as etapas
}

// ========== FUNÇÕES AUXILIARES PRIVADAS ==========

/**
 * Gera um Refresh Token JWT (longa duração - 7 dias)
 * Refresh tokens são usados para obter novos access tokens
 * @param userId ID do usuário que será embedado no token
 * @returns JWT token assinado
 */
function genRefreshToken(userId: number): string {
    return jwt.sign(
        { "id": userId }, 
        "" + process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: "7d" } // 7 dias - longo prazo para comodidade do usuário
    );
}

/**
 * Gera um Access Token JWT (curta duração - 15 minutos)
 * Access tokens são usados para acessar recursos protegidos
 * @param userId ID do usuário que será embedado no token
 * @returns JWT token assinado
 */
function genAccessToken(userId: number): string {
    return jwt.sign(
        { "id": userId }, 
        "" + process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: "15m" } // 15 minutos - curto prazo por segurança
    );
}

/**
 * Verifica um token JWT de forma segura (com try/catch)
 * Esta função encapsula a verificação do JWT para tratar erros gracefulmente
 * @param token JWT token a ser verificado
 * @param secret Chave secreta para verificar a assinatura
 * @returns Payload do token decodificado com id ou null se inválido/expirado
 */
function handleJWTVerify(token: string, secret: string): { id: number } | null {
    try {
        const result = jwt.verify(token, secret);
        
        // Verifica se o resultado é um objeto válido com propriedade id
        // Isso previne erros de tipo e garante que temos a estrutura esperada
        if (typeof result === 'object' && result !== null && 'id' in result) {
            return result as { id: number };
        }
        
        return null;
    } catch (error) {
        // Token inválido, expirado, formato errado, etc.
        // Retornamos null em vez de lançar erro para controle flow
        return null;
    }
}