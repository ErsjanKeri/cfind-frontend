/**
 * File Upload API client - Simplified Direct Upload
 *
 * All uploads go through the backend, which handles S3 upload internally.
 * Frontend sends files directly to backend endpoints.
 *
 * Flow:
 * 1. Frontend: Select/crop image → Create File/Blob
 * 2. Frontend: Send file to `/api/upload/direct/image` (multipart/form-data)
 * 3. Backend: Receives file → Uploads to S3 → Returns public URL
 * 4. Frontend: Use returned URL for display/storage
 */
import { apiClient, getErrorMessage } from './client';

export const uploadApi = {
  /**
   * Upload file directly through backend (backend handles S3)
   *
   * This is the PRIMARY and ONLY upload method.
   * Backend receives the file, uploads to S3, and returns the public URL.
   *
   * @param file - File or Blob to upload
   * @param category - Upload category (determines S3 folder)
   * @returns Public URL of uploaded file
   *
   * Usage:
   * ```ts
   * const fileUrl = await uploadApi.uploadFile(croppedImageFile, 'avatar');
   * // Returns: "https://spaces.../profiles/xyz.jpg"
   * ```
   */
  async uploadFile(
    file: File | Blob,
    category: 'avatar' | 'listing' | 'document'
  ): Promise<string> {
    try {
      // Map category to S3 folder
      const folderMap: Record<string, string> = {
        avatar: 'profiles',
        listing: 'listings',
        document: 'general',
      };
      const folder = folderMap[category] || 'general';

      // Create FormData for multipart upload (file only, folder is query param)
      const formData = new FormData();
      formData.append('file', file);

      // Send to backend - backend handles S3 upload
      // Note: folder is sent as query parameter, not in FormData
      const response = await apiClient.post<{
        success: boolean;
        url?: string; // Some endpoints return 'url'
        public_url?: string; // Others return 'public_url'
        message?: string;
      }>(
        `/api/upload/direct/image?folder=${folder}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Extract URL from response (handle both field names)
      const fileUrl = response.data.url || response.data.public_url;

      if (!fileUrl) {
        throw new Error('Backend did not return file URL');
      }

      return fileUrl;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
