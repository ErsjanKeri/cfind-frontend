'use client';

import { useMemo } from 'react';
import { useUser } from '@/lib/hooks/useAuth';

export type UserRole = 'agent' | 'buyer' | 'admin';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface RoleState {
  role: UserRole | null;
  isAgent: boolean;
  isBuyer: boolean;
  isAdmin: boolean;
  isVerifiedAgent: boolean;
  isPendingAgent: boolean;
  isRejectedAgent: boolean;
  verificationStatus: VerificationStatus | null;
}

/**
 * Centralised role + verification checks.
 * Use this instead of repeating `user?.role === "agent"` across components.
 */
export function useRole(): RoleState {
  const { user } = useUser();

  const role = (user?.role as UserRole) ?? null;
  const verificationStatus =
    (user?.agent_profile?.verification_status as VerificationStatus) ?? null;

  return useMemo(() => ({
    role,
    isAgent: role === 'agent',
    isBuyer: role === 'buyer',
    isAdmin: role === 'admin',
    isVerifiedAgent: verificationStatus === 'approved',
    isPendingAgent: verificationStatus === 'pending',
    isRejectedAgent: verificationStatus === 'rejected',
    verificationStatus,
  }), [role, verificationStatus]);
}
