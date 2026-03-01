import { MetadataRoute } from 'next'
import { api } from '@/lib/api'

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.cfind.ai'

    // Get all active listings from API
    let listingUrls: MetadataRoute.Sitemap = []

    try {
        const response = await api.listings.getListings({ page: 1, page_size: 1000 })
        const listings = response.listings || []

        listingUrls = listings
            .filter(listing => listing.status === 'active')
            .map((listing) => ({
                url: `${baseUrl}/listings/${listing.id}`,
                lastModified: new Date(listing.updated_at),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }))
    } catch (error) {
        // Continue with empty listing URLs if API fails
    }

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/listings`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
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
