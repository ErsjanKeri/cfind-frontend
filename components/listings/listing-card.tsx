"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, TrendingUp, Users, Clock, Eye, Heart, Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/currency"
import { useUser } from "@/lib/hooks/useAuth"
import { useRole } from "@/lib/hooks/useRole"
import { useSavedListing } from "@/lib/hooks/useSavedListing"
import { getCategoryLabel } from "@/lib/constants"
import { PromotionBadge } from "@/components/shared/promotion-badge"
import { toast } from "sonner"
import type { Listing, PromotionTier } from "@/lib/api/types"
import type { CountryCode } from "@/lib/constants"

interface ListingCardProps {
  listing: Listing
  country?: CountryCode
}

// Get card styling based on promotion tier
function getCardStyles(tier: PromotionTier): string {
  const baseStyles = "group overflow-hidden transition-all duration-300"

  switch (tier) {
    case "premium":
      // Premium: Gold border with glow effect, enhanced shadow
      return `${baseStyles} border-2 border-amber-400 shadow-lg shadow-amber-200/50 hover:shadow-xl hover:shadow-amber-300/60 hover:border-amber-500 ring-1 ring-amber-200/30`
    case "featured":
      // Featured: Blue border with subtle glow
      return `${baseStyles} border-2 border-blue-400 shadow-md shadow-blue-200/40 hover:shadow-lg hover:shadow-blue-300/50 hover:border-blue-500`
    default:
      // Standard: Normal styling
      return `${baseStyles} border-border hover:border-primary/50 hover:shadow-lg`
  }
}

export function ListingCard({ listing, country }: ListingCardProps) {
  const { user } = useUser()
  const { isBuyer } = useRole()
  const router = useRouter()
  const isAuthenticated = !!user

  const { isSaved, toggleSave, isPending: isSavePending } = useSavedListing(listing.id)

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(`/${country || listing.country_code}/listings/${listing.id}`)}`)
      return
    }

    if (!isBuyer) {
      toast.error("Only buyers can save listings")
      return
    }

    await toggleSave()
  }

  const promotionTier = listing.promotion_tier || "standard"
  const firstImageUrl = listing.images?.[0]?.url || "/placeholder.svg?height=400&width=600&query=business storefront"

  return (
    <Link href={`/${country || listing.country_code}/listings/${listing.id}`}>
      <Card className={getCardStyles(promotionTier)}>
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <Image
            src={firstImageUrl}
            alt={listing.public_title_en}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Premium Ribbon - Gradient banner at top */}
          {promotionTier === "premium" && (
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 py-1 px-3 flex items-center justify-center gap-1.5 shadow-md">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Premium Listing</span>
            </div>
          )}

          {/* Featured Ribbon - Subtle banner at top */}
          {promotionTier === "featured" && (
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 py-1 px-3 flex items-center justify-center gap-1.5 shadow-sm">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Featured</span>
            </div>
          )}

          {/* Category Badge - adjusted position for ribbon */}
          <Badge className={`absolute ${promotionTier !== "standard" ? "top-9" : "top-3"} left-3 bg-card/90 text-card-foreground backdrop-blur-sm`}>
            {getCategoryLabel(listing.category)}
          </Badge>

          {/* Promotion Badge - bottom left corner */}
          {promotionTier !== "standard" && (
            <div className="absolute bottom-3 left-3">
              <PromotionBadge tier={promotionTier} />
            </div>
          )}

          {/* Verified Badge - adjusted position for ribbon */}
          {listing.is_physically_verified && (
            <Badge className={`absolute ${promotionTier !== "standard" ? "top-9" : "top-3"} right-12 bg-verified text-verified-foreground`}>
              Verified
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            aria-label={isSaved ? "Remove from saved" : "Save listing"}
            className={`absolute ${promotionTier !== "standard" ? "top-9" : "top-2"} right-2 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card ${isSaved ? "text-red-500" : "text-muted-foreground"
              }`}
            onClick={handleSave}
            disabled={isSavePending}
          >
            {isSavePending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
            )}
          </Button>
        </div>

        <CardContent className={`p-4 ${promotionTier === "premium" ? "bg-gradient-to-b from-amber-50/50 to-transparent" : promotionTier === "featured" ? "bg-gradient-to-b from-blue-50/30 to-transparent" : ""}`}>
          {/* Title & Location */}
          <h3 className={`font-semibold text-lg line-clamp-1 transition-colors ${
            promotionTier === "premium"
              ? "text-amber-900 group-hover:text-amber-700"
              : promotionTier === "featured"
              ? "text-blue-900 group-hover:text-blue-700"
              : "text-foreground group-hover:text-primary"
          }`}>
            {listing.public_title_en}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">
              {listing.public_location_area && `${listing.public_location_area}, `}{listing.public_location_city_en}
            </span>
          </div>

          {/* Price */}
          <div className="mt-4">
            <span className="text-2xl font-bold text-foreground">
              {formatCurrency(listing.asking_price_eur, "EUR")}
            </span>
          </div>

          {/* Key Metrics */}
          <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-border">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" />
                <span className="text-xs">Revenue</span>
              </div>
              <p className="text-sm font-semibold text-foreground mt-0.5">
                {formatCurrency(listing.monthly_revenue_eur || 0, "EUR")}/mo
              </p>
            </div>
            <div className="text-center border-x border-border">
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" />
                <span className="text-xs">ROI</span>
              </div>
              <p className="text-sm font-semibold text-accent">{listing.roi ?? "-"}%</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span className="text-xs">Staff</span>
              </div>
              <p className="text-sm font-semibold text-foreground mt-0.5">{listing.employee_count || "-"}</p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>
                {listing.years_in_operation || "-"} years
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              <span>
                {listing.view_count} views
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
