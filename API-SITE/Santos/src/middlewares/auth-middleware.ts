import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth-service";
import * as httpHelper from "../utils/http-helper";
import { Users } from "../models/userModel";

// Interface para Request com usuário
interface AuthRequest extends Request {
    user?: {
        id: number;
        accessToken: string;
    };
}

/**
 * MIDDLEWARE PARA USUÁRIOS NORMAIS
 * Permite acesso apenas se for um usuário normal logado
 * 
 * Funcionamento:
 * 1. Verifica autenticação usando o serviço auth
 * 2. Se autenticado, adiciona info do usuário ao request
 * 3. Se tokens foram renovados, atualiza o header
 * 4. Permite acesso à rota protegida
 */
export const requireUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Verifica autenticação e renova tokens se necessário
        const authResult = await authService.auth(req, res);
        
        if (authResult) {
            // Adiciona informações do usuário ao request para uso nas rotas
            req.user = {
                id: authResult.userId,
                accessToken: authResult["access-token"]
            };
            
            // Se tokens foram renovados, atualiza header Authorization
            if (authResult.changed) {
                req.headers["authorization"] = `Bearer ${authResult["access-token"]}`;
            }
            
            // ✅ PERMITE ACESSO - qualquer usuário logado pode acessar
            return next();
        } else {
            // ❌ Não autenticado - retorna erro 401
            const httpResponse = await httpHelper.unauthorized("Acesso negado. Faça login primeiro.");
            return res.status(httpResponse.statusCode).json(httpResponse.body);
        }
    } catch (error) {
        console.error("Erro no middleware de usuário:", error);
        const httpResponse = await httpHelper.unauthorized("Erro de autenticação");
        return res.status(httpResponse.statusCode).json(httpResponse.body);
    }
};

/**
 * MIDDLEWARE PARA ENTERPRISES  
 * Permite acesso apenas se for uma enterprise logada
 * (Você precisará adaptar conforme seu sistema de enterprises)
 * 
 * Atualmente funciona igual ao requireUser, mas pode ser extendido
 * para verificar roles/permissions específicas de empresas
 */
export const requireEnterprise = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authResult = await authService.auth(req, res);
        
        if (authResult) {
            // ✅ POR ENQUANTO: permite qualquer usuário logado
            // Futuramente você pode adicionar verificação de role/tipo de usuário
            req.user = {
                id: authResult.userId,
                accessToken: authResult["access-token"]
            };
            
            // Atualiza header se tokens foram renovados
            if (authResult.changed) {
                req.headers["authorization"] = `Bearer ${authResult["access-token"]}`;
            }
            
            return next();
        } else {
            const httpResponse = await httpHelper.unauthorized("Acesso negado. Empresa não autenticada.");
            return res.status(httpResponse.statusCode).json(httpResponse.body);
        }
    } catch (error) {
        console.error("Erro no middleware de empresa:", error);
        const httpResponse = await httpHelper.unauthorized("Erro de autenticação");
        return res.status(httpResponse.statusCode).json(httpResponse.body);
    }
};