/**
 * Centralized API client export
 *
 * Import all API functionality from here:
 * import { api } from '@/lib/api';
 * await api.auth.login({ email, password });
 */

// Export everything from modules
export * from './client';
export * from './types';
export * from './auth';
export * from './user';
export * from './listings';
export * from './leads';
export * from './demands';
export * from './promotions';
export * from './admin';
export * from './upload';
export * from './chat';
export * from './geography';

// Import individual APIs
import { authApi } from './auth';
import { userApi } from './user';
import { listingsApi } from './listings';
import { leadsApi } from './leads';
import { demandsApi } from './demands';
import { promotionsApi } from './promotions';
import { adminApi } from './admin';
import { uploadApi } from './upload';
import { chatApi } from './chat';
import { geographyApi } from './geography';

/**
 * Unified API object
 *
 * Usage:
 *   import { api } from '@/lib/api';
 *   const user = await api.user.getProfile();
 *   const listings = await api.listings.getListings();
 */
export const api = {
  auth: authApi,
  user: userApi,
  listings: listingsApi,
  leads: leadsApi,
  demands: demandsApi,
  promotions: promotionsApi,
  admin: adminApi,
  upload: uploadApi,
  chat: chatApi,
  geography: geographyApi,
};

export default api;