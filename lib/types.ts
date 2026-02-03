// User roles
export type UserRole = "buyer" | "agent" | "admin"

// Business categories
export type BusinessCategory =
  | "restaurant"
  | "bar"
  | "cafe"
  | "retail"
  | "hotel"
  | "manufacturing"
  | "services"
  | "technology"
  | "healthcare"
  | "education"
  | "real-estate"
  | "other"

// Base user profile
export interface UserProfile {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  avatar?: string
  image?: string | null
  createdAt: Date
  emailVerified?: boolean
}

export interface BuyerProfile extends UserProfile {
  role: "buyer"
  companyName?: string
  savedListings?: string[]
}

export interface AgentProfile extends UserProfile {
  role: "agent"
  licenseNumber?: string
  agency?: string // Backward compatibility
  agencyName?: string
  bio?: string // Backward compatibility
  bioEn?: string
  whatsapp?: string
  phone?: string
  licenseDocumentUrl?: string
  companyDocumentUrl?: string
  idDocumentUrl?: string
  listingsCount: number
  dealsCompleted: number
  verifiedAt?: Date | null

  // verificationStatus is the single source of truth for agent verification
  verificationStatus: "pending" | "approved" | "rejected"
  rejectionReason?: string | null
  rejectedAt?: Date | null
  rejectedBy?: string | null
  submittedAt?: Date | null

  // Promotion Credits System
  creditBalance: number
}

export interface AdminProfile extends UserProfile {
  role: "admin"
}

// Listing types
export interface ListingAddress {
  real: {
    street: string
    city: string
    country: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  public: {
    area: string
    city: string
    country: string
    radiusKm: number
  }
}

// Promotion tier types
export type PromotionTier = "standard" | "featured" | "premium"

export interface Listing {
  id: string
  agentId: string
  agent?: AgentProfile
  publicTitle: string
  publicTitleEn?: string
  publicDescription: string
  publicDescriptionEn?: string
  category: BusinessCategory
  address: ListingAddress
  realBusinessName?: string
  realDescription?: string
  askingPrice: number
  annualRevenue?: number
  monthlyProfit?: number
  roi?: number
  employeeCount?: number
  yearsInOperation?: number
  leaseTermsMonths?: number
  images: string[]
  // Simplified status (agent-controlled)
  status: "draft" | "active" | "sold" | "inactive"
  minutesToSell?: number
  isPhysicallyVerified: boolean
  createdAt: Date
  updatedAt: Date
  viewCount: number
  inquiryCount: number

  // Promotion System (PropertyFinder-style)
  promotionTier: PromotionTier
  promotionStartDate?: Date | null
  promotionEndDate?: Date | null
}

// Contact Log - tracks when buyer contacts agent
export interface ContactLog {
  id: string
  listingId: string
  listing?: Listing
  buyerId: string
  buyer?: BuyerProfile
  agentId: string
  agent?: AgentProfile
  contactMethod: "whatsapp" | "phone" | "email"
  createdAt: Date
}

// Buyer Demand - buyers posting what they're looking for
export type BuyerDemandStatus = "active" | "assigned" | "fulfilled" | "closed"
export type BuyerDemandType = "investor" | "seeking_funding"

export interface BuyerDemand {
  id: string
  buyerId: string
  buyer?: BuyerProfile

  // Budget - dual currency
  budgetMinEur: number
  budgetMaxEur: number
  budgetMinLek: number
  budgetMaxLek: number

  // Details
  category: BusinessCategory
  preferredCityEn: string
  preferredArea?: string
  description: string

  // Status
  status: BuyerDemandStatus

  // Demand type: "investor" (has money) or "seeking_funding" (needs investment)
  demandType: BuyerDemandType

  // Exclusive assignment
  assignedAgentId?: string
  assignedAgent?: AgentProfile
  assignedAt?: Date

  // Timestamps
  createdAt: Date
  updatedAt: Date
}

// Form validation error types
export interface FormFieldError {
  field: string
  message: string
}

export interface FormValidationResult {
  success: boolean
  errors?: Record<string, string> // field name -> error message
  message?: string // general error message
}

export interface ServerActionResult<T = any> {
  success: boolean
  data?: T
  errors?: Record<string, string>
  message?: string
}

// ============================================================================
// PROMOTION SYSTEM TYPES (PropertyFinder-style)
// ============================================================================

// Credit transaction types
export type CreditTransactionType = "purchase" | "usage" | "refund" | "bonus" | "adjustment"

export interface CreditTransaction {
  id: string
  agentId: string
  amount: number // Positive = added, negative = used
  type: CreditTransactionType
  description: string
  listingId?: string | null
  promotionId?: string | null
  paymentReference?: string | null
  createdAt: Date
}

// Promotion history
export type PromotionStatus = "active" | "expired" | "cancelled"

export interface PromotionHistory {
  id: string
  listingId: string
  listing?: Listing
  tier: "featured" | "premium"
  creditCost: number
  startDate: Date
  endDate: Date
  status: PromotionStatus
  viewsDuringPromotion: number
  leadsDuringPromotion: number
  createdAt: Date
  updatedAt: Date
}

// Credit package (for purchase)
export interface CreditPackage {
  id: string
  name: string
  credits: number
  priceEur: number
  priceLek: number
  isPopular: boolean
  savings?: string | null
  isActive: boolean
  sortOrder: number
}

// Promotion tier configuration
export interface PromotionTierConfig {
  id: string
  tier: "featured" | "premium"
  creditCost: number
  durationDays: number
  displayName: string
  description?: string | null
  badgeColor?: string | null
  isActive: boolean
}
