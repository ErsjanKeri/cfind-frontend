'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ChatMessageRequest } from '@/lib/api/types';

export function useConversations() {
  return useQuery({
    queryKey: ['chat', 'conversations'],
    queryFn: () => api.chat.getConversations(),
    staleTime: 30 * 1000,
  });
}

export function useConversation(id: string | null) {
  return useQuery({
    queryKey: ['chat', 'conversation', id],
    queryFn: () => api.chat.getConversation(id!),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChatMessageRequest) => api.chat.sendMessage(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
      queryClient.invalidateQueries({
        queryKey: ['chat', 'conversation', response.conversation_id],
      });
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.chat.deleteConversation(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
      queryClient.removeQueries({ queryKey: ['chat', 'conversation', id] });
    },
  });
}
