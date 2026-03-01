'use client';

/**
 * Admin Hooks - Phase 5
 *
 * React Query hooks for admin operations
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { UserRole, CreateAgentRequest, CreateBuyerRequest } from '@/lib/api/types';

// ============================================================================
// QUERY HOOKS (READ Operations)
// ============================================================================

/**
 * Get platform statistics (admin dashboard)
 */
export function useAdminStats() {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: () => api.admin.getStats(),
  });
}

/**
 * Get all users with optional role filter
 */
export function useAllUsers(role?: UserRole) {
  return useQuery({
    queryKey: ['users', role],
    queryFn: () => api.admin.getUsers(role),
  });
}

// ============================================================================
// MUTATION HOOKS (WRITE Operations)
// ============================================================================

/**
 * Verify agent (admin approves agent account)
 */
export function useVerifyAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (agentId: string) => api.admin.verifyAgent(agentId),
    onSuccess: () => {
      // Invalidate users list to show updated verification status
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });
}

/**
 * Reject agent with reason
 */
export function useRejectAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ agentId, reason }: { agentId: string; reason: string }) =>
      api.admin.rejectAgent(agentId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });
}

/**
 * Delete user (admin only)
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => api.admin.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });
}

/**
 * Toggle user's email verification status
 */
export function useToggleEmailVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, emailVerified }: { userId: string; emailVerified: boolean }) =>
      api.admin.toggleEmailVerification(userId, emailVerified),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

/**
 * Adjust agent credits (add or remove)
 */
export function useAdjustCredits() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ agentId, amount, reason }: { agentId: string; amount: number; reason: string }) =>
      api.admin.adjustCredits(agentId, amount, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['credits'] });
    },
  });
}

/**
 * Create agent (admin creates pre-verified agent)
 */
export function useCreateAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAgentRequest) => api.admin.createAgent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });
}

/**
 * Create buyer (admin creates buyer)
 */
export function useCreateBuyer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBuyerRequest) => api.admin.createBuyer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });
}
