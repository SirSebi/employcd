'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUser, loginUser, logoutUser } from '@/lib/auth';
import { hasActiveSubscription } from '@/lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  hasActiveSubscription?: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSubscription: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Beim Mounting der Komponente prüfen wir, ob der Benutzer bereits angemeldet ist
    const checkAuth = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error('Fehler beim Abrufen des Benutzers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await loginUser(email, password);
      if (result && result.user) {
        setUser(result.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Anmeldefehler:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error('Abmeldefehler:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkSubscription = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const isActive = await hasActiveSubscription(user.id);
      
      // Aktualisiere den Benutzer mit dem aktuellen Abonnementstatus
      setUser(prev => prev ? { ...prev, hasActiveSubscription: isActive } : null);
      
      return isActive;
    } catch (error) {
      console.error('Fehler beim Prüfen des Abonnements:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        isLoading,
        login,
        logout,
        checkSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth muss innerhalb eines AuthProviders verwendet werden');
  }
  return context;
} 