// utils/firebase-admin.ts - VERSÃO CORRIGIDA
import { initializeApp, cert, App, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { ServiceAccount } from 'firebase-admin';

// Configuração mínima para desenvolvimento
const firebaseAdminConfig = {
  projectId: "santos-56c07"
};

let adminApp: App;
let adminAuth: any;

try {
  const apps = getApps();
  
  if (apps.length === 0) {
    // Inicializa sem service account para desenvolvimento
    adminApp = initializeApp(firebaseAdminConfig);
    console.log('✅ Firebase Admin App inicializado com sucesso');
  } else {
    adminApp = apps[0];
    console.log('⚠️ Firebase Admin App já estava inicializado');
  }
  
  adminAuth = getAuth(adminApp);
  console.log('✅ Firebase Admin Auth inicializado');
  
} catch (error: any) {
  console.error('❌ Erro na inicialização do Firebase Admin:', error.message);
}

/**
 * Verifica se um token JWT do Firebase é válido
 */
export const verifyIdToken = async (token: string) => {
  try {
    if (!adminAuth) {
      throw new Error('Firebase Admin Auth não inicializado');
    }
    
    console.log('🔐 Verificando token...');
    const decodedToken = await adminAuth.verifyIdToken(token);
    console.log('✅ Token válido para UID:', decodedToken.uid);
    return decodedToken;
  } catch (error: any) {
    console.error('❌ Erro ao verificar token:', error.message);
    throw new Error('Token inválido: ' + error.message);
  }
};

/**
 * Busca usuário no Firebase pelo UID
 */
export const getUserByUid = async (uid: string) => {
  try {
    if (!adminAuth) {
      throw new Error('Firebase Admin Auth não inicializado');
    }
    
    const userRecord = await adminAuth.getUser(uid);
    return userRecord;
  } catch (error: any) {
    console.error('Erro ao buscar usuário:', error.message);
    throw new Error('Usuário não encontrado: ' + error.message);
  }
};

/**
 * Cria um novo usuário no Firebase Auth
 */
export const createUserInFirebase = async (email: string, password: string) => {
  try {
    if (!adminAuth) {
      throw new Error('Firebase Admin Auth não inicializado');
    }
    
    const userRecord = await adminAuth.createUser({
      email: email,
      password: password,
      emailVerified: false,
      disabled: false
    });
    return userRecord;
  } catch (error: any) {
    console.error('Erro ao criar usuário no Firebase:', error);
    
    if (error.code === 'auth/email-already-exists') {
      throw new Error('Email já está em uso');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Email inválido');
    } else {
      throw new Error(`Falha ao criar usuário: ${error.message}`);
    }
  }
};

/**
 * Deleta usuário do Firebase Auth
 */
export const deleteUserFromFirebase = async (uid: string) => {
  try {
    if (!adminAuth) {
      throw new Error('Firebase Admin Auth não inicializado');
    }
    
    await adminAuth.deleteUser(uid);
    return true;
  } catch (error: any) {
    console.error('Erro ao deletar usuário do Firebase:', error.message);
    throw new Error('Falha ao deletar usuário: ' + error.message);
  }
};

// Export para uso em outros lugares se necessário
export { adminApp, adminAuth };