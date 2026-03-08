import { apiClient, apiCall } from './client';
import type {
  Listing,
  ListingsResponse,
  AgentListingsResponse,
  CreateListingRequest,
  ListingFilters,
  PaginationParams,
} from './types';

export const listingsApi = {
  async getListings(filters?: ListingFilters): Promise<ListingsResponse> {
    return apiCall(async () => {
      const response = await apiClient.get<ListingsResponse>('/api/listings', {
        params: filters,
      });
      return response.data;
    });
  },

  async getListing(id: string): Promise<Listing> {
    return apiCall(async () => {
      const response = await apiClient.get<{ success: boolean; listing: Listing }>(
        `/api/listings/${id}`
      );
      return response.data.listing;
    });
  },

  async createListing(data: CreateListingRequest): Promise<Listing> {
    return apiCall(async () => {
      const response = await apiClient.post<Listing>('/api/listings', data);
      return response.data;
    });
  },

  async updateListing(id: string, data: Partial<CreateListingRequest>): Promise<Listing> {
    return apiCall(async () => {
      const response = await apiClient.put<Listing>(`/api/listings/${id}`, data);
      return response.data;
    });
  },

  async deleteListing(id: string): Promise<void> {
    return apiCall(async () => {
      await apiClient.delete(`/api/listings/${id}`);
    });
  },

  async getAgentListings(agentId: string, params?: PaginationParams): Promise<AgentListingsResponse> {
    return apiCall(async () => {
      const response = await apiClient.get<AgentListingsResponse>(
        `/api/listings/agent/${agentId}`,
        { params }
      );
      return response.data;
    });
  },
};
