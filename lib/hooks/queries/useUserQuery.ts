'use client';

/**
 * React Query hook for user profile data
 *
 * This replaces sessionStorage-based auth state with React Query caching.
 * Benefits:
 * - Automatic refetch on window focus (catches verification status changes)
 * - Centralized cache management
 * - Built-in loading/error states
 * - Automatic stale-while-revalidate pattern
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { UserWithProfile } from '@/lib/api/types';

// Query key for user data
export const USER_QUERY_KEY = ['user', 'profile'] as const;

/**
 * Hook to fetch and cache current user profile
 *
 * Options:
 * - enabled: Set to false to disable automatic fetching (default: true)
 * - refetchOnWindowFocus: Automatically refetch when user returns to tab (default: true)
 * - staleTime: How long data is considered fresh (default: 5 minutes)
 */
export function useUserQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      try {
        const userData = await api.user.getProfile();
        return userData;
      } catch (error) {
        // If 401 or any error, user is not authenticated
        throw error;
      }
    },
    // Only fetch if enabled (default true)
    enabled: options?.enabled !== false,
    // Keep data fresh for 5 minutes before considering stale
    staleTime: 5 * 60 * 1000,
    // Always fetch on mount to ensure fresh data (prevents FOUC on page refresh)
    refetchOnMount: true,
    // Refetch when user returns to tab (catches verification changes)
    refetchOnWindowFocus: true,
    // Don't retry on auth errors (401)
    retry: (failureCount, error: any) => {
      // Don't retry if it's an auth error
      if (error?.message?.includes('401') || error?.message?.includes('Unauthorized')) {
        return false;
      }
      // Retry other errors up to 1 time
      return failureCount < 1;
    },
  });
}

/**
 * Hook to invalidate (force refetch) user data
 *
 * Use this after operations that change user data:
 * - Profile updates
 * - Email verification
 * - Credit purchases
 * - Document uploads
 */
export function useInvalidateUser() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
  };
}

/**
 * Hook to set user data in cache without fetching
 *
 * Use this after login to immediately populate cache
 */
export function useSetUserData() {
  const queryClient = useQueryClient();

  return (userData: UserWithProfile | null) => {
    queryClient.setQueryData(USER_QUERY_KEY, userData);
  };
}

/**
 * Hook to clear user data from cache
 *
 * Use this on logout
 */
export function useClearUserData() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.setQueryData(USER_QUERY_KEY, null);
    queryClient.removeQueries({ queryKey: USER_QUERY_KEY });
  };
}
