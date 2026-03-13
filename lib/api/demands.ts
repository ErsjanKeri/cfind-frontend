import { apiClient, apiCall } from './client';
import type {
  BuyerDemand,
  CreateDemandRequest,
  DemandFilters,
  BuyerDemandsResponse,
  PaginationParams,
} from './types';

export const demandsApi = {
  async getDemands(filters?: DemandFilters): Promise<BuyerDemandsResponse> {
    return apiCall(async () => {
      const response = await apiClient.get<BuyerDemandsResponse>(
        '/api/demands',
        { params: filters }
      );
      return response.data;
    });
  },

  async getBuyerDemands(buyerId: string, params?: PaginationParams): Promise<BuyerDemandsResponse> {
    return apiCall(async () => {
      const response = await apiClient.get<BuyerDemandsResponse>(
        `/api/demands/buyer/${buyerId}`,
        { params }
      );
      return response.data;
    });
  },

  async getAgentDemands(agentId: string, params?: PaginationParams): Promise<BuyerDemandsResponse> {
    return apiCall(async () => {
      const response = await apiClient.get<BuyerDemandsResponse>(
        `/api/demands/agent/${agentId}`,
        { params }
      );
      return response.data;
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
