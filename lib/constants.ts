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
// COUNTRY / CITY / AREA DATA
// ============================================================================

export type CountryCode = "al" | "ae"

export interface CountryData {
    name: string
    flag: string
    cities: Record<string, string[]>
}

export const countries: Record<CountryCode, CountryData> = {
    al: {
        name: "Albania",
        flag: "🇦🇱",
        cities: {
            "Tirana": ["Blloku", "Komuna e Parisit", "Astir", "Ish-Blloku", "Qendër", "Laprakë", "Don Bosko", "21 Dhjetori", "Medreseja", "Selitë"],
            "Durrës": ["Plazh", "Qendër", "Shkozet", "Spitallë", "Currila"],
            "Vlorë": ["Lungomare", "Qendër", "Uji i Ftohtë", "Skeleton", "Radhimë"],
            "Shkodër": ["Qendër", "Perash", "Rus", "Dobraç"],
            "Elbasan": ["Qendër", "Partizani", "11 Nëntori", "28 Nëntori"],
            "Fier": ["Qendër", "Apolloni", "Sheq i Madh"],
            "Korçë": ["Qendër", "Pazari i Ri", "Bulevardi Republika"],
            "Berat": ["Mangalem", "Goricë", "Qendër", "Kala"],
            "Sarandë": ["Qendër", "Lungomare", "Kodër"],
            "Lushnjë": ["Qendër"],
        },
    },
    ae: {
        name: "United Arab Emirates",
        flag: "🇦🇪",
        cities: {
            "Dubai": ["Downtown", "Marina", "JBR", "Business Bay", "DIFC", "Deira", "Jumeirah", "Al Barsha", "JLT", "Silicon Oasis", "International City", "Al Quoz"],
            "Abu Dhabi": ["Corniche", "Al Reem Island", "Saadiyat Island", "Yas Island", "Al Maryah Island", "Khalifa City", "Al Mushrif"],
            "Sharjah": ["Al Majaz", "Al Nahda", "Al Qasba", "Al Khan", "Muwaileh"],
            "Ajman": ["Al Rashidiya", "Al Nuaimiya", "Corniche"],
            "Ras Al Khaimah": ["Al Hamra", "Al Nakheel", "Corniche"],
            "Umm Al Quwain": ["Old Town", "Al Salamah"],
            "Fujairah": ["Al Faseel", "Corniche", "Al Gurfa"],
        },
    },
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

export function getCountryCities(code: CountryCode): string[] {
    return Object.keys(countries[code].cities)
}

export function getCityAreas(code: CountryCode, city: string): string[] {
    return countries[code].cities[city] ?? []
}
