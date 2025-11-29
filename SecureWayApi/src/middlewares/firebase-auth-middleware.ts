// middlewares/firebase-auth-middleware.ts
import { Request, Response, NextFunction } from "express";
import { verifyIdToken } from "../utils/firebase-admin";
import * as httpHelper from "../utils/http-helper";
import * as UserRepository from "../repositories/user-repo";
import * as EnterpriseRepository from "../repositories/enterprise-repo";

// Interface extendida para Request
interface AuthRequest extends Request {
  user?: any;
  userData?: any;
  enterpriseData?: any;
}

/**
 * Middleware base de autenticação Firebase
 * Verifica se o token é válido e adiciona dados ao request
 */
export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const response = await httpHelper.unauthorized("Token de autenticação não fornecido");
      return res.status(response.statusCode).json(response.body);
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verifica token com Firebase Admin
    const decodedToken = await verifyIdToken(token);
    
    // Adiciona dados do usuário ao request
    req.user = decodedToken;
    
    next();

  } catch (error) {
    console.error('Erro na autenticação:', error);
    const response = await httpHelper.unauthorized("Token inválido ou expirado");
    res.status(response.statusCode).json(response.body);
  }
};

/**
 * Middleware para usuários normais
 * Verifica se é um usuário do sistema
 */
export const requireUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await requireAuth(req, res, async () => {
      // Busca dados do usuário no MySQL
      const userData = await UserRepository.findUserByFirebaseUid(req.user.uid);
      
      if (!userData) {
        const response = await httpHelper.unauthorized("Usuário não encontrado");
        return res.status(response.statusCode).json(response.body);
      }

      // Adiciona dados do usuário ao request
      req.userData = userData;
      next();
    });
  } catch (error) {
    const response = await httpHelper.unauthorized("Erro de autenticação");
    res.status(response.statusCode).json(response.body);
  }
};

/**
 * Middleware para empresas
 * Verifica se é uma empresa do sistema
 */
export const requireEnterprise = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await requireAuth(req, res, async () => {
      // Busca dados da empresa no MySQL
      const enterpriseData = await EnterpriseRepository.findEnterpriseByFirebaseUid(req.user.uid);
      
      if (!enterpriseData) {
        const response = await httpHelper.unauthorized("Empresa não encontrada");
        return res.status(response.statusCode).json(response.body);
      }

      // Adiciona dados da empresa ao request
      req.enterpriseData = enterpriseData;
      next();
    });
  } catch (error) {
    const response = await httpHelper.unauthorized("Erro de autenticação");
    res.status(response.statusCode).json(response.body);
  }
};

/**
 * Middleware opcional - autentica se tiver token, mas não bloqueia
 */
export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await verifyIdToken(token);
      req.user = decodedToken;
      
      // Tenta buscar dados do usuário/empresa
      const userData = await UserRepository.findUserByFirebaseUid(decodedToken.uid);
      const enterpriseData = await EnterpriseRepository.findEnterpriseByFirebaseUid(decodedToken.uid);
      
      if (userData) req.userData = userData;
      if (enterpriseData) req.enterpriseData = enterpriseData;
    }

    next();
  } catch (error) {
    // Se token é inválido, continua sem autenticação
    next();
  }
};