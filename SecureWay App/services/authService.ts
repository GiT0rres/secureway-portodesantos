import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase.config';

export interface UserData {
  uid: string;
  nomeCompleto: string;
  email: string;
  telefone: string;
  tipo: 'caminhoneiro' | 'empresa';
  cnpj?: string; // Opcional - apenas para empresas
  createdAt: Date;
}

interface AuthResult {
  success: boolean;
  message?: string;
  userData?: UserData;
}

/**
 * Cadastra um novo usuário no Firebase Auth e Firestore
 */
export const cadastrarUsuario = async (
  nomeCompleto: string,
  email: string,
  senha: string,
  telefone: string,
  tipo: 'caminhoneiro' | 'empresa' = 'caminhoneiro',
  cnpj?: string // <- Este parâmetro opcional
): Promise<AuthResult> => {
  try {
    // Criar usuário no Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // Atualizar perfil com o nome
    await updateProfile(user, {
      displayName: nomeCompleto
    });

    // Criar documento do usuário no Firestore
   const userData: UserData = {
  uid: user.uid,
  nomeCompleto,
  email,
  telefone,
  tipo,
  ...(tipo === 'empresa' && cnpj ? { cnpj } : {}), // <-- adiciona cnpj se for empresa
  createdAt: new Date()
};

    await setDoc(doc(db, 'usuarios', user.uid), userData);

    return {
      success: true,
      message: 'Cadastro realizado com sucesso!',
      userData: userData
    };

  } catch (error: any) {
    console.error('Erro ao cadastrar:', error);

    let message = 'Erro ao cadastrar usuário';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'Este e-mail já está em uso';
        break;
      case 'auth/invalid-email':
        message = 'E-mail inválido';
        break;
      case 'auth/weak-password':
        message = 'Senha muito fraca (mínimo 6 caracteres)';
        break;
      case 'auth/network-request-failed':
        message = 'Erro de conexão. Verifique sua internet';
        break;
      case 'auth/operation-not-allowed':
        message = 'Operação não permitida. Verifique as configurações do Firebase';
        break;
      default:
        message = error.message || 'Erro desconhecido';
    }

    return { success: false, message };
  }
};

/**
 * Faz login do usuário
 */
export const fazerLogin = async (
  email: string,
  senha: string
): Promise<AuthResult> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // Buscar dados adicionais do usuário no Firestore
    const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
    
    if (!userDoc.exists()) {
      return {
        success: false,
        message: 'Dados do usuário não encontrados'
      };
    }

    const userData = userDoc.data() as UserData;

    return {
      success: true,
      message: 'Login realizado com sucesso!',
      userData: userData
    };

  } catch (error: any) {
    console.error('Erro ao fazer login:', error);

    let message = 'Erro ao fazer login';
    
    switch (error.code) {
      case 'auth/user-not-found':
        message = 'Usuário não encontrado';
        break;
      case 'auth/wrong-password':
        message = 'Senha incorreta';
        break;
      case 'auth/invalid-email':
        message = 'E-mail inválido';
        break;
      case 'auth/user-disabled':
        message = 'Usuário desabilitado';
        break;
      case 'auth/network-request-failed':
        message = 'Erro de conexão. Verifique sua internet';
        break;
      case 'auth/too-many-requests':
        message = 'Muitas tentativas. Tente novamente mais tarde';
        break;
      case 'auth/invalid-credential':
        message = 'Credenciais inválidas. Verifique seu e-mail e senha';
        break;
      default:
        message = error.message || 'Erro desconhecido';
    }

    return { success: false, message };
  }
};

/**
 * Faz logout do usuário
 */
export const fazerLogout = async (): Promise<AuthResult> => {
  try {
    await signOut(auth);
    return {
      success: true,
      message: 'Logout realizado com sucesso'
    };
  } catch (error: any) {
    console.error('Erro ao fazer logout:', error);
    return {
      success: false,
      message: error.message || 'Erro ao fazer logout'
    };
  }
};

/**
 * Obtém os dados do usuário atual
 */
export const obterUsuarioAtual = async (): Promise<UserData | null> => {
  const user = auth.currentUser;
  
  if (!user) return null;

  try {
    const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
    
    if (!userDoc.exists()) return null;
    
    return userDoc.data() as UserData;
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error);
    return null;
  }
};

/**
 * Observa mudanças no estado de autenticação
 */
export const observarAutenticacao = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Envia e-mail de recuperação de senha
 */
export const recuperarSenha = async (email: string): Promise<AuthResult> => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: 'E-mail de recuperação enviado com sucesso!'
    };
  } catch (error: any) {
    console.error('Erro ao enviar e-mail de recuperação:', error);

    let message = 'Erro ao enviar e-mail de recuperação';
    
    switch (error.code) {
      case 'auth/user-not-found':
        message = 'E-mail não encontrado';
        break;
      case 'auth/invalid-email':
        message = 'E-mail inválido';
        break;
      default:
        message = error.message || 'Erro desconhecido';
    }

    return { success: false, message };
  }
};