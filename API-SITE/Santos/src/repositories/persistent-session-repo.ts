import { Users } from "../models/userModel";
import { PersistentSession } from "../models/persistent-session-model";
import * as crypto from "../utils/hash-helper";

/**
 * REPOSITÓRIO PARA SESSÕES PERSISTENTES
 * Gerencia criação e validação de sessões de usuário
 */

/**
 * Cria uma nova sessão persistente para o usuário
 * @param user Objeto do usuário que está fazendo login
 * @param token Refresh token em texto puro (será hasheado)
 * @param ip Endereço IP do usuário (ex: "192.168.1.100")
 * @param agent User Agent do navegador (ex: "Chrome Windows")
 * @returns Promise<PersistentSession> Sessão criada no banco
 */
export const createSession = async (
    user: Users, 
    token: string, 
    ip: string, 
    agent: string
): Promise<PersistentSession> => {
    
    // Data de expiração: 7 dias a partir de agora
    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + 7);
    
    // Cria a sessão no banco com hash seguro do token
    // IMPORTANTE: Nunca armazenar o token original, apenas o hash
    return await PersistentSession.create({
        userId: user.id,                              // ID do usuário para relacionamento
        refreshTokenHash: await crypto.sha256Hash(token), // Hash SHA-256 do token original
        ip: ip,                                       // Endereço IP da requisição
        agent: agent,                                 // Navegador/Sistema operacional
        expiresAt: expiresDate,                       // Data de expiração (7 dias)
        valid: true                                   // Sessão inicia como válida
    });
}