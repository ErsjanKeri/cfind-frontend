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
 * - Smart auth detection (only fetches if csrf_token cookie exists)
 */

import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { UserWithProfile } from '@/lib/api/types';

// Query key for user data
export const USER_QUERY_KEY = ['user', 'profile'] as const;

/**
 * Check if user has authentication cookies (csrf_token)
 *
 * The backend sets 3 cookies on login:
 * 1. access_token (httpOnly) - Cannot be read by JavaScript
 * 2. refresh_token (httpOnly) - Cannot be read by JavaScript
 * 3. csrf_token (readable) - CAN be read by JavaScript
 *
 * If csrf_token exists, user is logged in.
 * This cookie is set on login and deleted on logout.
 */
function hasAuthCookie(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.includes('csrf_token=');
}

/**
 * Hook to fetch and cache current user profile
 *
 * Only fetches if csrf_token cookie exists (user is logged in).
 * This prevents unnecessary 401 errors on public pages.
 *
 * Uses client-side only cookie check to avoid hydration mismatches.
 *
 * Options:
 * - enabled: Set to false to disable automatic fetching (default: true)
 * - refetchOnWindowFocus: Automatically refetch when user returns to tab (default: true)
 * - staleTime: How long data is considered fresh (default: 5 minutes)
 */
export function useUserQuery(options?: { enabled?: boolean }) {
  // Check auth cookie only on client side (after mount) to avoid hydration errors
  const [shouldFetch, setShouldFetch] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    // Only run on client side
    setShouldFetch(hasAuthCookie());
    setCheckedAuth(true);
  }, []);

  const query = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      try {
        const userData = await api.user.getProfile();
        return userData;
      } catch (error: unknown) {
        // If 401, user is not authenticated - return null instead of error
        // This prevents error states in UI when user simply isn't logged in
        const isUnauthorized =
          (error instanceof Error && (error.message.includes('401') || error.message.includes('Unauthorized'))) ||
          (typeof error === 'object' && error !== null && 'response' in error && (error as { response?: { status?: number } }).response?.status === 401);
        if (isUnauthorized) {
          return null;
        }
        // Re-throw other errors (network issues, server errors, etc.)
        throw error;
      }
    },
    // Only fetch if auth cookie exists AND enabled option allows it
    enabled: shouldFetch && (options?.enabled !== false),
    // Keep data fresh for 5 minutes before considering stale
    staleTime: 5 * 60 * 1000,
    // Always fetch on mount to ensure fresh data (prevents FOUC on page refresh)
    refetchOnMount: true,
    // Refetch when user returns to tab (catches verification changes)
    refetchOnWindowFocus: true,
    // Don't retry on auth errors (they're expected when not logged in)
    retry: false,
  });

  return { ...query, checkedAuth };
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
