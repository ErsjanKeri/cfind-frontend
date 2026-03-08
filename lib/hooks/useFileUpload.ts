'use client';

import { useState } from 'react';
import { uploadApi } from '@/lib/api';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/utils';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (
    file: File,
    category: 'avatar' | 'listing' | 'document'
  ): Promise<string | null> => {
    setIsUploading(true);

    try {
      if (file.size > MAX_FILE_SIZE) {
        toast.error('File size must be less than 10MB');
        return null;
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error('Invalid file type. Only JPEG, PNG, and PDF allowed.');
        return null;
      }

      const fileUrl = await uploadApi.uploadFile(file, category);
      toast.success('File uploaded successfully');
      return fileUrl;
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to upload file'));
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadMultiple = async (
    files: File[],
    category: 'avatar' | 'listing' | 'document'
  ): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    for (const file of files) {
      const url = await uploadFile(file, category);
      if (url) uploadedUrls.push(url);
    }
    return uploadedUrls;
  };

  return { uploadFile, uploadMultiple, isUploading };
}
