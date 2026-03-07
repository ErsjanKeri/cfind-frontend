'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useBuyerLeads(buyerId?: string) {
  return useQuery({
    queryKey: ['leads', 'buyer', buyerId],
    queryFn: () => api.leads.getBuyerLeads(buyerId!),
    enabled: !!buyerId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAgentLeads(agentId?: string) {
  return useQuery({
    queryKey: ['leads', 'agent', agentId],
    queryFn: () => api.leads.getAgentLeads(agentId!),
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSavedListings() {
  return useQuery({
    queryKey: ['leads', 'saved'],
    queryFn: () => api.leads.getSavedListings(),
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
