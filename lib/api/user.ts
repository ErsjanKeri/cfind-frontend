/**
 * User API client
 *
 * Handles user profile operations:
 * - Get profile
 * - Update profile
 * - Upload avatar
 */
import { apiClient, getErrorMessage } from './client';
import type { UserWithProfile } from './types';

export const userApi = {
  /**
   * Get current user's profile
   */
  async getProfile(): Promise<UserWithProfile> {
    try {
      const response = await apiClient.get<UserWithProfile>('/api/users/me');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Update user profile (agent or buyer)
   */
  async updateProfile(data: Partial<UserWithProfile>): Promise<UserWithProfile> {
    try {
      const response = await apiClient.put<UserWithProfile>(
        '/api/users/me',
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Update agent profile (agent-specific fields + documents)
   */
  async updateAgentProfile(data: {
    license_number?: string;
    whatsapp_number?: string;
    bio_en?: string;
    license_document?: File | null;
    company_document?: File | null;
    id_document?: File | null;
  }): Promise<any> {
    try {
      const formData = new FormData();

      // Add text fields
      if (data.license_number !== undefined) formData.append('license_number', data.license_number);
      if (data.whatsapp_number !== undefined) formData.append('whatsapp_number', data.whatsapp_number);
      if (data.bio_en !== undefined) formData.append('bio_en', data.bio_en);

      // Add document files
      if (data.license_document) formData.append('license_document', data.license_document);
      if (data.company_document) formData.append('company_document', data.company_document);
      if (data.id_document) formData.append('id_document', data.id_document);

      const response = await apiClient.put(
        '/api/users/me/agent-profile',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Upload profile avatar image
   */
  async uploadAvatar(file: File): Promise<{ avatar_url: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<{ avatar_url: string }>(
        '/api/users/upload-avatar',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};