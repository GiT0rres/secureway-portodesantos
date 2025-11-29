// controllers/userController.ts
import { Response, Request } from "express"
import { Users } from "../models/userModel"
import { Scheduling } from "../models/schedulingModel"
import { Op } from "sequelize";
import { Read } from "../models/readModel";
import { Esp } from "../models/espModel";
// NOVOS IMPORTS FIREBASE:
import * as firebaseUserService from "../services/firebase-user-service";
import * as httpHelper from "../utils/http-helper";

// Interface para Request com usuário
interface AuthRequest extends Request {
  userData?: any;
}

/**
 * CONTROLLER DE USUÁRIOS - ATUALIZADO PARA FIREBASE
 */

// ===================== ROTAS PÚBLICAS =====================


export const login = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
      const response = await httpHelper.badRequest();
      return res.status(response.statusCode).json(response.body);
    }

    const httpResponse = await firebaseUserService.loginUserService(email, senha);
    res.status(httpResponse.statusCode).json(httpResponse.body);
    
  } catch (error) {
    console.error('Erro no login:', error);
    const httpResponse = await httpHelper.serverError(new Error("Erro interno"));
    res.status(httpResponse.statusCode).json(httpResponse.body);
  }
}

// Criação de usuário (Firebase)
export const postUser = async (req: Request, res: Response) => {
  try {
    const httpResponse = await firebaseUserService.registerUserService(req.body);
    res.status(httpResponse.statusCode).json(httpResponse.body);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    const httpResponse = await httpHelper.serverError(new Error("Erro interno"));
    res.status(httpResponse.statusCode).json(httpResponse.body);
  }
}

// ===================== ROTAS PROTEGIDAS =====================

// GET USERS
export const getUser = async (req: Request, res: Response) => {
  try {
    const users = await Users.findAll()
    res.status(200).json(users)
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// GET USER BY ID
export const getUserID = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await Users.findByPk(id);
  if (!user) {
    res.status(404).json({"error":"user not found"})
    return
  }

  res.status(200).json(user)
}

// PATCH USER
export const patchUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone, chaveUnitaria, cpf, rg } = req.body;

    const user = await Users.findByPk(id);
    if (!user) {
      res.status(404).json({"error":"user not found"})
      return
    }

    const updateData: any = {};
    if (nome !== undefined) updateData.nome = nome;
    if (email !== undefined) updateData.email = email;
    if (telefone !== undefined) updateData.telefone = telefone;
    if (chaveUnitaria !== undefined) updateData.chaveUnitaria = chaveUnitaria;
    if (cpf !== undefined) updateData.cpf = cpf;
    if (rg !== undefined) updateData.rg = rg;

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({"error":"No fields provided for update"})
      return
    }

    await Users.update(updateData, { where: { id } });
    const updatedUser = await Users.findByPk(id);
    res.status(200).json(updatedUser);
    
  } catch (error) {
    res.status(400).json({"error":"error when updating"})
  }
}

// DELETE USER
export const deleteUserID = async (req: Request, res: Response) => {
  const { id } = req.params;

  const users = await Users.findByPk(id);
  if (!users) {
    res.status(404).json({"error":"user not found"})
    return
  }
  
  await Users.destroy({ where: { id } })
  res.status(200).json({"message":"success"})
}

// ========== FUNÇÕES DE AUTENTICAÇÃO ==========

export const getName = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userData) {
      const response = await httpHelper.unauthorized("Não autenticado");
      return res.status(response.statusCode).json(response.body);
    }

    const httpResponse = await firebaseUserService.getAuthenticatedUserService(req.userData.firebaseUid);
    res.status(httpResponse.statusCode).json(httpResponse.body);
    
  } catch (error) {
    console.error("Erro em getName:", error);
    const httpResponse = await httpHelper.serverError(new Error("Erro interno"));
    res.status(httpResponse.statusCode).json(httpResponse.body);
  }
}

export const isAuthed = async (req: AuthRequest, res: Response) => {
  try {
    if (req.userData) {
      const httpResponse = await httpHelper.ok({ authenticated: true });
      res.status(httpResponse.statusCode).json(httpResponse.body);
    } else {
      const httpResponse = await httpHelper.unauthorized("Não autenticado");
      res.status(httpResponse.statusCode).json(httpResponse.body);
    }
  } catch (error) {
    console.error("Erro em isAuthed:", error);
    const httpResponse = await httpHelper.serverError(new Error("Erro interno"));
    res.status(httpResponse.statusCode).json(httpResponse.body);
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    const httpResponse = await firebaseUserService.logoutUserService();
    res.status(httpResponse.statusCode).json(httpResponse.body);
  } catch (error) {
    console.error('Erro no logout:', error);
    const httpResponse = await httpHelper.serverError(new Error("Erro interno"));
    res.status(httpResponse.statusCode).json(httpResponse.body);
  }
}


/**
 * GET /canAccess/:id
 * Verificação completa de acesso — RESTAURADO DO CÓDIGO 1
 */
