/**
 * Admin API client
 *
 * Handles admin-only operations:
 * - Get platform statistics
 * - Manage users
 * - Verify/reject agents
 * - Adjust credits
 * - Create users manually
 */
import { apiClient, getErrorMessage } from './client';
import type {
  AdminStats,
  UserWithProfile,
  UserRole,
  CreateAgentRequest,
  CreateBuyerRequest,
} from './types';

export const adminApi = {
  /**
   * Get platform statistics (admin dashboard)
   */
  async getStats(): Promise<AdminStats> {
    try {
      const response = await apiClient.get<AdminStats>('/api/admin/stats');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get all users with optional role filter
   */
  async getUsers(role?: UserRole): Promise<UserWithProfile[]> {
    try {
      const response = await apiClient.get<{ success: boolean; total: number; users: UserWithProfile[] }>(
        '/api/admin/users',
        { params: { role } }
      );
      // Backend returns { success, total, users } - extract users array
      return response.data.users;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Verify agent (approve verification request)
   */
  async verifyAgent(agentId: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>(
        `/api/admin/agents/${agentId}/verify`
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Reject agent verification with reason (sends email to agent)
   */
  async rejectAgent(
    agentId: string,
    reason: string
  ): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>(
        `/api/admin/agents/${agentId}/reject`,
        { reason }
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Delete user (hard delete)
   */
  async deleteUser(userId: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<{ message: string }>(
        `/api/admin/users/${userId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Toggle user's email verification status
   */
  async toggleEmailVerification(userId: string, emailVerified: boolean): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>(
        `/api/admin/users/${userId}/toggle-email-verification`,
        { email_verified: emailVerified }
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Adjust agent credits (add or subtract)
   */
  async adjustCredits(
    agentId: string,
    amount: number,
    reason: string
  ): Promise<{ message: string; new_balance: number }> {
    try {
      const response = await apiClient.post<{
        message: string;
        new_balance: number;
      }>('/api/admin/credits/adjust', {
        agent_id: agentId,
        amount,
        reason,
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Create agent manually (admin only)
   */
  async createAgent(data: CreateAgentRequest): Promise<UserWithProfile> {
    try {
      const response = await apiClient.post<UserWithProfile>(
        '/api/admin/agents',
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Create buyer manually (admin only)
   */
  async createBuyer(data: CreateBuyerRequest): Promise<UserWithProfile> {
    try {
      const response = await apiClient.post<UserWithProfile>(
        '/api/admin/buyers',
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};