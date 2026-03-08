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
import axios from 'axios';
import { api } from '@/lib/api';
import { apiClient } from '@/lib/api/client';
import { isValidCountryCode } from '@/lib/constants';
import { setCountryCookie } from '@/lib/country';

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
        const response = await apiClient.get('/api/users/me');
        return response.data;
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return null;
        }
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

    // Sync country preference from backend → cookie
    if (userData?.country_preference && isValidCountryCode(userData.country_preference)) {
      setCountryCookie(userData.country_preference);
    }
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
