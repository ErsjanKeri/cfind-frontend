import { apiClient, apiCall } from './client';
import type {
  CreateLeadRequest,
  BuyerLeadsResponse, AgentLeadsResponse, ListingsResponse,
  PaginationParams,
} from './types';

export const leadsApi = {
  async getBuyerLeads(buyerId: string, params?: PaginationParams): Promise<BuyerLeadsResponse> {
    return apiCall(async () => {
      const response = await apiClient.get<BuyerLeadsResponse>(
        `/api/leads/buyer/${buyerId}`,
        { params }
      );
      return response.data;
    });
  },

  async getAgentLeads(agentId: string, params?: PaginationParams): Promise<AgentLeadsResponse> {
    return apiCall(async () => {
      const response = await apiClient.get<AgentLeadsResponse>(
        `/api/leads/agent/${agentId}`,
        { params }
      );
      return response.data;
    });
  },

  async createLead(data: CreateLeadRequest): Promise<{ success: boolean; message: string }> {
    return apiCall(async () => {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        '/api/leads',
        data
      );
      return response.data;
    });
  },

  async deleteLead(id: string): Promise<void> {
    return apiCall(async () => {
      await apiClient.delete(`/api/leads/${id}`);
    });
  },

  async getSavedListings(params?: PaginationParams): Promise<ListingsResponse> {
    return apiCall(async () => {
      const response = await apiClient.get<ListingsResponse>(
        '/api/leads/saved',
        { params }
      );
      return response.data;
    });
  },

  async toggleSavedListing(listingId: string): Promise<{ is_saved: boolean; message: string }> {
    return apiCall(async () => {
      const response = await apiClient.post<{ success: boolean; message: string; is_saved: boolean }>(
        `/api/leads/saved/${listingId}`
      );
      return { is_saved: response.data.is_saved, message: response.data.message };
    });
  },
};
