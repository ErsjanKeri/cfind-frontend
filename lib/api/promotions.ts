import { apiClient, apiCall } from './client';
import type {
  CreditPackage,
  PromotionTierConfig,
  CreditTransaction,
  PromotionHistory,
  PromoteListingRequest,
  PurchaseCreditsRequest,
} from './types';

export const promotionsApi = {
  async getCreditPackages(): Promise<CreditPackage[]> {
    return apiCall(async () => {
      const response = await apiClient.get<{ packages: CreditPackage[] }>(
        '/api/promotions/packages'
      );
      return response.data.packages;
    });
  },

  async getPromotionTiers(): Promise<PromotionTierConfig[]> {
    return apiCall(async () => {
      const response = await apiClient.get<{ tiers: PromotionTierConfig[] }>(
        '/api/promotions/tiers'
      );
      return response.data.tiers;
    });
  },

  async getCredits(): Promise<{ balance: number; transactions: CreditTransaction[] }> {
    return apiCall(async () => {
      const response = await apiClient.get<{ balance: number; transactions: CreditTransaction[] }>(
        '/api/promotions/credits'
      );
      return response.data;
    });
  },

  async getActivePromotions(): Promise<PromotionHistory[]> {
    return apiCall(async () => {
      const response = await apiClient.get<PromotionHistory[]>('/api/promotions/active');
      return response.data;
    });
  },

  async purchaseCredits(data: PurchaseCreditsRequest): Promise<{ message: string; new_balance: number }> {
    return apiCall(async () => {
      const response = await apiClient.post<{ message: string; new_balance: number }>(
        '/api/promotions/purchase',
        data
      );
      return response.data;
    });
  },

  async promoteListing(
    listingId: string,
    data: PromoteListingRequest
  ): Promise<{ message: string; promotion: PromotionHistory; new_balance: number }> {
    return apiCall(async () => {
      const response = await apiClient.post<{
        message: string;
        promotion: PromotionHistory;
        new_balance: number;
      }>(`/api/promotions/${listingId}/promote`, data);
      return response.data;
    });
  },

  async cancelPromotion(listingId: string): Promise<{ message: string; refunded_credits: number }> {
    return apiCall(async () => {
      const response = await apiClient.post<{ message: string; refunded_credits: number }>(
        `/api/promotions/${listingId}/cancel`
      );
      return response.data;
    });
  },
};
