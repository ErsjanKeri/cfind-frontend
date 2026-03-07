import { apiClient, apiCall } from './client';

const FOLDER_MAP: Record<string, string> = {
  avatar: 'profiles',
  listing: 'listings',
  document: 'general',
};

export const uploadApi = {
  async uploadFile(
    file: File | Blob,
    category: 'avatar' | 'listing' | 'document'
  ): Promise<string> {
    return apiCall(async () => {
      const folder = FOLDER_MAP[category];
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<{
        success: boolean;
        url?: string;
        public_url?: string;
      }>(
        `/api/upload/direct/image?folder=${folder}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const fileUrl = response.data.url || response.data.public_url;
      if (!fileUrl) {
        throw new Error('Backend did not return file URL');
      }
      return fileUrl;
    });
  },
};
