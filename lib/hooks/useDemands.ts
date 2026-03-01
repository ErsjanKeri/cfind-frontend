'use client';

/**
 * Buyer Demands Hooks - Enhanced with buyer/agent specific queries
 *
 * React Query hooks for buyer demand operations (reverse marketplace)
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { DemandFilters } from '@/lib/api/types';

// ============================================================================
// QUERY HOOKS (READ Operations)
// ============================================================================

/**
 * Get active demands with optional filters (for agents browsing)
 */
export function useDemands(filters?: DemandFilters) {
  return useQuery({
    queryKey: ['demands', filters],
    queryFn: () => api.demands.getDemands(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get demands for a specific buyer (buyer's own demands)
 */
export function useBuyerDemands(buyerId?: string) {
  return useQuery({
    queryKey: ['demands', 'buyer', buyerId],
    queryFn: () => api.demands.getBuyerDemands(buyerId!),
    enabled: !!buyerId, // Only fetch if buyerId is provided
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get demands claimed by a specific agent
 */
export function useAgentDemands(agentId?: string) {
  return useQuery({
    queryKey: ['demands', 'agent', agentId],
    queryFn: () => api.demands.getAgentDemands(agentId!),
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================================================
// MUTATION HOOKS (WRITE Operations)
// ============================================================================

/**
 * Update demand status (fulfilled, closed, etc.)
 */
export function useUpdateDemandStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'assigned' | 'fulfilled' | 'closed' }) =>
      api.demands.updateDemandStatus(id, status),
    onSuccess: () => {
      // Invalidate all demand queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['demands'] });
    },
  });
}

/**
 * Delete demand
 */
export function useDeleteDemand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.demands.deleteDemand(id),
    onSuccess: () => {
      // Invalidate all demand queries
      queryClient.invalidateQueries({ queryKey: ['demands'] });
    },
  });
}

/**
 * Create new buyer demand
 *
 * Usage:
 * ```ts
 * const createDemand = useCreateDemand();
 * await createDemand.mutateAsync({
 *   description: 'Seeking established restaurant...',
 *   category: 'restaurant',
 *   preferred_city_en: 'Tirana',
 *   budget_min_eur: 50000,
 *   budget_max_eur: 100000,
 *   demand_type: 'investor'
 * });
 * ```
 */
export function useCreateDemand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      description: string;
      category: string;
      preferred_city_en: string;
      preferred_area?: string;
      budget_min_eur: number;
      budget_max_eur: number;
      demand_type: 'investor' | 'seeking_funding';
    }) => api.demands.createDemand(data),
    onSuccess: () => {
      // Invalidate all demand queries to show new demand
      queryClient.invalidateQueries({ queryKey: ['demands'] });
    },
  });
}

/**
 * Claim demand (agent claims exclusive access to buyer demand)
 *
 * Usage:
 * ```ts
 * const claimDemand = useClaimDemand();
 * await claimDemand.mutateAsync('demand-id-123');
 * ```
 */
export function useClaimDemand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (demandId: string) => api.demands.claimDemand(demandId),
    onSuccess: () => {
      // Invalidate demand queries to show claimed status
      queryClient.invalidateQueries({ queryKey: ['demands'] });
    },
  });
}
