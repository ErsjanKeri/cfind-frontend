'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { USER_QUERY_KEY } from './useAuth';

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
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}