export const getAccessVerification = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await Users.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.chaveUnitaria) {
      return res.status(400).json({ error: "User has no unitary key" });
    }


    const nowUTC = new Date();
    const now = new Date(nowUTC.getTime() - 3 * 60 * 60 * 1000);

    const windowStart = new Date(now.getTime() - 20 * 60 * 1000);
    const windowEnd = new Date(now.getTime() + 20 * 60 * 1000);
    
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const allSchedulingsToday = await Scheduling.findAll({
      where: {
        idUsuario: id,
        dataHora: {
          [Op.between]: [startOfDay, endOfDay]
        },
      },
    });

    if (!allSchedulingsToday || allSchedulingsToday.length === 0) {
      return res.status(404).json({ message: "No scheduling found for this user today" });
    }

    const validScheduling = allSchedulingsToday.find(scheduling => {
      const schedulingTime = new Date(scheduling.dataHora);
      const timeDiff = Math.abs(schedulingTime.getTime() - now.getTime());
      return timeDiff <= 20 * 60 * 1000;
    });

    if (!validScheduling) {
      return res.status(404).json({ message: "No scheduling found within 20 minutes window" });
    }

    if (!validScheduling.idEsp) {
      return res.status(400).json({ error: "Scheduling has no Esp associated" });
    }

    const lastRead = await Read.findOne({
      where: { idEsp: validScheduling.idEsp },
      order: [["createdAt", "DESC"]],
    });

    if (!lastRead) {
      return res.status(404).json({ message: "No recent read found for this Esp" });
    }

    if (lastRead.readKey !== user.chaveUnitaria) {
      return res.status(403).json({ message: "Access denied: key mismatch" });
    }

    return res.status(200).json({
      message: "Access granted",
      scheduling: validScheduling,
      lastRead
    });

  } catch (error: any) {
    console.error("Error in getAccessVerification:", error);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
};


/**
 * PATCH /addKeytoUser/:id_U/:id_E
 * RESTAURADO COMPLETO DO CÓDIGO 1
 */
export const patchAddKeytoUser = async (req: Request, res: Response) => {
  try {
    const { id_U, id_E } = req.params;

    const user = await Users.findByPk(id_U);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const esp = await Esp.findByPk(id_E);
    if (!esp) {
      return res.status(404).json({ error: "ESP not found" });
    }

    const nowUTC = new Date();
    const now = new Date(nowUTC.getTime() - 3 * 60 * 60 * 1000);

    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)

    const lastRead = await Read.findOne({
      where: { 
        idEsp: id_E,
        createdAt: { [Op.gte]: fiveMinutesAgo }
      },
      order: [["createdAt", "DESC"]],
    });

    if (!lastRead) {
      return res.status(404).json({ error: "No recent read found for this ESP (within 5 minutes)" });
    }

    if (!lastRead.readKey) {
      return res.status(400).json({ error: "Recent read has no key" });
    }

    user.chaveUnitaria = lastRead.readKey;
    await user.save();

    res.status(200).json({
      message: "Key successfully added to user",
      user: {
        id: user.id,
        nome: user.nome,
        chaveUnitaria: user.chaveUnitaria
      },
      read: {
        id: lastRead.id,
        readKey: lastRead.readKey,
        createdAt: lastRead.createdAt
      }
    });

  } catch (error: any) {
    res.status(500).json({ 
      error: "Internal server error", 
      details: error.message 
    });
  }
}












// userController.ts - ADICIONE ESTAS FUNÇÕES NO FINAL

/**
 * DEBUG: Teste simples de autenticação
 */
export const debugAuth = async (req: Request, res: Response) => {
  try {
    console.log('=== 🔍 INÍCIO DEBUG AUTH ===');
    
    // 1. Verifica header
    const authHeader = req.headers.authorization;
    console.log('📨 Authorization Header:', authHeader);
    
    if (!authHeader) {
      console.log('❌ SEM Authorization header');
      return res.status(400).json({ 
        status: 'error',
        message: 'Authorization header missing',
        debug: { hasHeader: false }
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      console.log('❌ Authorization header mal formatado');
      return res.status(400).json({ 
        status: 'error', 
        message: 'Authorization header must start with Bearer',
        debug: { headerFormat: 'invalid' }
      });
    }

    // 2. Extrai token
    const token = authHeader.split('Bearer ')[1];
    console.log('🔑 Token extraído (primeiros 20 chars):', token.substring(0, 20) + '...');
    console.log('🔑 Token completo:', token);
    
    // 3. Resposta de debug
    console.log('✅ DEBUG concluído');
    console.log('=== 🔍 FIM DEBUG AUTH ===');
    
    return res.status(200).json({
      status: 'success',
      message: 'Token recebido com sucesso',
      debug: {
        hasHeader: true,
        headerFormat: 'valid',
        tokenLength: token.length,
        tokenPreview: token.substring(0, 20) + '...'
      }
    });

  } catch (error: any) {
    console.error('❌ Erro no debug:', error);
    return res.status(500).json({ 
      status: 'error',
      message: 'Erro interno no debug',
      error: error.message 
    });
  }
};

/**
 * DEBUG: Teste do Firebase Admin
 */
export const debugFirebaseAdmin = async (req: Request, res: Response) => {
  try {
    console.log('=== 🔥 INÍCIO DEBUG FIREBASE ADMIN ===');
    
    // Testa se o Firebase Admin está funcionando
    const testToken = 'token_teste_invalido';
    
    try {
      const { verifyIdToken } = await import('../utils/firebase-admin');
      await verifyIdToken(testToken);
    } catch (error: any) {
      console.log('✅ Firebase Admin está carregado (deu erro esperado):', error.message);
    }
    
    console.log('=== 🔥 FIM DEBUG FIREBASE ADMIN ===');
    
    return res.status(200).json({
      status: 'success',
      message: 'Firebase Admin testado',
      firebaseAdmin: 'loaded'
    });
  } catch (error: any) {
    console.error('❌ Firebase Admin não carregou:', error);
    return res.status(500).json({
      status: 'error', 
      message: 'Firebase Admin não carregou',
      error: error.message
    });
  }
};