'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { UserRole, CreateAgentRequest, CreateBuyerRequest } from '@/lib/api/types';

export function useAdminStats() {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: () => api.admin.getStats(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAllUsers(role?: UserRole) {
  return useQuery({
    queryKey: ['users', role],
    queryFn: () => api.admin.getUsers(role),
    staleTime: 5 * 60 * 1000,
  });
}

export function useVerifyAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (agentId: string) => api.admin.verifyAgent(agentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });
}

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

export function usePendingListings() {
  return useQuery({
    queryKey: ['admin', 'pendingListings'],
    queryFn: () => api.admin.getPendingListings(),
    staleTime: 30 * 1000,
  });
}

export function useApproveListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listingId: string) => api.admin.approveListing(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pendingListings'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useRejectListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listingId, reason }: { listingId: string; reason: string }) =>
      api.admin.rejectListing(listingId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pendingListings'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}
