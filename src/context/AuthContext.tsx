import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminProfile } from '../types';
import { authService, AuthSession } from '../services/authService';
import { settingsService } from '../services/settingsService';

interface AuthContextType {
  isAuthenticated: boolean;
  admin: AdminProfile | null;
  session: AuthSession | null;
  loading: boolean;
  login: (email: string, pass: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateAdmin: (partial: Partial<AdminProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const current = authService.getCurrentSession();
    if (current && current.isAuthenticated) {
      setSession(current);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string, rememberMe = true) => {
    const res = await authService.login(email, pass, rememberMe);
    if (res.success && res.session) {
      setSession(res.session);
      return { success: true };
    }
    return { success: false, error: res.error || 'Authentication failed' };
  };

  const logout = () => {
    authService.logout();
    setSession(null);
  };

  const updateAdmin = (partial: Partial<AdminProfile>) => {
    const updated = settingsService.updateAdminProfile(partial);
    if (session) {
      setSession({ ...session, admin: updated });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!session?.isAuthenticated,
        admin: session?.admin || null,
        session,
        loading,
        login,
        logout,
        updateAdmin,
      }}
    >
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
