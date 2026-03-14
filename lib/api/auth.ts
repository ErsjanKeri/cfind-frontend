import { apiClient, apiCall } from './client';
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
} from './types';

export const authApi = {
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return apiCall(async () => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });

      const response = await apiClient.post<RegisterResponse>(
        '/api/auth/register',
        formData,
      );
      return response.data;
    });
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    return apiCall(async () => {
      const response = await apiClient.post<LoginResponse>('/api/auth/login', data);
      return response.data;
    });
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      console.warn('Logout request failed:', error);
    }
  },

  async verifyEmail(token: string): Promise<{ message: string }> {
    return apiCall(async () => {
      const response = await apiClient.get<{ message: string }>(
        `/api/auth/verify-email?token=${encodeURIComponent(token)}`
      );
      return response.data;
    });
  },

  async resendVerification(email: string): Promise<{ message: string }> {
    return apiCall(async () => {
      const response = await apiClient.post<{ message: string }>(
        '/api/auth/resend-verification',
        { email }
      );
      return response.data;
    });
  },

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    return apiCall(async () => {
      const response = await apiClient.post<{ message: string }>(
        '/api/auth/password-reset-request',
        { email }
      );
      return response.data;
    });
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return apiCall(async () => {
      const response = await apiClient.post<{ message: string }>(
        '/api/auth/password-reset',
        { token, new_password: newPassword }
      );
      return response.data;
    });
  },
};
