// services/firebase-enterprise-service.ts - VERSÃO CORRIGIDA
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import * as httpHelper from '../utils/http-helper';
import * as EnterpriseRepository from '../repositories/enterprise-repo';

/**
 * SERVIÇO DE EMPRESAS COM FIREBASE AUTH
 */

/**
 * Login da empresa com Firebase Auth
 */
export const loginEnterpriseService = async (email: string, password: string) => {
  try {
    // 1. Autentica com Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // 2. Busca dados da empresa no MySQL
    const enterpriseData = await EnterpriseRepository.findEnterpriseByFirebaseUid(userCredential.user.uid);
    
    if (!enterpriseData) {
      return await httpHelper.unauthorized("Empresa não encontrada no sistema");
    }

    // 3. Gera token de acesso
    const token = await userCredential.user.getIdToken();

    return await httpHelper.ok({
      "access-token": token,
      "enterprise": {
        id: enterpriseData.id,
        uid: userCredential.user.uid,
        nome: enterpriseData.nome,
        email: userCredential.user.email,
        cnpj: enterpriseData.cnpj
      }
    });

  } catch (error: any) {
    console.error('Erro no login empresa:', error);
    
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return await httpHelper.unauthorized("Email ou senha incorretos");
      default:
        return await httpHelper.unauthorized("Erro ao fazer login");
    }
  }
};

/**
 * Registro de nova empresa - USANDO FIREBASE CLIENT
 */
export const registerEnterpriseService = async (enterpriseData: any) => {
  try {
    // Valida campos obrigatórios
    if (!enterpriseData.nome || !enterpriseData.email || !enterpriseData.senha || 
        !enterpriseData.telefone || !enterpriseData.cnpj) {
      return await httpHelper.badRequest("Dados incompletos");
    }

    // 1. Verifica se email ou CNPJ já existem
    const existingEmail = await EnterpriseRepository.findEnterpriseByEmail(enterpriseData.email);
    const existingCnpj = await EnterpriseRepository.findEnterpriseByCNPJ(enterpriseData.cnpj);
    
    if (existingEmail) {
      return await httpHelper.badRequest("Email já cadastrado");
    }
    if (existingCnpj) {
      return await httpHelper.badRequest("CNPJ já cadastrado");
    }

    // 2. Cria empresa no Firebase Auth USANDO CLIENT (não Admin)
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      enterpriseData.email, 
      enterpriseData.senha
    );

    const firebaseUser = userCredential.user;

    // 3. Cria empresa no MySQL
    const mysqlEnterprise = await EnterpriseRepository.createEnterprise({
      firebaseUid: firebaseUser.uid,
      nome: enterpriseData.nome,
      email: enterpriseData.email,
      telefone: enterpriseData.telefone,
      cnpj: enterpriseData.cnpj
    });

    // 4. Gera token
    const token = await firebaseUser.getIdToken();

    return await httpHelper.created({
      "access-token": token,
      "enterprise": {
        id: mysqlEnterprise.id,
        uid: firebaseUser.uid,
        nome: mysqlEnterprise.nome,
        email: mysqlEnterprise.email,
        cnpj: mysqlEnterprise.cnpj
      }
    });

  } catch (error: any) {
    console.error('Erro no registro empresa:', error);
    
    // Trata erros específicos do Firebase
    if (error.code === 'auth/email-already-in-use') {
      return await httpHelper.badRequest("Email já está em uso");
    } else if (error.code === 'auth/invalid-email') {
      return await httpHelper.badRequest("Email inválido");
    } else if (error.code === 'auth/weak-password') {
      return await httpHelper.badRequest("Senha muito fraca");
    }
    
    return await httpHelper.badRequest("Erro ao criar empresa: " + error.message);
  }
};