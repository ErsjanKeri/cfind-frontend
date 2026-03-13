import type { ListingCategory } from "@/lib/api/types"

export const businessCategories: { value: ListingCategory; label: string }[] = [
    { value: "restaurant", label: "Restaurant" },
    { value: "bar", label: "Bar & Nightlife" },
    { value: "cafe", label: "Café & Coffee Shop" },
    { value: "retail", label: "Retail" },
    { value: "hotel", label: "Hotel & Accommodation" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "services", label: "Services" },
    { value: "technology", label: "Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" },
    { value: "real-estate", label: "Real Estate" },
    { value: "other", label: "Other" },
]

export function getCategoryLabel(category: string): string {
    return businessCategories.find((c) => c.value === category)?.label ?? category
}

export const MAX_LISTING_PRICE = 2_000_000

export const SUPPORT_EMAIL = "support@cfind.ai"

// ============================================================================
// COUNTRY DATA
// ============================================================================

export type CountryCode = "al" | "ae"

interface CountryData {
    name: string
    flag: string
}

export const countries: Record<CountryCode, CountryData> = {
    al: { name: "Albania", flag: "🇦🇱" },
    ae: { name: "United Arab Emirates", flag: "🇦🇪" },
}

export const VALID_COUNTRY_CODES: CountryCode[] = Object.keys(countries) as CountryCode[]
export const DEFAULT_COUNTRY: CountryCode = "al"

export function isValidCountryCode(code: string): code is CountryCode {
    return code in countries
}

export function getCountryName(code: CountryCode): string {
    return countries[code].name
}

export function getCountryFlag(code: CountryCode): string {
    return countries[code].flag
}
