'use client';

/**
 * Leads Hooks - Enhanced with buyer/agent specific queries
 *
 * React Query hooks for lead/contact operations
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// ============================================================================
// QUERY HOOKS (READ Operations)
// ============================================================================

/**
 * Get leads for a specific buyer (contact history)
 */
export function useBuyerLeads(buyerId?: string) {
  return useQuery({
    queryKey: ['leads', 'buyer', buyerId],
    queryFn: () => api.leads.getBuyerLeads(buyerId!),
    enabled: !!buyerId, // Only fetch if buyerId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get leads for a specific agent (who contacted them)
 */
export function useAgentLeads(agentId?: string) {
  return useQuery({
    queryKey: ['leads', 'agent', agentId],
    queryFn: () => api.leads.getAgentLeads(agentId!),
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get saved listings for current buyer
 */
export function useSavedListings() {
  return useQuery({
    queryKey: ['leads', 'saved'],
    queryFn: () => api.leads.getSavedListings(),
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================================================
// MUTATION HOOKS (WRITE Operations) - Will enhance in Phase 3
// ============================================================================

/**
 * Toggle save/unsave listing
 */
export function useToggleSavedListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listingId: string) => api.leads.toggleSavedListing(listingId),
    onSuccess: () => {
      // Invalidate saved listings cache
      queryClient.invalidateQueries({ queryKey: ['leads', 'saved'] });
    },
  });
}

/**
 * Create lead (buyer contacts agent about listing)
 *
 * Usage:
 * ```ts
 * const createLead = useCreateLead();
 * await createLead.mutateAsync({ listing_id: '123', interaction_type: 'whatsapp' });
 * ```
 */
export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { listing_id: string; interaction_type: 'whatsapp' | 'phone' | 'email' }) =>
      api.leads.createLead(data),
    onSuccess: () => {
      // Invalidate buyer leads cache to show new contact
      queryClient.invalidateQueries({ queryKey: ['leads', 'buyer'] });
    },
  });
}

/**
 * Delete lead
 *
 * Usage:
 * ```ts
 * const deleteLead = useDeleteLead();
 * await deleteLead.mutateAsync('lead-id-123');
 * ```
 */
export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (leadId: string) => api.leads.deleteLead(leadId),
    onSuccess: () => {
      // Invalidate all lead queries
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}
