import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Profile, Role } from '../types';
import { api, getStoredToken, setStoredToken } from '../lib/api';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  role: Role | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ role: Role }>;
  signup: (fullName: string, email: string, password: string, role?: 'student' | 'instructor') => Promise<{ role: Role }>;
  logout: () => Promise<void>;
  updateProfile: (data: { fullName?: string; bio?: string; avatarUrl?: string }) => Promise<void>;
  switchDemoUser: (email: string) => Promise<Role>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [token, setTokenState] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshAuth = useCallback(async () => {
    const curToken = getStoredToken();
    if (!curToken) {
      setUser(null);
      setProfile(null);
      setRole(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await api.getMe();
      if (data.user && data.profile && data.role) {
        setUser({ id: data.user.id, email: data.user.email, createdAt: '' });
        setProfile(data.profile);
        setRole(data.role);
      } else {
        setStoredToken(null);
        setTokenState(null);
        setUser(null);
        setProfile(null);
        setRole(null);
      }
    } catch (err) {
      console.warn('Failed to refresh session:', err);
      setStoredToken(null);
      setTokenState(null);
      setUser(null);
      setProfile(null);
      setRole(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password });
      setStoredToken(res.token);
      setTokenState(res.token);
      setUser({ id: res.user.id, email: res.user.email, createdAt: '' });
      setProfile(res.profile);
      setRole(res.role);
      return { role: res.role };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (fullName: string, email: string, password: string, chosenRole?: 'student' | 'instructor') => {
    setIsLoading(true);
    try {
      const res = await api.signup({ fullName, email, password, role: chosenRole });
      setStoredToken(res.token);
      setTokenState(res.token);
      setUser({ id: res.user.id, email: res.user.email, createdAt: '' });
      setProfile(res.profile);
      setRole(res.role);
      return { role: res.role };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.warn('Logout warning:', e);
    } finally {
      setStoredToken(null);
      setTokenState(null);
      setUser(null);
      setProfile(null);
      setRole(null);
    }
  };

  const updateProfile = async (data: { fullName?: string; bio?: string; avatarUrl?: string }) => {
    const res = await api.updateProfile(data);
    setProfile(res.profile);
  };

  const switchDemoUser = async (email: string) => {
    const res = await login(email, 'Password123!');
    return res.role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        switchDemoUser,
        refreshAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
