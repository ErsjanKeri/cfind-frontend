'use client';

/**
 * File Upload Hook
 *
 * Handles file uploads to DigitalOcean Spaces via backend presigned URLs
 *
 * Features:
 * - Progress tracking
 * - File validation (size, type)
 * - Single and multiple file uploads
 * - Toast notifications
 * - Error handling
 */
import { useState } from 'react';
import { uploadApi } from '@/lib/api';
import { toast } from 'sonner';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Hook for file uploads
 *
 * Usage:
 *   const { uploadFile, isUploading, progress } = useFileUpload();
 *   const fileUrl = await uploadFile(file, 'listing');
 */
export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);

  /**
   * Upload single file
   */
  const uploadFile = async (
    file: File,
    category: 'avatar' | 'listing' | 'document'
  ) => {
    setIsUploading(true);
    setProgress({ loaded: 0, total: file.size, percentage: 0 });

    try {
      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error('File size must be less than 10MB');
        return null;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Only JPEG, PNG, and PDF allowed.');
        return null;
      }

      // Upload via backend API (gets presigned URL + uploads to S3)
      const fileUrl = await uploadApi.uploadFile(file, category);

      setProgress({ loaded: file.size, total: file.size, percentage: 100 });
      toast.success('File uploaded successfully');

      return fileUrl;
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
      toast.error(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
      // Clear progress after a short delay
      setTimeout(() => setProgress(null), 1000);
    }
  };

  /**
   * Upload multiple files sequentially
   */
  const uploadMultiple = async (
    files: File[],
    category: 'avatar' | 'listing' | 'document'
  ) => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const url = await uploadFile(file, category);
      if (url) {
        uploadedUrls.push(url);
      }
    }

    return uploadedUrls;
  };

  return {
    uploadFile,
    uploadMultiple,
    isUploading,
    progress,
  };
}