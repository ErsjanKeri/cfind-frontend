'use client';

/**
 * Auth Hooks - SIMPLE
 *
 * useAuth() - login/logout functions
 * useUser() - fetch current user data (via JWT cookie)
 */

import { useUserQuery } from '@/lib/hooks/queries/useUserQuery';

export { useAuth } from '@/lib/contexts/auth-context';

/**
 * Get current user data
 * Fetches from backend using JWT cookie
 * Returns null if not logged in
 */
export function useUser() {
  const { data: user, isLoading, isFetching } = useUserQuery();
  return { user: user || null, isLoading: isLoading || isFetching };
}
