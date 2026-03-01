'use client';

/**
 * Authentication — single file.
 *
 * useUser()           — current user (React Query, cookie-based)
 * useAuth()           — login / logout
 * useInvalidateUser() — force-refetch user data (after profile edits, etc.)
 */

import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const USER_QUERY_KEY = ['user', 'profile'] as const;

/**
 * Get current user data.
 *
 * Calls GET /api/users/me using the httpOnly JWT cookie.
 * Returns null when not logged in (401 is caught, not thrown).
 */
export function useUser() {
  const query = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      try {
        return await api.user.getProfile();
      } catch (error: unknown) {
        const isUnauthorized =
          (error instanceof Error &&
            (error.message.includes('401') || error.message.includes('Unauthorized'))) ||
          (typeof error === 'object' &&
            error !== null &&
            'response' in error &&
            (error as { response?: { status?: number } }).response?.status === 401);
        if (isUnauthorized) return null;
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return { user: query.data ?? null, isLoading: query.isLoading };
}

/**
 * Login and logout.
 */
export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const login = async (email: string, password: string) => {
    await api.auth.login({ email, password });
    // Cookies are now set. Fetch profile and write to cache so every
    // component that calls useUser() sees the logged-in user immediately.
    const userData = await api.user.getProfile();
    queryClient.setQueryData(USER_QUERY_KEY, userData);
  };

  const logout = async () => {
    queryClient.setQueryData(USER_QUERY_KEY, null);
    queryClient.removeQueries({ queryKey: USER_QUERY_KEY });
    try {
      await api.auth.logout();
    } catch {
      // Ignore — user is logging out anyway
    }
    router.push('/login');
  };

  return { login, logout };
}

/**
 * Force-refetch user data.
 *
 * Call after operations that change the user:
 * profile updates, avatar upload, email verification, credit purchase, etc.
 */
export function useInvalidateUser() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
  };
}
