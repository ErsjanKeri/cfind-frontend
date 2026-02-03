/**
 * Promotions & Credits API client
 *
 * Handles promotion system operations:
 * - Get credit packages
 * - Get promotion tiers
 * - Get credit balance and history
 * - Purchase credits
 * - Promote listing
 * - Cancel promotion
 */
import { apiClient, getErrorMessage } from './client';
import type {
  CreditPackage,
  PromotionTierConfig,
  CreditTransaction,
  PromotionHistory,
  PromoteListingRequest,
  PurchaseCreditsRequest,
} from './types';

export const promotionsApi = {
  /**
   * Get all available credit packages
   */
  async getCreditPackages(): Promise<CreditPackage[]> {
    try {
      const response = await apiClient.get<{ packages: CreditPackage[] }>(
        '/api/promotions/packages'
      );
      return response.data.packages;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get promotion tier configurations
   */
  async getPromotionTiers(): Promise<PromotionTierConfig[]> {
    try {
      const response = await apiClient.get<{ tiers: PromotionTierConfig[] }>(
        '/api/promotions/tiers'
      );
      return response.data.tiers;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get agent's credit balance and transaction history
   */
  async getCredits(): Promise<{
    balance: number;
    transactions: CreditTransaction[];
  }> {
    try {
      const response = await apiClient.get<{
        balance: number;
        transactions: CreditTransaction[];
      }>('/api/promotions/credits');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get agent's active promotions
   */
  async getActivePromotions(): Promise<PromotionHistory[]> {
    try {
      const response = await apiClient.get<PromotionHistory[]>(
        '/api/promotions/active'
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Purchase credits (simulated payment for now)
   */
  async purchaseCredits(
    data: PurchaseCreditsRequest
  ): Promise<{ message: string; new_balance: number }> {
    try {
      const response = await apiClient.post<{
        message: string;
        new_balance: number;
      }>('/api/promotions/purchase', data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Promote listing to featured or premium tier
   */
  async promoteListing(
    listingId: string,
    data: PromoteListingRequest
  ): Promise<{
    message: string;
    promotion: PromotionHistory;
    new_balance: number;
  }> {
    try {
      const response = await apiClient.post<{
        message: string;
        promotion: PromotionHistory;
        new_balance: number;
      }>(`/api/promotions/${listingId}/promote`, data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Cancel active promotion (with partial refund)
   */
  async cancelPromotion(
    listingId: string
  ): Promise<{ message: string; refunded_credits: number }> {
    try {
      const response = await apiClient.post<{
        message: string;
        refunded_credits: number;
      }>(`/api/promotions/${listingId}/cancel`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};