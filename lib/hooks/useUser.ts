'use client';

/**
 * User Profile Mutation Hooks
 *
 * React Query hooks for user profile operations
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { USER_QUERY_KEY } from './useAuth';

/**
 * Update user profile
 *
 * Usage:
 * ```ts
 * const updateProfile = useUpdateProfile();
 * await updateProfile.mutateAsync({ name: 'New Name', image: 'url' });
 * ```
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name?: string;
      email?: string;
      image?: string;
      phone_number?: string;
      company_name?: string;
      website?: string;
    }) => api.user.updateProfile(data),
    onSuccess: () => {
      // Invalidate user query to refetch updated profile
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}

/**
 * Upload profile avatar
 *
 * Usage:
 * ```ts
 * const uploadAvatar = useUploadAvatar();
 * await uploadAvatar.mutateAsync(croppedImageFile);
 * ```
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => api.user.uploadAvatar(file),
    onSuccess: () => {
      // Invalidate user query to show new avatar
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}
