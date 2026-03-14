import { apiClient, apiCall } from './client';
import type { UserWithProfile } from './types';

export const userApi = {
  async getProfile(): Promise<UserWithProfile> {
    return apiCall(async () => {
      const response = await apiClient.get<UserWithProfile>('/api/users/me');
      return response.data;
    });
  },

  async updateProfile(data: Partial<UserWithProfile>): Promise<UserWithProfile> {
    return apiCall(async () => {
      const response = await apiClient.put<UserWithProfile>('/api/users/me', data);
      return response.data;
    });
  },

  async updateAgentProfile(data: {
    license_number?: string;
    whatsapp_number?: string;
    bio_en?: string;
    license_document?: File | null;
    company_document?: File | null;
    id_document?: File | null;
  }): Promise<UserWithProfile> {
    return apiCall(async () => {
      const formData = new FormData();

      if (data.license_number !== undefined) formData.append('license_number', data.license_number);
      if (data.whatsapp_number !== undefined) formData.append('whatsapp_number', data.whatsapp_number);
      if (data.bio_en !== undefined) formData.append('bio_en', data.bio_en);

      if (data.license_document) formData.append('license_document', data.license_document);
      if (data.company_document) formData.append('company_document', data.company_document);
      if (data.id_document) formData.append('id_document', data.id_document);

      const response = await apiClient.put<UserWithProfile>(
        '/api/users/me/agent-profile',
        formData,
      );
      return response.data;
    });
  },

  async uploadAvatar(file: File): Promise<{ avatar_url: string }> {
    return apiCall(async () => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<{ avatar_url: string }>(
        '/api/users/upload-avatar',
        formData,
      );
      return response.data;
    });
  },
};
