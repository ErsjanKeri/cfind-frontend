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
  country_preference: string | null;

  // Common fields (for both buyers and agents)
  phone_number: string | null;
  company_name: string | null;
  website: string | null;

  created_at: string;
  updated_at: string;
}

export interface AgentProfile {
  user_id: string;
  operating_country: string;
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
  rejected_at: string | null;
  rejected_by: string | null;
  submitted_at: string | null;
  verified_at: string | null;
  credit_balance: number;
  listings_count: number;
  deals_completed: number;
}

// BuyerProfile interface REMOVED
// Buyer fields (company_name, phone_number) are now in User interface

export interface UserWithProfile extends User {
  agent_profile?: AgentProfile;

  // Flat fields returned by admin /users endpoint (matches backend UserListItem)
  verification_status?: 'pending' | 'approved' | 'rejected' | null;
  credit_balance?: number | null;
  operating_country?: string | null;
  license_number?: string | null;
  whatsapp_number?: string | null;
  bio_en?: string | null;
  license_document_url?: string | null;
  company_document_url?: string | null;
  id_document_url?: string | null;
}

// Auth requests/responses
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'buyer' | 'agent';
  country_preference?: string;
  // Common fields
  phone?: string;
  company_name?: string;
  // Agent-specific
  operating_country?: string;
  license_number?: string;
  whatsapp?: string;
  bio_en?: string;
  // Agent document uploads (File objects for multipart/form-data)
  license_document?: File;
  company_document?: File;
  id_document?: File;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user_id: string;
}

export interface LoginRequest {
  email: string;
  password: string;
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
  | 'services'
  | 'manufacturing'
  | 'technology'
  | 'healthcare'
  | 'education'
  | 'real-estate'
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
  country_code: string;
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
  monthly_revenue_eur: number | null;
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
  // Required fields
  country_code: string;
  real_business_name: string;
  real_location_address: string;
  public_title_en: string;
  public_description_en: string;
  category: string;
  public_location_city_en: string;
  asking_price_eur: number;
  images: { url: string; order: number }[];

  // Optional fields
  public_location_area?: string;
  real_location_lat?: number;
  real_location_lng?: number;
  real_description_en?: string;
  monthly_revenue_eur?: number;
  employee_count?: number;
  years_in_operation?: number;

  // Admin-only fields
  agent_id?: string;
  status?: 'draft' | 'active' | 'sold' | 'inactive';
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

// Buyer's perspective - shows agent info
export interface BuyerLead {
  id: string;
  listing_id: string;
  listing_title: string;
  listing_asking_price_eur: number;
  agent_id: string;
  agent_name: string;
  agent_agency_name: string | null;
  agent_email: string;
  agent_phone: string | null;
  agent_whatsapp: string | null;
  interaction_type: InteractionType;
  created_at: string;
}

// Agent's perspective - shows buyer info
export interface AgentLead {
  id: string;
  listing_id: string;
  listing_title: string;
  listing_asking_price_eur: number;
  buyer_id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_company: string | null;
  interaction_type: InteractionType;
  created_at: string;
}

// Generic Lead type (union)
export type Lead = BuyerLead | AgentLead;

export interface CreateLeadRequest {
  listing_id: string;
  interaction_type: InteractionType;
}

export interface AgentLeadsResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  leads: AgentLead[];
}

export interface BuyerLeadsResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  leads: BuyerLead[];
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
  country_code: string;

  description: string;
  category: string;
  preferred_city_en: string;
  preferred_area: string | null;

  budget_min_eur: number;
  budget_max_eur: number;

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
  country_code: string;
  description: string;
  category: string;
  preferred_city_en: string;
  preferred_area?: string;
  budget_min_eur: number;
  budget_max_eur: number;
  demand_type: DemandType;
}

export interface BuyerDemandsResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  demands: BuyerDemand[];
}

// ============================================================================
// PROMOTION & CREDIT TYPES
// ============================================================================

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price_eur: number;
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
  listing_id: string | null;
  promotion_id: string | null;
  payment_reference: string | null;
  created_at: string;
}

export interface PromotionHistory {
  id: string;
  listing_id: string;
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

export interface CreateAgentRequest {
  name: string;
  email: string;
  password: string;
  company_name: string;
  license_number: string;
  phone: string;
  whatsapp_number?: string;
  verification_status?: 'pending' | 'approved' | 'rejected';
  email_verified?: boolean;
}

export interface CreateBuyerRequest {
  name: string;
  email: string;
  password: string;
  company_name?: string;
}

export interface AdminStats {
  total_users: number;
  total_buyers: number;
  total_agents: number;
  total_admins: number;

  agents_pending: number;
  agents_approved: number;
  agents_rejected: number;

  total_listings: number;
  active_listings: number;
  draft_listings: number;
  sold_listings: number;
  inactive_listings: number;

  total_leads: number;
  total_demands: number;
  active_demands: number;
  assigned_demands: number;
  fulfilled_demands: number;

  active_promotions: number;
  total_credit_transactions: number;
}

// ============================================================================
// AI CHAT TYPES
// ============================================================================

export interface ChatMessageRequest {
  message: string;
  conversation_id?: string | null;
  language?: string;
  mode?: "buyer" | "agent";
}

export interface ToolCallResult {
  name: string;
  args: Record<string, unknown>;
  result?: {
    total?: number;
    listings?: ToolCallListing[];
    demands?: ToolCallDemand[];
    // get_listing_detail / get_demand_detail return a single object directly
    id?: string;
    title?: string;
    [key: string]: unknown;
  };
}

export interface ToolCallDemand {
  id: string;
  category: string;
  city: string;
  area: string | null;
  country_code: string;
  budget_min_eur: number;
  budget_max_eur: number;
  demand_type: string;
  description: string;
  buyer_name: string;
  created_at: string | null;
}

export interface ToolCallListing {
  id: string;
  title: string;
  category: string;
  city: string;
  area: string | null;
  country_code: string;
  asking_price_eur: number | null;
  monthly_revenue_eur: number | null;
  roi: number | null;
  employee_count: number | null;
  years_in_operation: number | null;
  promotion_tier: string;
  image_url: string | null;
  agent_name: string;
  agent_agency: string | null;
  url: string;
}

export interface ChatMessageResponse {
  conversation_id: string;
  message_id: string;
  content: string;
  tool_calls: ToolCallResult[] | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  tool_calls: ToolCallResult[] | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  title: string | null;
  language: string;
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface ConversationDetail extends Conversation {
  messages: ChatMessage[];
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
  country_code: string;
  category?: ListingCategory;
  city?: string;
  area?: string;
  min_price_eur?: number;
  max_price_eur?: number;
  promotion_tier?: PromotionTier;
  search?: string;
  sort_by?: 'price_asc' | 'price_desc' | 'created_desc' | 'created_asc' | 'roi_desc';
}

export interface DemandFilters extends PaginationParams {
  country_code: string;
  category?: ListingCategory;
  city?: string;
  demand_type?: DemandType;
  status?: DemandStatus;
}


// ============================================================================
// GEOGRAPHY TYPES
// ============================================================================

export interface City {
  id: number;
  country_code: string;
  name: string;
}

export interface Neighbourhood {
  id: number;
  city_id: number;
  name: string;
}

export interface Country {
  code: string;
  name: string;
  cities: City[];
}

export interface CountryListResponse {
  success: boolean;
  countries: Country[];
}

export interface CitiesListResponse {
  success: boolean;
  cities: City[];
}

export interface NeighbourhoodsListResponse {
  success: boolean;
  neighbourhoods: Neighbourhood[];
}