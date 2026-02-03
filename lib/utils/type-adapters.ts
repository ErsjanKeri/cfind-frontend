/**
 * Type adapters to convert between API types (snake_case) and UI types (camelCase)
 *
 * These adapters bridge the gap during the migration from Prisma types to FastAPI types.
 * Eventually, we should update all components to use API types directly.
 */

import type { BuyerDemand as ApiBuyerDemand } from '@/lib/api/types';
import type { BuyerDemand as UiBuyerDemand } from '@/lib/types';

/**
 * Convert API BuyerDemand (snake_case) to UI BuyerDemand (camelCase)
 */
export function adaptApiBuyerDemandToUi(apiDemand: ApiBuyerDemand): UiBuyerDemand {
  return {
    id: apiDemand.id,
    buyerId: apiDemand.buyer_id,
    budgetMinEur: apiDemand.budget_min_eur,
    budgetMaxEur: apiDemand.budget_max_eur,
    budgetMinLek: apiDemand.budget_min_lek,
    budgetMaxLek: apiDemand.budget_max_lek,
    category: apiDemand.category as any,
    preferredCityEn: apiDemand.preferred_city_en,
    preferredArea: apiDemand.preferred_area || undefined,
    description: apiDemand.description,
    status: apiDemand.status,
    demandType: apiDemand.demand_type,
    assignedAgentId: apiDemand.assigned_agent_id || undefined,
    createdAt: new Date(apiDemand.created_at),
    updatedAt: new Date(apiDemand.updated_at),
  };
}

/**
 * Convert array of API BuyerDemands to UI BuyerDemands
 */
export function adaptApiBuyerDemandsToUi(apiDemands: ApiBuyerDemand[]): UiBuyerDemand[] {
  return apiDemands.map(adaptApiBuyerDemandToUi);
}

/**
 * Convert API Listing (snake_case) to UI Listing (camelCase)
 *
 * Note: This is a temporary adapter during migration.
 * Eventually, all components should use API types directly.
 */
export function adaptApiListingToUi(apiListing: any): any {
  return {
    id: apiListing.id,
    agentId: apiListing.agent_id,
    status: apiListing.status,
    promotionTier: apiListing.promotion_tier || apiListing.tier || 'standard',
    publicTitleEn: apiListing.public_title_en,
    publicDescriptionEn: apiListing.public_description_en,
    category: apiListing.category,
    publicLocationCityEn: apiListing.public_location_city_en,
    publicLocationArea: apiListing.public_location_area,
    askingPrice: apiListing.asking_price_eur,
    askingPriceEur: apiListing.asking_price_eur,
    askingPriceLek: apiListing.asking_price_lek,
    monthlyRevenue: apiListing.monthly_revenue_eur,
    monthlyRevenueEur: apiListing.monthly_revenue_eur,
    monthlyRevenueLek: apiListing.monthly_revenue_lek,
    roi: apiListing.roi_percentage,
    employeeCount: apiListing.employees_count,
    yearsInOperation: apiListing.years_in_operation,
    viewCount: apiListing.view_count || 0,
    isPhysicallyVerified: apiListing.is_physically_verified,
    createdAt: new Date(apiListing.created_at),
    updatedAt: new Date(apiListing.updated_at),
    images: apiListing.images || [],
    // Private fields (if available)
    realBusinessName: apiListing.real_business_name,
    realLocationAddress: apiListing.real_location_address,
    realDescriptionEn: apiListing.real_description_en,
  };
}

/**
 * Convert array of API Listings to UI Listings
 */
export function adaptApiListingsToUi(apiListings: any[]): any[] {
  return apiListings.map(adaptApiListingToUi);
}
