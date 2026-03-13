import { apiClient, apiCall } from './client';
import type { CountryListResponse, CitiesListResponse, NeighbourhoodsListResponse } from './types';

export const geographyApi = {
  async getCountries(): Promise<CountryListResponse> {
    return apiCall(async () => {
      const response = await apiClient.get<CountryListResponse>('/api/countries');
      return response.data;
    });
  },

  async getCities(countryCode: string): Promise<CitiesListResponse> {
    return apiCall(async () => {
      const response = await apiClient.get<CitiesListResponse>(
        `/api/countries/${countryCode}/cities`
      );
      return response.data;
    });
  },

  async getNeighbourhoods(cityId: number): Promise<NeighbourhoodsListResponse> {
    return apiCall(async () => {
      const response = await apiClient.get<NeighbourhoodsListResponse>(
        `/api/countries/cities/${cityId}/neighbourhoods`
      );
      return response.data;
    });
  },
};
