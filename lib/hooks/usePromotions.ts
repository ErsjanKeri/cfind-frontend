'use client';

/**
 * Promotion & Credit Hooks - Phase 5
 *
 * React Query hooks for promotion system:
 * - Credit packages
 * - Promotion tiers
 * - Agent credits & balance
 * - Active promotions
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

// ============================================================================
// QUERY HOOKS (READ Operations)
// ============================================================================

/**
 * Get all credit packages
 */
export function useCreditPackages() {
  return useQuery({
    queryKey: ['creditPackages'],
    queryFn: () => api.promotions.getCreditPackages(),
    staleTime: 5 * 60 * 1000, // 5 minutes - rarely changes
  });
}

/**
 * Get promotion tier configurations
 */
export function usePromotionTiers() {
  return useQuery({
    queryKey: ['promotionTiers'],
    queryFn: () => api.promotions.getPromotionTiers(),
    staleTime: 5 * 60 * 1000, // 5 minutes - rarely changes
  });
}

/**
 * Get agent's credit balance and transaction history
 */
export function useAgentCredits() {
  return useQuery({
    queryKey: ['agentCredits'],
    queryFn: () => api.promotions.getCredits(),
  });
}

/**
 * Get agent's active promotions
 */
export function useActivePromotions() {
  return useQuery({
    queryKey: ['activePromotions'],
    queryFn: () => api.promotions.getActivePromotions(),
  });
}

// ============================================================================
// MUTATION HOOKS (WRITE Operations)
// ============================================================================

/**
 * Purchase credits
 *
 * Usage:
 * ```ts
 * const purchaseCredits = usePurchaseCredits();
 * await purchaseCredits.mutateAsync({
 *   package_id: 'pkg-123',
 *   payment_method: 'stripe'
 * });
 * ```
 */
export function usePurchaseCredits() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { package_id: string; payment_method: string }) =>
      api.promotions.purchaseCredits(data),
    onSuccess: () => {
      // Invalidate credits query to show new balance
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      // Also invalidate user query to update credit_balance in profile
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

/**
 * Promote listing to featured or premium tier
 *
 * Usage:
 * ```ts
 * const promoteListing = usePromoteListing();
 * await promoteListing.mutateAsync({
 *   listingId: 'listing-123',
 *   tier: 'featured'
 * });
 * ```
 */
export function usePromoteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listingId, tier }: { listingId: string; tier: 'featured' | 'premium' }) =>
      api.promotions.promoteListing(listingId, { tier }),
    onSuccess: (_, variables) => {
      // Invalidate credits, promotions, and affected listing
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      queryClient.invalidateQueries({ queryKey: ['listing', variables.listingId] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

/**
 * Cancel active promotion
 *
 * Usage:
 * ```ts
 * const cancelPromotion = useCancelPromotion();
 * await cancelPromotion.mutateAsync('listing-id-123');
 * ```
 */
export function useCancelPromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listingId: string) => api.promotions.cancelPromotion(listingId),
    onSuccess: (_, listingId) => {
      // Invalidate credits, promotions, and affected listing
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      queryClient.invalidateQueries({ queryKey: ['listing', listingId] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}
