// services/firebase-user-service.ts
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import * as httpHelper from '../utils/http-helper';
import * as UserRepository from '../repositories/user-repo';
import { createUserInFirebase } from '../utils/firebase-admin';


/**
 * SERVIÇO DE USUÁRIOS COM FIREBASE AUTH
 * Versão simplificada - Firebase cuida da autenticação
 */

/**
 * Login do usuário com Firebase Auth
 */
export const loginUserService = async (email: string, password: string) => {
  try {
    // 1. Autentica com Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // 2. Busca dados do usuário no MySQL
    const userData = await UserRepository.findUserByFirebaseUid(userCredential.user.uid);
    
    if (!userData) {
      return await httpHelper.unauthorized("Usuário não encontrado no sistema");
    }

    // 3. Gera token de acesso
    const token = await userCredential.user.getIdToken();

    return await httpHelper.ok({
      "access-token": token,
      "user": {
        id: userData.id,
        uid: userCredential.user.uid,
        nome: userData.nome,
        email: userCredential.user.email
      }
    });

  } catch (error: any) {
    console.error('Erro no login Firebase:', error);
    
    // Mapeia erros do Firebase
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return await httpHelper.unauthorized("Email ou senha incorretos");
      case 'auth/too-many-requests':
        return await httpHelper.unauthorized("Muitas tentativas. Tente mais tarde.");
      default:
        return await httpHelper.unauthorized("Erro ao fazer login");
    }
  }
};

/**
 * Registro de novo usuário
 */

export const registerUserService = async (userData: any) => {
  try {
    // Valida campos obrigatórios
    if (!userData.nome || !userData.email || !userData.senha || !userData.telefone) {
      return await httpHelper.badRequest();
    }

    // 1. Verifica se email já existe no MySQL
    const existingUser = await UserRepository.findUserByEmail(userData.email);
    if (existingUser) {
      return await httpHelper.badRequest("Email já cadastrado");
    }

    // 2. Cria usuário no Firebase Auth usando CLIENT (não admin)
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.senha
    );

    // 3. Cria usuário no MySQL
    const mysqlUser = await UserRepository.createUser({
      firebaseUid: userCredential.user.uid,
      nome: userData.nome,
      email: userData.email,
      telefone: userData.telefone,
      cpf: userData.cpf,
      rg: userData.rg
    });

    // 4. Gera token
    const token = await userCredential.user.getIdToken();

    return await httpHelper.created({
      "access-token": token,
      "user": {
        id: mysqlUser.id,
        uid: userCredential.user.uid,
        nome: mysqlUser.nome,
        email: mysqlUser.email
      }
    });

  } catch (error: any) {
    console.error('Erro no registro:', error);
    
    // Mapeia erros do Firebase
    if (error.code === 'auth/email-already-in-use') {
      return await httpHelper.badRequest("Email já está em uso");
    } else if (error.code === 'auth/weak-password') {
      return await httpHelper.badRequest("Senha muito fraca");
    } else {
      return await httpHelper.badRequest("Erro ao criar usuário");
    }
  }
};

/**
 * Logout do usuário
 */
export const logoutUserService = async () => {
  try {
    await signOut(auth);
    return await httpHelper.ok({ message: "Logout realizado com sucesso" });
  } catch (error) {
    console.error('Erro no logout:', error);
    return await httpHelper.serverError(new Error("Erro ao fazer logout"));
  }
};

/**
 * Busca dados do usuário autenticado
 */
export const getAuthenticatedUserService = async (firebaseUid: string) => {
  try {
    const user = await UserRepository.findUserByFirebaseUid(firebaseUid);
    
    if (!user) {
      return await httpHelper.notFound("Usuário não encontrado");
    }

    return await httpHelper.ok({
      id: user.id,
      nome: user.nome,
      email: user.email,
      telefone: user.telefone,
      cpf: user.cpf,
      rg: user.rg,
      chaveUnitaria: user.chaveUnitaria
    });

  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return await httpHelper.serverError(new Error("Erro interno"));
  }
};