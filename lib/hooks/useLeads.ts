'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { PaginationParams } from '@/lib/api/types';

export function useBuyerLeads(buyerId?: string, params?: PaginationParams) {
  return useQuery({
    queryKey: ['leads', 'buyer', buyerId, params],
    queryFn: () => api.leads.getBuyerLeads(buyerId!, params),
    enabled: !!buyerId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAgentLeads(agentId?: string, params?: PaginationParams) {
  return useQuery({
    queryKey: ['leads', 'agent', agentId, params],
    queryFn: () => api.leads.getAgentLeads(agentId!, params),
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSavedListings(params?: PaginationParams) {
  return useQuery({
    queryKey: ['leads', 'saved', params],
    queryFn: () => api.leads.getSavedListings(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useToggleSavedListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listingId: string) => api.leads.toggleSavedListing(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads', 'saved'] });
    },
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { listing_id: string; interaction_type: 'whatsapp' | 'phone' | 'email' }) =>
      api.leads.createLead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}
