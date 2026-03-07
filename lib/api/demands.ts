import { apiClient, apiCall } from './client';
import type {
  BuyerDemand,
  CreateDemandRequest,
  DemandFilters,
} from './types';

export const demandsApi = {
  async getDemands(filters?: DemandFilters): Promise<BuyerDemand[]> {
    return apiCall(async () => {
      const response = await apiClient.get<{ success: boolean; total: number; demands: BuyerDemand[] }>(
        '/api/demands',
        { params: filters }
      );
      return response.data.demands;
    });
  },

  async getBuyerDemands(buyerId: string): Promise<BuyerDemand[]> {
    return apiCall(async () => {
      const response = await apiClient.get<{ success: boolean; total: number; demands: BuyerDemand[] }>(
        `/api/demands/buyer/${buyerId}`
      );
      return response.data.demands;
    });
  },

  async getAgentDemands(agentId: string): Promise<BuyerDemand[]> {
    return apiCall(async () => {
      const response = await apiClient.get<{ success: boolean; total: number; demands: BuyerDemand[] }>(
        `/api/demands/agent/${agentId}`
      );
      return response.data.demands;
    });
  },

  async createDemand(data: CreateDemandRequest): Promise<BuyerDemand> {
    return apiCall(async () => {
      const response = await apiClient.post<{ success: boolean; message: string; demand: BuyerDemand }>(
        '/api/demands',
        data
      );
      return response.data.demand;
    });
  },

  async updateDemandStatus(
    id: string,
    status: 'active' | 'assigned' | 'fulfilled' | 'closed'
  ): Promise<BuyerDemand> {
    return apiCall(async () => {
      const response = await apiClient.put<{ success: boolean; message: string; demand: BuyerDemand }>(
        `/api/demands/${id}/status`,
        { status }
      );
      return response.data.demand;
    });
  },

  async deleteDemand(id: string): Promise<void> {
    return apiCall(async () => {
      await apiClient.delete(`/api/demands/${id}`);
    });
  },

  async claimDemand(id: string): Promise<BuyerDemand> {
    return apiCall(async () => {
      const response = await apiClient.post<{ success: boolean; message: string; demand: BuyerDemand }>(
        `/api/demands/${id}/claim`
      );
      return response.data.demand;
    });
  },
};
