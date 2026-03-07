import { apiClient, apiCall } from './client';
import type { BuyerLead, AgentLead, Listing, CreateLeadRequest } from './types';

export const leadsApi = {
  async getBuyerLeads(buyerId: string): Promise<BuyerLead[]> {
    return apiCall(async () => {
      const response = await apiClient.get<{ success: boolean; total: number; leads: BuyerLead[] }>(
        `/api/leads/buyer/${buyerId}`
      );
      return response.data.leads;
    });
  },

  async getAgentLeads(agentId: string): Promise<AgentLead[]> {
    return apiCall(async () => {
      const response = await apiClient.get<{ success: boolean; total: number; leads: AgentLead[] }>(
        `/api/leads/agent/${agentId}`
      );
      return response.data.leads;
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

  async deleteLead(leadId: string): Promise<void> {
    return apiCall(async () => {
      await apiClient.delete(`/api/leads/${leadId}`);
    });
  },

  async getSavedListings(): Promise<Listing[]> {
    return apiCall(async () => {
      const response = await apiClient.get<{ success: boolean; total: number; listings: Listing[] }>(
        '/api/leads/saved'
      );
      return response.data.listings;
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
