/**
 * Leads API client
 *
 * Handles lead/contact operations:
 * - Get user's leads (buyer sees their contacts, agent sees who contacted them)
 * - Create lead (contact agent)
 * - Delete lead
 */
import { apiClient, getErrorMessage } from './client';
import type { BuyerLead, AgentLead, Listing, CreateLeadRequest } from './types';

export const leadsApi = {
  /**
   * Get leads for a specific buyer (buyer's contact history)
   */
  async getBuyerLeads(buyerId: string): Promise<BuyerLead[]> {
    try {
      const response = await apiClient.get<{ success: boolean; total: number; leads: BuyerLead[] }>(
        `/api/leads/buyer/${buyerId}`
      );
      return response.data.leads;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get leads for a specific agent (who contacted them)
   */
  async getAgentLeads(agentId: string): Promise<AgentLead[]> {
    try {
      const response = await apiClient.get<{ success: boolean; total: number; leads: AgentLead[] }>(
        `/api/leads/agent/${agentId}`
      );
      return response.data.leads;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Create new lead (buyer contacts agent about listing)
   */
  async createLead(data: CreateLeadRequest): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string; lead: any }>(
        '/api/leads',
        data
      );
      return { success: response.data.success, message: response.data.message };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Delete lead
   */
  async deleteLead(leadId: string): Promise<void> {
    try {
      await apiClient.delete(`/api/leads/${leadId}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get saved listings for current buyer
   */
  async getSavedListings(): Promise<Listing[]> {
    try {
      const response = await apiClient.get<{ success: boolean; total: number; listings: Listing[] }>(
        '/api/leads/saved'
      );
      return response.data.listings;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Toggle save/unsave listing (bookmark)
   */
  async toggleSavedListing(listingId: string): Promise<{ is_saved: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string; is_saved: boolean }>(
        `/api/leads/saved/${listingId}`
      );
      return { is_saved: response.data.is_saved, message: response.data.message };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};