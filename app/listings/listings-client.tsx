"use client"

import { ListingFilters } from "@/components/listings/listing-filters"
import { useListingFilters } from "@/lib/hooks/use-listing-filters"
import { ListingCard } from "@/components/listing-card"
import { Button } from "@/components/ui/button"
import { Loader2, Plus } from "lucide-react"
import Link from "next/link"
import { useListings } from "@/lib/hooks/useListings"
import type { Listing } from "@/lib/api/types"

export default function ListingsClientPage() {
    // Fetch listings using React Query
    const { data: listingsData, isLoading } = useListings({ page: 1, page_size: 100 })
    const listings = listingsData?.listings || []

    // Client-side filtering
    const { filters, setters, filteredListings } = useListingFilters({ initialData: listings })

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Listings</h1>
                    <p className="text-muted-foreground mt-1">
                        Find out verified business listings for sale in Albania
                    </p>
                </div>
                <Button asChild>
                    <Link href="/register">
                        <Plus className="mr-2 h-4 w-4" />
                        List Your Business
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <ListingFilters filters={filters} setters={setters} />

            {/* Listings Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredListings.length > 0 ? (
                    filteredListings.map((listing: any) => (
                        <ListingCard key={listing.id} listing={listing} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No listings found
                    </div>
                )}
            </div>
        </div>
    )
}
