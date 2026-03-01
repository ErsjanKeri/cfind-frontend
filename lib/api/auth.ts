/**
 * Authentication API client
 *
 * Handles all authentication operations:
 * - Register (buyer/agent)
 * - Login/Logout
 * - Token refresh
 * - Email verification
 * - Password reset
 */
import { apiClient, getErrorMessage } from './client';
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
} from './types';

export const authApi = {
  /**
   * Register new user (buyer or agent)
   *
   * For agent registration, files should be included in the data object:
   * - license_document: File
   * - company_document: File
   * - id_document: File
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      // Check if this is agent registration with files
      const hasFiles = data.license_document || data.company_document || data.id_document;

      if (hasFiles) {
        // Create FormData for multipart/form-data upload
        const formData = new FormData();

        // Add all text fields
        Object.entries(data).forEach(([key, value]) => {
          // Skip file objects and null/undefined values
          if (value !== null && value !== undefined && !(value instanceof File)) {
            formData.append(key, String(value));
          }
        });

        // Add file fields if present
        if (data.license_document) {
          formData.append('license_document', data.license_document);
        }
        if (data.company_document) {
          formData.append('company_document', data.company_document);
        }
        if (data.id_document) {
          formData.append('id_document', data.id_document);
        }

        const response = await apiClient.post<RegisterResponse>(
          '/api/auth/register',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        return response.data;
      } else {
        // Regular JSON request for buyers
        const response = await apiClient.post<RegisterResponse>(
          '/api/auth/register',
          data
        );
        return response.data;
      }
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Login user and get JWT tokens (in httpOnly cookies)
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        '/api/auth/login',
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Logout user and revoke refresh token
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      // Ignore errors on logout, just clear local state
    }
  },

  /**
   * Refresh access token using refresh token cookie
   */
  async refresh(): Promise<{ access_token: string }> {
    try {
      const response = await apiClient.post<{ access_token: string }>(
        '/api/auth/refresh'
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Verify email with token from email link
   */
  async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.get<{ message: string }>(
        `/api/auth/verify-email?token=${encodeURIComponent(token)}`
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Resend verification email
   */
  async resendVerification(email: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>(
        '/api/auth/resend-verification',
        { email }
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Request password reset email
   */
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>(
        '/api/auth/password-reset-request',
        { email }
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Reset password with token from reset email
   */
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>(
        '/api/auth/password-reset',
        { token, new_password: newPassword }
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};