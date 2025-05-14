import { createContext, useContext, ReactNode, useState } from 'react';
import { AuthContextType } from './types';
import { useAuthState } from './useAuthState';
import { useAuthMethods } from './useAuthMethods';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  console.log('AuthProvider: Initializing');
  
  const { 
    user, 
    isLoading: authStateLoading,
    setIsLoading: setAuthStateLoading,
    session 
  } = useAuthState();

  console.log('AuthProvider: Auth state loaded:', { user, authStateLoading, session });

  const { 
    login, 
    logout, 
    hasPermission 
  } = useAuthMethods({ 
    user, 
    setIsLoading: setAuthStateLoading
  });

  console.log('AuthProvider: Auth methods initialized');

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading: authStateLoading,
      login,
      logout,
      hasPermission,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
