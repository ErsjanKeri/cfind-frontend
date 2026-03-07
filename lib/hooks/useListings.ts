'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ListingFilters, CreateListingRequest } from '@/lib/api/types';

export function useListings(filters?: ListingFilters) {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: () => api.listings.getListings(filters),
    staleTime: 60 * 1000,
  });
}

export function useListing(id: string) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: () => api.listings.getListing(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

export function useAgentListings(agentId: string) {
  return useQuery({
    queryKey: ['listings', 'agent', agentId],
    queryFn: () => api.listings.getAgentListings(agentId),
    enabled: !!agentId,
    staleTime: 60 * 1000,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateListingRequest) => api.listings.createListing(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useUpdateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateListingRequest> }) =>
      api.listings.updateListing(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['listing', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}
