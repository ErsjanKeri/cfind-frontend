import { apiClient, apiCall } from './client';
import type {
  AdminStats,
  UserWithProfile,
  UserRole,
  CreateAgentRequest,
  CreateBuyerRequest,
  City,
  Neighbourhood,
  Listing,
} from './types';

export const adminApi = {
  async getStats(): Promise<AdminStats> {
    return apiCall(async () => {
      const response = await apiClient.get<{ success: boolean; stats: AdminStats }>('/api/admin/stats');
      return response.data.stats;
    });
  },

  async getUsers(role?: UserRole): Promise<UserWithProfile[]> {
    return apiCall(async () => {
      const response = await apiClient.get<{ success: boolean; total: number; users: UserWithProfile[] }>(
        '/api/admin/users',
        { params: { role } }
      );
      return response.data.users;
    });
  },

  async verifyAgent(agentId: string): Promise<{ message: string }> {
    return apiCall(async () => {
      const response = await apiClient.post<{ message: string }>(
        `/api/admin/agents/${agentId}/verify`
      );
      return response.data;
    });
  },

  async rejectAgent(agentId: string, reason: string): Promise<{ message: string }> {
    return apiCall(async () => {
      const response = await apiClient.post<{ message: string }>(
        `/api/admin/agents/${agentId}/reject`,
        { rejection_reason: reason }
      );
      return response.data;
    });
  },

  async deleteUser(userId: string): Promise<{ message: string }> {
    return apiCall(async () => {
      const response = await apiClient.delete<{ message: string }>(
        `/api/admin/users/${userId}`
      );
      return response.data;
    });
  },

  async toggleEmailVerification(userId: string, emailVerified: boolean): Promise<{ message: string }> {
    return apiCall(async () => {
      const response = await apiClient.post<{ message: string }>(
        `/api/admin/users/${userId}/toggle-email-verification`,
        { email_verified: emailVerified }
      );
      return response.data;
    });
  },

  async adjustCredits(
    agentId: string,
    amount: number,
    reason: string
  ): Promise<{ message: string; new_balance: number }> {
    return apiCall(async () => {
      const response = await apiClient.post<{ message: string; new_balance: number }>(
        '/api/admin/credits/adjust',
        { agent_id: agentId, amount, reason }
      );
      return response.data;
    });
  },

  async createAgent(data: CreateAgentRequest): Promise<UserWithProfile> {
    return apiCall(async () => {
      const response = await apiClient.post<UserWithProfile>('/api/admin/agents', data);
      return response.data;
    });
  },

  async createBuyer(data: CreateBuyerRequest): Promise<UserWithProfile> {
    return apiCall(async () => {
      const response = await apiClient.post<UserWithProfile>('/api/admin/buyers', data);
      return response.data;
    });
  },

  async createCity(countryCode: string, name: string): Promise<City> {
    return apiCall(async () => {
      const response = await apiClient.post<{ city: City }>(
        `/api/admin/geography/${countryCode}/cities`,
        { name }
      );
      return response.data.city;
    });
  },

  async updateCity(cityId: number, name: string): Promise<City> {
    return apiCall(async () => {
      const response = await apiClient.put<{ city: City }>(
        `/api/admin/geography/cities/${cityId}`,
        { name }
      );
      return response.data.city;
    });
  },

  async createNeighbourhood(cityId: number, name: string): Promise<Neighbourhood> {
    return apiCall(async () => {
      const response = await apiClient.post<{ neighbourhood: Neighbourhood }>(
        `/api/admin/geography/cities/${cityId}/neighbourhoods`,
        { name }
      );
      return response.data.neighbourhood;
    });
  },

  async getPendingListings(page = 1): Promise<{ listings: Listing[]; total: number; total_pages: number }> {
    return apiCall(async () => {
      const response = await apiClient.get<{ listings: Listing[]; total: number; total_pages: number }>(
        '/api/admin/listings/pending',
        { params: { page } }
      );
      return response.data;
    });
  },

  async approveListing(listingId: string): Promise<{ message: string }> {
    return apiCall(async () => {
      const response = await apiClient.post<{ message: string }>(
        `/api/admin/listings/${listingId}/approve`
      );
      return response.data;
    });
  },

  async rejectListing(listingId: string, reason: string): Promise<{ message: string }> {
    return apiCall(async () => {
      const response = await apiClient.post<{ message: string }>(
        `/api/admin/listings/${listingId}/reject`,
        { reason }
      );
      return response.data;
    });
  },
};
