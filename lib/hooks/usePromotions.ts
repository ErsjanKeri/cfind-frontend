'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { USER_QUERY_KEY } from './useAuth';

export function useCreditPackages() {
  return useQuery({
    queryKey: ['creditPackages'],
    queryFn: () => api.promotions.getCreditPackages(),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePromotionTiers() {
  return useQuery({
    queryKey: ['promotionTiers'],
    queryFn: () => api.promotions.getPromotionTiers(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAgentCredits() {
  return useQuery({
    queryKey: ['agentCredits'],
    queryFn: () => api.promotions.getCredits(),
    staleTime: 60 * 1000,
  });
}

export function useActivePromotions() {
  return useQuery({
    queryKey: ['activePromotions'],
    queryFn: () => api.promotions.getActivePromotions(),
    staleTime: 60 * 1000,
  });
}

export function usePurchaseCredits() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { package_id: string }) =>
      api.promotions.purchaseCredits(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agentCredits'] });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}

export function usePromoteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listingId, tier }: { listingId: string; tier: 'featured' | 'premium' }) =>
      api.promotions.promoteListing(listingId, { tier }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['agentCredits'] });
      queryClient.invalidateQueries({ queryKey: ['activePromotions'] });
      queryClient.invalidateQueries({ queryKey: ['listing', variables.listingId] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}

export function useCancelPromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listingId: string) => api.promotions.cancelPromotion(listingId),
    onSuccess: (_, listingId) => {
      queryClient.invalidateQueries({ queryKey: ['agentCredits'] });
      queryClient.invalidateQueries({ queryKey: ['activePromotions'] });
      queryClient.invalidateQueries({ queryKey: ['listing', listingId] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}
