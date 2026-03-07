"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUser } from "@/lib/hooks/useAuth"
import { useSavedListings } from "@/lib/hooks/useLeads"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ListingCard } from "@/components/listings/listing-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, Search, Loader2 } from "lucide-react"
import { getCountryOrDefault } from "@/lib/country"

export default function SavedListingsPage() {
  const country = getCountryOrDefault()
  const router = useRouter()
  const { user } = useUser() // Fetch user via JWT cookie
  const isAuthenticated = !!user // Derived

  // Use React Query hook instead of deprecated action
  const { data: savedListings = [], isLoading: loading } = useSavedListings()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/profile/saved")
    }
  }, [isAuthenticated, router])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href="/profile"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Link>

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Saved Listings</h1>
              <p className="text-muted-foreground mt-1">
                {savedListings.length} businesses saved
              </p>
            </div>
          </div>

          {/* Saved Listings Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : savedListings.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {savedListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No saved listings</h3>
              <p className="text-muted-foreground mb-6">Browse listings and save your favorites to see them here</p>
              <Button asChild>
                <Link href={`/${country}/listings`}>
                  <Search className="mr-2 h-4 w-4" />
                  Browse Listings
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
