import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateCustomerPersona } from '../api/client';

interface AuthContextType {
  customerId: string | null;
  persona: any | null;
  isLoading: boolean;
  error: string | null;
  login: (customerId: string) => Promise<void>;
  logout: () => void;
  restoreSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [persona, setPersona] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persistSession = (id: string) => {
    localStorage.setItem('customerId', id);
    setCustomerId(id);
  };

  const clearSession = () => {
    localStorage.removeItem('customerId');
    setCustomerId(null);
    setPersona(null);
  };

  const login = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Generate or fetch persona
      const personaData = await generateCustomerPersona(id);
      
      persistSession(id);
      setPersona(personaData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
      clearSession();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearSession();
  };

  const restoreSession = async () => {
    const storedId = localStorage.getItem('customerId');
    if (storedId) {
      await login(storedId);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        customerId,
        persona,
        isLoading,
        error,
        login,
        logout,
        restoreSession
      }}
    >
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