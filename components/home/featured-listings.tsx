"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ListingCard } from "@/components/listings/listing-card"
import { ArrowRight } from "lucide-react"

import { Listing } from "@/lib/api/types"

interface FeaturedListingsProps {
  listings: Listing[]
}

export function FeaturedListings({ listings }: FeaturedListingsProps) {
  // Get first 6 listings (already limited by parent or slice here)
  const featuredListings = listings.slice(0, 6)

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Featured Opportunities</h2>
            <p className="mt-2 text-muted-foreground">Explore verified business listings across Albania</p>
          </div>
          <Link href="/listings">
            <Button variant="outline" className="group bg-transparent">
              Browse Listings
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Listings Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </section>
  )
}
