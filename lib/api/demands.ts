/**
 * Buyer Demands API client
 *
 * Handles buyer demand operations (reverse marketplace):
 * - Browse active demands
 * - Create demand (buyer)
 * - Update demand status
 * - Delete demand
 * - Claim demand (agent)
 */
import { apiClient, getErrorMessage } from './client';
import type {
  BuyerDemand,
  CreateDemandRequest,
  DemandFilters,
} from './types';

export const demandsApi = {
  /**
   * Get active demands with optional filters (for agents)
   */
  async getDemands(filters?: DemandFilters): Promise<BuyerDemand[]> {
    try {
      const response = await apiClient.get<{ success: boolean; total: number; demands: BuyerDemand[] }>(
        '/api/demands',
        { params: filters }
      );
      return response.data.demands;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get demands for a specific buyer
   */
  async getBuyerDemands(buyerId: string): Promise<BuyerDemand[]> {
    try {
      const response = await apiClient.get<{ success: boolean; total: number; demands: BuyerDemand[] }>(
        `/api/demands/buyer/${buyerId}`
      );
      return response.data.demands;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get demands claimed by a specific agent
   */
  async getAgentDemands(agentId: string): Promise<BuyerDemand[]> {
    try {
      const response = await apiClient.get<{ success: boolean; total: number; demands: BuyerDemand[] }>(
        `/api/demands/agent/${agentId}`
      );
      return response.data.demands;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Create new buyer demand
   */
  async createDemand(data: CreateDemandRequest): Promise<BuyerDemand> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string; demand: BuyerDemand }>(
        '/api/demands',
        data
      );
      return response.data.demand;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Update demand status (fulfilled, closed, etc.)
   */
  async updateDemandStatus(
    id: string,
    status: 'active' | 'assigned' | 'fulfilled' | 'closed'
  ): Promise<BuyerDemand> {
    try {
      const response = await apiClient.put<{ success: boolean; message: string; demand: BuyerDemand }>(
        `/api/demands/${id}/status`,
        { status }
      );
      return response.data.demand;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Delete demand (owner only, only if active status)
   */
  async deleteDemand(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/demands/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Claim demand (agent only)
   * Agent expresses interest, buyer gets notified
   */
  async claimDemand(id: string): Promise<BuyerDemand> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string; demand: BuyerDemand }>(
        `/api/demands/${id}/claim`
      );
      return response.data.demand;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
