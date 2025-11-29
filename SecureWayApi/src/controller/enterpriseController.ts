// controllers/enterpriseController.ts
import { Response, Request } from "express"
import { Enterprise } from "../models/enterpriseModel"
// NOVOS IMPORTS FIREBASE:
import * as firebaseEnterpriseService from "../services/firebase-enterprise-service";
import * as httpHelper from "../utils/http-helper";

// Interface para Request com empresa
interface AuthRequest extends Request {
  enterpriseData?: any;
}

/**
 * CONTROLLER DE EMPRESAS - ATUALIZADO PARA FIREBASE
 */

// ========== ROTAS PÚBLICAS ==========

/**
 * POST /enterprise/login (se tiver - ou usar /users/login para ambos)
 * Login da empresa com Firebase Auth
 */
export const loginEnterprise = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
      const response = await httpHelper.badRequest();
      return res.status(response.statusCode).json(response.body);
    }

    const httpResponse = await firebaseEnterpriseService.loginEnterpriseService(email, senha);
    res.status(httpResponse.statusCode).json(httpResponse.body);
    
  } catch (error) {
    console.error('Erro no login empresa:', error);
    const httpResponse = await httpHelper.serverError(new Error("Erro interno"));
    res.status(httpResponse.statusCode).json(httpResponse.body);
  }
}

/**
 * POST /enterprise
 * Criação de nova empresa
 */
export const postEnterprise = async (req: Request, res: Response) => {
  try {
    const httpResponse = await firebaseEnterpriseService.registerEnterpriseService(req.body);
    res.status(httpResponse.statusCode).json(httpResponse.body);
  } catch (error) {
    console.error('Erro ao criar empresa:', error);
    const httpResponse = await httpHelper.serverError(new Error("Erro interno"));
    res.status(httpResponse.statusCode).json(httpResponse.body);
  }
}

// ========== ROTAS PROTEGIDAS ==========

/**
 * GET /enterprise
 * Lista todas as empresas
 */
export const getEnterprise = async (req: Request, res: Response) => {
  try {
    const enterprises = await Enterprise.findAll()
    res.status(200).json(enterprises)
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * GET /enterprise/:id
 * Busca empresa por ID
 */
export const getEnterpriseID = async (req: Request, res: Response) => {
  const { id } = req.params;

  const enterprise = await Enterprise.findByPk(id);
  if (!enterprise) {
    res.status(404).json({"error":"enterprise not found"})
    return
  }

  res.status(200).json(enterprise)
}

/**
 * PATCH /enterprise/:id
 * Atualiza dados da empresa
 */
export const patchEnterprise = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone, cnpj } = req.body;

    const enterprise = await Enterprise.findByPk(id);
    if (!enterprise) {
      res.status(404).json({"error":"enterprise not found"})
      return
    }

    const updateData: any = {};
    if (nome !== undefined) updateData.nome = nome;
    if (email !== undefined) updateData.email = email;
    if (telefone !== undefined) updateData.telefone = telefone;
    if (cnpj !== undefined) updateData.cnpj = cnpj;

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({"error":"No fields provided for update"})
      return
    }

    await Enterprise.update(updateData, { where: { id } });
    const updatedEnterprise = await Enterprise.findByPk(id);
    res.status(200).json(updatedEnterprise);
    
  } catch (error) {
    res.status(400).json({"error":"error when updating"})
  }
}

/**
 * DELETE /enterprise/:id
 * Deleta empresa
 */
export const deleteEnterpriseID = async (req: Request, res: Response) => {
  const { id } = req.params;

  const enterprise = await Enterprise.findByPk(id);
  if (!enterprise) {
    res.status(404).json({"error":"enterprise not found"})
    return
  }
  
  await Enterprise.destroy({ where: { id } })
  res.status(200).json({"message":"success"})
}