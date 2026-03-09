import { apiClient, apiCall } from './client';
import type {
  ChatMessageRequest,
  ChatMessageResponse,
  Conversation,
  ConversationDetail,
} from './types';

export const chatApi = {
  async sendMessage(data: ChatMessageRequest): Promise<ChatMessageResponse> {
    return apiCall(async () => {
      const response = await apiClient.post<ChatMessageResponse>(
        '/api/chat/message',
        data
      );
      return response.data;
    });
  },

  async getConversations(): Promise<Conversation[]> {
    return apiCall(async () => {
      const response = await apiClient.get<Conversation[]>(
        '/api/chat/conversations'
      );
      return response.data;
    });
  },

  async getConversation(id: string): Promise<ConversationDetail> {
    return apiCall(async () => {
      const response = await apiClient.get<ConversationDetail>(
        `/api/chat/conversations/${id}`
      );
      return response.data;
    });
  },

  async deleteConversation(id: string): Promise<void> {
    return apiCall(async () => {
      await apiClient.delete(`/api/chat/conversations/${id}`);
    });
  },
};
