/**
 * Listings API client
 *
 * Handles all listing operations:
 * - Browse/search listings
 * - Get single listing
 * - Create listing (agent only)
 * - Update listing
 * - Delete listing
 * - Get agent's listings
 */
import { apiClient, getErrorMessage } from './client';
import type {
  Listing,
  ListingsResponse,
  CreateListingRequest,
  ListingFilters,
} from './types';

export const listingsApi = {
  /**
   * Get all listings with optional filters and pagination
   */
  async getListings(filters?: ListingFilters): Promise<ListingsResponse> {
    try {
      const response = await apiClient.get<ListingsResponse>('/api/listings', {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get single listing by ID
   */
  async getListing(id: string): Promise<Listing> {
    try {
      const response = await apiClient.get<{success: boolean; listing: Listing}>(`/api/listings/${id}`);
      return response.data.listing; // Extract listing from wrapper
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Create new listing (agent only)
   */
  async createListing(data: CreateListingRequest): Promise<Listing> {
    try {
      const response = await apiClient.post<Listing>('/api/listings', data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Update existing listing (owner/admin only)
   */
  async updateListing(
    id: string,
    data: Partial<CreateListingRequest>
  ): Promise<Listing> {
    try {
      const response = await apiClient.put<Listing>(`/api/listings/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Delete listing (owner/admin only)
   */
  async deleteListing(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/listings/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get all listings for specific agent
   */
  async getAgentListings(agentId: string): Promise<Listing[]> {
    try {
      const response = await apiClient.get<{ success: boolean; total: number; listings: Listing[] }>(
        `/api/listings/agent/${agentId}`
      );
      return response.data.listings;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};