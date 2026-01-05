import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  AuthUser,
  authApi,
  getToken,
  setToken,
  getStoredUser,
  setStoredUser,
  clearAuth,
} from '@/lib/auth';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on app load
  useEffect(() => {
    const token = getToken();
    const storedUser = getStoredUser();

    if (token && storedUser) {
      setUser(storedUser);
    } else {
      // Clear partial data if incomplete
      clearAuth();
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
      
      setToken(response.token);
      setStoredUser(response.user);
      setUser(response.user);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await authApi.register({ username, email, password });
      
      // After registration, login automatically
      const loginResult = await login(email, password);
      return loginResult;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  const isAuthenticated = !!user && !!getToken();

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
