/**
 * TypeScript types matching backend Pydantic schemas
 *
 * These types mirror the FastAPI backend schemas in cfind-backend/app/schemas/
 * Keep these in sync with backend changes!
 */

// ============================================================================
// USER & AUTH TYPES
// ============================================================================

export type UserRole = 'buyer' | 'agent' | 'admin';

export interface User {
  id: string;
  name: string | null;
  email: string;
  email_verified: boolean;
  image: string | null;
  role: UserRole;

  // Common fields (for both buyers and agents)
  phone_number: string | null;
  company_name: string | null;
  website: string | null;

  created_at: string;
  updated_at: string;
}

export interface AgentProfile {
  user_id: string;
  // agency_name REMOVED - use User.company_name
  // phone_number REMOVED - use User.phone_number
  license_number: string | null;
  whatsapp_number: string | null;
  bio_en: string | null;
  license_document_url: string | null;
  company_document_url: string | null;
  id_document_url: string | null;
  verification_status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  verified_at: string | null;
  credit_balance: number;
}

// BuyerProfile interface REMOVED
// Buyer fields (company_name, phone_number) are now in User interface

export interface UserWithProfile extends User {
  agent_profile?: AgentProfile;
}

// Auth requests/responses
export interface RegisterRequest {
  email: string;
  password: string;
  role: 'buyer' | 'agent';
  // Common fields
  phone?: string;
  company_name?: string;
  // Agent-specific
  license_number?: string;
}

export interface RegisterResponse {
  user_id: string;
  email: string;
  role: UserRole;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    email_verified: boolean;
  };
}

// ============================================================================
// LISTING TYPES
// ============================================================================

export type ListingStatus = 'draft' | 'active' | 'sold' | 'inactive';
export type PromotionTier = 'standard' | 'featured' | 'premium';
export type ListingCategory =
  | 'restaurant'
  | 'cafe'
  | 'bar'
  | 'hotel'
  | 'retail'
  | 'service'
  | 'manufacturing'
  | 'technology'
  | 'other';

export interface ListingImage {
  id: string;
  listing_id: string;
  url: string;
  order: number;
  created_at: string;
}

export interface Listing {
  id: string;
  agent_id: string;
  status: ListingStatus;
  promotion_tier: PromotionTier;
  promotion_start_date: string | null;
  promotion_end_date: string | null;

  // Public information
  public_title_en: string;
  public_description_en: string;
  category: ListingCategory;
  public_location_city_en: string;
  public_location_area: string | null;

  // Pricing
  asking_price_eur: number;
  asking_price_lek: number;
  monthly_revenue_eur: number | null;
  monthly_revenue_lek: number | null;
  roi: number | null;

  // Meta
  employee_count: number | null;
  years_in_operation: number | null;
  is_physically_verified: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;

  // Images
  images: ListingImage[];

  // Agent info (contact information shown immediately)
  agent_name: string | null;
  agent_agency_name: string | null;
  agent_phone: string | null;
  agent_whatsapp: string | null;
  agent_email: string | null;

  // Private info (only visible to owner/admin)
  real_business_name?: string;
  real_location_address?: string;
  real_location_lat?: number;
  real_location_lng?: number;
  real_description_en?: string;
}

export interface CreateListingRequest {
  public_title_en: string;
  public_description_en: string;
  category: ListingCategory;
  public_location_city_en: string;
  public_location_area?: string;
  asking_price_eur: number;
  monthly_revenue_eur?: number;
  real_business_name?: string;
  real_location_address?: string;
  real_description_en?: string;
  employee_count?: number;
  years_in_operation?: number;
  image_urls: string[];
}

export interface ListingsResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  listings: Listing[];
}

// ============================================================================
// LEAD TYPES
// ============================================================================

export type InteractionType = 'whatsapp' | 'phone' | 'email';

export interface Lead {
  id: string;
  buyer_id: string;
  listing_id: string;
  interaction_type: InteractionType;
  created_at: string;
  listing?: Listing;
}

export interface CreateLeadRequest {
  listing_id: string;
  interaction_type: InteractionType;
}

// ============================================================================
// BUYER DEMAND TYPES
// ============================================================================

export type DemandStatus = 'active' | 'assigned' | 'fulfilled' | 'closed';
export type DemandType = 'investor' | 'seeking_funding';

export interface BuyerDemand {
  id: string;
  buyer_id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_company: string | null;

  description: string;
  category: string;
  preferred_city_en: string;
  preferred_area: string | null;

  budget_min_eur: number;
  budget_max_eur: number;
  budget_min_lek: number;
  budget_max_lek: number;

  status: DemandStatus;
  demand_type: DemandType;

  assigned_agent_id: string | null;
  assigned_agent_name: string | null;
  assigned_agent_email: string | null;
  assigned_agent_phone: string | null;
  assigned_agent_whatsapp: string | null;
  assigned_at: string | null;

  created_at: string;
  updated_at: string;
}

export interface CreateDemandRequest {
  description: string;
  category: string;
  preferred_city_en: string;
  preferred_area?: string;
  budget_min_eur: number;
  budget_max_eur: number;
  budget_min_lek: number;
  budget_max_lek: number;
  demand_type: DemandType;
}

// ============================================================================
// PROMOTION & CREDIT TYPES
// ============================================================================

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price_eur: number;
  price_lek: number;
  is_popular: boolean;
  savings: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface PromotionTierConfig {
  id: string;
  tier: 'featured' | 'premium';
  credit_cost: number;
  duration_days: number;
  display_name: string;
  description: string | null;
  badge_color: string | null;
  is_active: boolean;
}

export interface CreditTransaction {
  id: string;
  agent_id: string;
  amount: number;
  type: 'purchase' | 'usage' | 'refund' | 'bonus' | 'adjustment';
  description: string;
  created_at: string;
}

export interface PromotionHistory {
  id: string;
  listing_id: string;
  agent_id: string;
  tier: PromotionTier;
  credit_cost: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'cancelled';
}

export interface PromoteListingRequest {
  tier: 'featured' | 'premium';
  duration_days?: number;
}

export interface PurchaseCreditsRequest {
  package_id: string;
}

// ============================================================================
// ADMIN TYPES
// ============================================================================

export interface AdminStats {
  total_users: number;
  total_agents: number;
  total_buyers: number;
  total_listings: number;
  active_listings: number;
  pending_agent_verifications: number;
  total_revenue_eur: number;
  total_revenue_lek: number;
}

// ============================================================================
// FILE UPLOAD TYPES - Simplified (backend handles all S3 uploads)
// ============================================================================

// No complex types needed - uploadFile() handles everything
// See lib/api/upload.ts for implementation

// ============================================================================
// PAGINATION & FILTERS
// ============================================================================

export interface PaginationParams {
  page?: number;
  page_size?: number;
}

export interface ListingFilters extends PaginationParams {
  category?: ListingCategory;
  location?: string;
  min_price_eur?: number;
  max_price_eur?: number;
  promotion_tier?: PromotionTier;
  search?: string;
  sort_by?: 'price_asc' | 'price_desc' | 'created_desc' | 'created_asc' | 'roi_desc';
}

export interface DemandFilters extends PaginationParams {
  category?: ListingCategory;
  location?: string;
  demand_type?: DemandType;
  status?: DemandStatus;
}

// ============================================================================
// API RESPONSE WRAPPERS
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  items: T[];
}