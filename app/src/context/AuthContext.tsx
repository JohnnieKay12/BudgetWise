import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, LoginCredentials, RegisterData } from '@/types';
import { authAPI } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    credentials: LoginCredentials
  ) => Promise<void>;
  register: (
    data: RegisterData
  ) => Promise<void>;
  logout: () => void;
  setUser: (
    user: User | null
  ) => void;
  checkSubscription: () => boolean;

  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.me()
        .then((userData) => {
          setUserState(userData);
        })
        .catch((error) => {
          if (error.response?.status === 403) {
            window.location.href =
              '/subscription-expired';
        
            return;
          }
        
          localStorage.removeItem('token');
          setUserState(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem('token', response.token);
      setUserState(response.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.register(data);
      localStorage.setItem('token', response.token);
      setUserState(response.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUserState(null);
    window.location.href = '/';
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await authAPI.me();
  
      console.log(
        'REFRESHED USER:',
        userData
      );
  
      setUserState(userData);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const setUser = useCallback((userData: User | null) => {
    setUserState(userData);
  }, []);

  const checkSubscription =
  useCallback(() => {
    if (!user) return false;

    if (
      user.subscriptionStatus !==
      'active'
    ) {
      return false;
    }

    if (!user.subscriptionEndDate) {
      return false;
    }

    return (
      new Date() <
      new Date(
        user.subscriptionEndDate
      )
    );
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        setUser,
        checkSubscription,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
