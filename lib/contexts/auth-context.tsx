'use client';

/**
 * Authentication Context - SIMPLE
 *
 * JWT cookie = source of truth
 * - Login: Backend sets JWT cookie
 * - Logout: Backend clears JWT cookie
 * - Components fetch user data when needed via useUserQuery
 * - No caching in auth context, no sessionStorage, just cookies
 */

import React, { createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { USER_QUERY_KEY } from '@/lib/hooks/queries/useUserQuery';

interface AuthContextType {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Simple login - backend sets JWT cookie
  const login = async (email: string, password: string) => {
    await api.auth.login({ email, password });
    // That's it! JWT cookie is set by backend
  };

  // Simple logout - backend clears JWT cookie
  const logout = async () => {
    // Clear React Query cache FIRST (prevents refetch during logout)
    queryClient.setQueryData(USER_QUERY_KEY, null);
    queryClient.removeQueries({ queryKey: USER_QUERY_KEY });

    try {
      await api.auth.logout();
    } catch (error) {
      // Ignore errors - user is logging out anyway
    }

    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
