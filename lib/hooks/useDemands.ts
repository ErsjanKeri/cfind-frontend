'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { DemandFilters, PaginationParams } from '@/lib/api/types';

export function useDemands(filters?: DemandFilters) {
  return useQuery({
    queryKey: ['demands', filters],
    queryFn: () => api.demands.getDemands(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useBuyerDemands(buyerId?: string, params?: PaginationParams) {
  return useQuery({
    queryKey: ['demands', 'buyer', buyerId, params],
    queryFn: () => api.demands.getBuyerDemands(buyerId!, params),
    enabled: !!buyerId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAgentDemands(agentId?: string, params?: PaginationParams) {
  return useQuery({
    queryKey: ['demands', 'agent', agentId, params],
    queryFn: () => api.demands.getAgentDemands(agentId!, params),
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateDemandStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'assigned' | 'fulfilled' | 'closed' }) =>
      api.demands.updateDemandStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demands'] });
    },
  });
}

export function useDeleteDemand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.demands.deleteDemand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demands'] });
    },
  });
}

export function useCreateDemand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      country_code: string;
      description: string;
      category: string;
      preferred_city_en: string;
      preferred_area?: string;
      budget_min_eur: number;
      budget_max_eur: number;
      demand_type: 'investor' | 'seeking_funding';
    }) => api.demands.createDemand(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demands'] });
    },
  });
}

export function useClaimDemand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (demandId: string) => api.demands.claimDemand(demandId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demands'] });
    },
  });
}
