"use client"

import { ListingFilters } from "@/components/listings/listing-filters"
import { useListingFilters } from "@/lib/hooks/use-listing-filters"
import { ListingCard } from "@/components/listings/listing-card"
import { Button } from "@/components/ui/button"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import Link from "next/link"
import { useListings } from "@/lib/hooks/useListings"
import type { Listing } from "@/lib/api/types"
import { getCountryName, type CountryCode } from "@/lib/constants"

interface ListingsClientPageProps {
    country: CountryCode
}

export default function ListingsClientPage({ country }: ListingsClientPageProps) {
    const { filters, setters, page, setPage, apiFilters } = useListingFilters({ country })
    const { data: listingsData, isLoading } = useListings(apiFilters)

    const listings = listingsData?.listings || []
    const totalPages = listingsData?.total_pages || 1
    const total = listingsData?.total || 0

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Listings</h1>
                    <p className="text-muted-foreground mt-1">
                        Find verified business listings for sale in {getCountryName(country)}
                    </p>
                </div>
                <Button asChild>
                    <Link href="/register">
                        <Plus className="mr-2 h-4 w-4" />
                        List Your Business
                    </Link>
                </Button>
            </div>

            <ListingFilters filters={filters} setters={setters} country={country} />

            {listings.length > 0 ? (
                <>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {listings.map((listing: Listing) => (
                            <ListingCard key={listing.id} listing={listing} country={country} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(page - 1)}
                                disabled={page <= 1}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Previous
                            </Button>

                            <div className="flex items-center gap-1">
                                {generatePageNumbers(page, totalPages).map((p, i) =>
                                    p === "..." ? (
                                        <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">...</span>
                                    ) : (
                                        <Button
                                            key={p}
                                            variant={p === page ? "default" : "outline"}
                                            size="sm"
                                            className="w-9 h-9"
                                            onClick={() => setPage(p as number)}
                                        >
                                            {p}
                                        </Button>
                                    )
                                )}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(page + 1)}
                                disabled={page >= totalPages}
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>

                            <span className="text-sm text-muted-foreground ml-2 hidden sm:inline">
                                {total} listing{total !== 1 ? "s" : ""} found
                            </span>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-12 text-muted-foreground">
                    No listings found
                </div>
            )}
        </div>
    )
}

function generatePageNumbers(current: number, total: number): (number | "...")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

    const pages: (number | "...")[] = [1]

    if (current > 3) pages.push("...")

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) pages.push(i)

    if (current < total - 2) pages.push("...")

    pages.push(total)
    return pages
}
