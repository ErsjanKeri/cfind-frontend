/**
 * Axios HTTP client configuration with JWT authentication
 *
 * Features:
 * - Automatic cookie-based JWT authentication
 * - Token refresh on 401 errors
 * - Request queuing during refresh
 * - Error message extraction
 */
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

// ============================================================================
// API BASE URL
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ============================================================================
// AXIOS INSTANCE
// ============================================================================

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // CRITICAL: Send cookies (JWT tokens) with requests
});

// ============================================================================
// HELPER: Get Cookie Value
// ============================================================================

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

// ============================================================================
// REQUEST INTERCEPTOR
// ============================================================================

apiClient.interceptors.request.use(
  (config) => {
    // JWT access token is in httpOnly cookie, browser sends automatically
    // No need to manually attach Authorization header

    // CSRF Token: Backend requires X-CSRF-Token header for state-changing requests
    // The CSRF token is set as a readable cookie by the backend on login
    if (config.method && ['post', 'put', 'delete', 'patch'].includes(config.method.toLowerCase())) {
      const csrfToken = getCookie('csrf_token');
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================================
// RESPONSE INTERCEPTOR - Token Refresh Logic
// ============================================================================

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    // Successful response - return as-is
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // CRITICAL FIX: Don't try to refresh if the failed request was login/refresh/logout!
    const isAuthEndpoint = originalRequest.url?.includes('/auth/login') ||
                           originalRequest.url?.includes('/auth/refresh') ||
                           originalRequest.url?.includes('/auth/register') ||
                           originalRequest.url?.includes('/auth/logout');

    // If 401 Unauthorized and haven't retried yet AND not an auth endpoint
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // Another request is already refreshing, queue this one
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh access token
        await axios.post(
          `${API_BASE_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Token refreshed successfully
        processQueue(null);
        isRefreshing = false;

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - user needs to log in again
        processQueue(refreshError as Error);
        isRefreshing = false;

        // FIX: Don't redirect here - causes infinite loop!
        // Just reject the error and let auth context handle it
        // Auth context will clear user state and redirect if needed

        return Promise.reject(refreshError);
      }
    }

    // Log error in development (only if not 401 - too noisy)
    if (process.env.NODE_ENV === 'development' && error.response?.status !== 401) {
      console.error('[API Error]', error.response?.data || error.message);
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

/**
 * API Error type from backend
 */
export interface ApiError {
  detail?: string;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
    type: string;
  }>;
}

/**
 * Parse field name from backend format
 * Example: "body -> phone_number" → "Phone Number"
 */
const parseFieldName = (field: string): string => {
  // Remove "body -> " prefix
  const cleanField = field.replace(/^body\s*->\s*/, '');

  // Convert snake_case to Title Case
  return cleanField
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Clean up validation message
 */
const cleanValidationMessage = (message: string): string => {
  return message
    .replace('Field required', 'This field is required')
    .replace('value is not a valid email address: ', '')
    .replace(/Value error,\s*/g, '')
    .replace('String should have at least', 'Must have at least')
    .replace('String should have at most', 'Must have at most')
    .replace('An email address must have an @-sign.', 'Please enter a valid email address');
};

/**
 * Extract user-friendly error message from Axios error
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiError;

    // Check for custom validation errors array (our backend format)
    if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      const messages = data.errors.map(err => {
        const fieldName = parseFieldName(err.field);
        const cleanMessage = cleanValidationMessage(err.message);

        return `${fieldName}: ${cleanMessage}`;
      });

      // Return single message or formatted list
      if (messages.length === 1) {
        return messages[0];
      }
      // Multi-line with bullets for better readability
      return messages.map(msg => `• ${msg}`).join('\n');
    }

    // Check for detail field (string)
    if (data?.detail && typeof data.detail === 'string') {
      // Skip generic "Validation error" - not helpful
      if (data.detail === 'Validation error' && data.errors) {
        return 'Please check the form and try again';
      }
      return data.detail;
    }

    // Check for message field
    if (data?.message) {
      return data.message;
    }

    // Fallback to error message
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

/**
 * Check if error is authentication error
 */
export const isAuthError = (error: unknown): boolean => {
  if (axios.isAxiosError(error)) {
    return error.response?.status === 401;
  }
  return false;
};

/**
 * Check if error is forbidden error
 */
export const isForbiddenError = (error: unknown): boolean => {
  if (axios.isAxiosError(error)) {
    return error.response?.status === 403;
  }
  return false;
};