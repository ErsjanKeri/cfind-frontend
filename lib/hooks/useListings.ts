'use client';

/**
 * Listings Hooks - Phase 5
 *
 * React Query hooks for listings:
 * - Browse/search listings
 * - Single listing detail
 * - Agent's listings
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ListingFilters, CreateListingRequest } from '@/lib/api/types';

// ============================================================================
// QUERY HOOKS (READ Operations)
// ============================================================================

/**
 * Get all listings with filters and pagination
 */
export function useListings(filters?: ListingFilters) {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: () => api.listings.getListings(filters),
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Get single listing by ID
 */
export function useListing(id: string) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: () => api.listings.getListing(id),
    enabled: !!id, // Only run if ID is provided
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Get agent's own listings
 */
export function useAgentListings(agentId: string) {
  return useQuery({
    queryKey: ['listings', 'agent', agentId],
    queryFn: () => api.listings.getAgentListings(agentId),
    enabled: !!agentId, // Only run if agentId is provided
  });
}

// ============================================================================
// MUTATION HOOKS (WRITE Operations)
// ============================================================================

/**
 * Create new listing (verified agent only)
 *
 * Usage:
 * ```ts
 * const createListing = useCreateListing();
 * await createListing.mutateAsync({
 *   real_business_name: 'My Restaurant',
 *   public_title_en: 'Established Restaurant',
 *   category: 'restaurant',
 *   asking_price_eur: 150000,
 *   // ... other fields
 * });
 * ```
 */
export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.listings.createListing(data as unknown as CreateListingRequest),
    onSuccess: () => {
      // Invalidate listings queries to show new listing
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

/**
 * Update existing listing (owner or admin only)
 *
 * Usage:
 * ```ts
 * const updateListing = useUpdateListing();
 * await updateListing.mutateAsync({
 *   id: 'listing-123',
 *   data: { asking_price_eur: 180000 }
 * });
 * ```
 */
export function useUpdateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      api.listings.updateListing(id, data as Partial<CreateListingRequest>),
    onSuccess: (_, variables) => {
      // Invalidate specific listing and all listings queries
      queryClient.invalidateQueries({ queryKey: ['listing', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

/**
 * Delete listing (owner or admin only)
 *
 * Usage:
 * ```ts
 * const deleteListing = useDeleteListing();
 * await deleteListing.mutateAsync('listing-id-123');
 * ```
 */
export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.listings.deleteListing(id),
    onSuccess: () => {
      // Invalidate all listings queries
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}
