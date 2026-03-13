'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { CountryCode } from '@/lib/constants';

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: () => api.geography.getCountries(),
    staleTime: Infinity,
  });
}

export function useCities(countryCode?: CountryCode | string) {
  return useQuery({
    queryKey: ['cities', countryCode],
    queryFn: () => api.geography.getCities(countryCode!),
    enabled: !!countryCode,
    staleTime: Infinity,
  });
}

/** Returns city names as a simple string array. */
export function useCityNames(countryCode?: CountryCode | string) {
  const { data, ...rest } = useCities(countryCode);
  return {
    ...rest,
    data: data?.cities.map((c) => c.name) ?? [],
  };
}

export function useNeighbourhoods(cityId?: number) {
  return useQuery({
    queryKey: ['neighbourhoods', cityId],
    queryFn: () => api.geography.getNeighbourhoods(cityId!),
    enabled: !!cityId,
    staleTime: Infinity,
  });
}

/** Returns neighbourhood names as a simple string array. */
export function useNeighbourhoodNames(cityId?: number) {
  const { data, ...rest } = useNeighbourhoods(cityId);
  return {
    ...rest,
    data: data?.neighbourhoods.map((n) => n.name) ?? [],
  };
}

export function useAdminCreateCity(countryCode: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => api.admin.createCity(countryCode, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities', countryCode] });
    },
  });
}

export function useAdminUpdateCity(countryCode: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cityId, name }: { cityId: number; name: string }) =>
      api.admin.updateCity(cityId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities', countryCode] });
    },
  });
}

export function useAdminDeleteCity(countryCode: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cityId: number) => api.admin.deleteCity(cityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities', countryCode] });
    },
  });
}

export function useAdminCreateNeighbourhood(cityId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => api.admin.createNeighbourhood(cityId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['neighbourhoods', cityId] });
    },
  });
}

export function useAdminDeleteNeighbourhood(cityId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (neighbourhoodId: number) => api.admin.deleteNeighbourhood(neighbourhoodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['neighbourhoods', cityId] });
    },
  });
}
