import { MetadataRoute } from 'next'
import { api } from '@/lib/api'
import { VALID_COUNTRY_CODES } from '@/lib/constants'

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.cfind.ai'

    // Get all active listings from each country
    let listingUrls: MetadataRoute.Sitemap = []

    for (const countryCode of VALID_COUNTRY_CODES) {
        try {
            const response = await api.listings.getListings({ country_code: countryCode, page: 1, limit: 100 })
            const listings = response.listings || []

            const countryListingUrls = listings
                .filter(listing => listing.status === 'active')
                .map((listing) => ({
                    url: `${baseUrl}/${countryCode}/listings/${listing.id}`,
                    lastModified: new Date(listing.updated_at),
                    changeFrequency: 'weekly' as const,
                    priority: 0.8,
                }))

            listingUrls = [...listingUrls, ...countryListingUrls]
        } catch {
            // Continue with empty listing URLs if API fails for this country
        }
    }

    // Country-specific pages
    const countryPages: MetadataRoute.Sitemap = VALID_COUNTRY_CODES.flatMap((code) => [
        {
            url: `${baseUrl}/${code}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/${code}/listings`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
    ])

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...countryPages,
        {
            url: `${baseUrl}/how-it-works`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/register`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        ...listingUrls,
    ]
}
