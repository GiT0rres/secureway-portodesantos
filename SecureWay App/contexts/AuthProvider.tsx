import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { observarAutenticacao, obterUsuarioAtual, UserData } from '../services/authService';

interface AuthContextData {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signed: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = observarAutenticacao(async (authUser) => {
      setUser(authUser);

      if (authUser) {
        // Buscar dados do usuário no Firestore
        const data = await obterUsuarioAtual();
        setUserData(data);
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    // Cleanup da subscription
    return subscriber;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        signed: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};