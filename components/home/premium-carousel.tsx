"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Sparkles, MapPin, TrendingUp, Crown } from "lucide-react"
import { formatCurrency } from "@/lib/currency"
import { getCategoryLabel } from "@/lib/constants"
import type { Listing } from "@/lib/api/types"

interface PremiumCarouselProps {
    listings: Listing[]
}

export function PremiumCarousel({ listings }: PremiumCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)

    // Filter only premium listings
    const premiumListings = listings.filter(l => l.promotion_tier === "premium")

    // Don't render if no premium listings
    if (premiumListings.length === 0) return null

    const checkScrollButtons = () => {
        if (!scrollRef.current) return
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        setCanScrollLeft(scrollLeft > 0)
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)
    }

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return
        const cardWidth = 400 // Approximate card width
        const scrollAmount = direction === "left" ? -cardWidth : cardWidth
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
        setTimeout(checkScrollButtons, 300)
    }

    return (
        <section className="py-12 sm:py-16 bg-gradient-to-b from-amber-50/50 to-transparent">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200/50">
                            <Crown className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-amber-900 flex items-center gap-2">
                                Premium Listings
                                <Sparkles className="h-5 w-5 text-amber-500" />
                            </h2>
                            <p className="text-sm text-amber-700/70">Top business opportunities hand-picked for you</p>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => scroll("left")}
                            disabled={!canScrollLeft}
                            className="h-9 w-9 rounded-full border-amber-300 hover:bg-amber-100 disabled:opacity-50"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => scroll("right")}
                            disabled={!canScrollRight}
                            className="h-9 w-9 rounded-full border-amber-300 hover:bg-amber-100 disabled:opacity-50"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Carousel */}
                <div
                    ref={scrollRef}
                    onScroll={checkScrollButtons}
                    className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {premiumListings.map((listing) => (
                        <PremiumListingCard key={listing.id} listing={listing} />
                    ))}
                </div>

                {/* Mobile scroll hint */}
                <div className="flex sm:hidden justify-center mt-4">
                    <p className="text-xs text-amber-600/70">Swipe to see more</p>
                </div>
            </div>
        </section>
    )
}

interface PremiumListingCardProps {
    listing: Listing
}

function PremiumListingCard({ listing }: PremiumListingCardProps) {
    return (
        <Link href={`/listings/${listing.id}`} className="snap-start">
            <Card className="w-[360px] sm:w-[400px] flex-shrink-0 overflow-hidden border-2 border-amber-400 shadow-xl shadow-amber-200/40 hover:shadow-2xl hover:shadow-amber-300/50 hover:border-amber-500 transition-all duration-300 bg-white">
                {/* Image with Premium ribbon */}
                <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                        src={listing.images[0]?.url || "/placeholder.svg?height=300&width=500&query=business"}
                        alt={listing.public_title_en}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                    {/* Golden gradient overlay at top */}
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 py-1.5 px-4 flex items-center justify-center gap-2 shadow-md">
                        <Sparkles className="h-3.5 w-3.5 text-amber-900" />
                        <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Premium Listing</span>
                        <Sparkles className="h-3.5 w-3.5 text-amber-900" />
                    </div>
                    {/* Category badge */}
                    <Badge className="absolute bottom-3 left-3 bg-amber-100 text-amber-800 border-amber-300">
                        {getCategoryLabel(listing.category)}
                    </Badge>
                    {/* Verified badge */}
                    {listing.is_physically_verified && (
                        <Badge className="absolute bottom-3 right-3 bg-green-100 text-green-800 border-green-300">
                            Verified
                        </Badge>
                    )}
                </div>

                <CardContent className="p-5 bg-gradient-to-b from-amber-50/60 to-white">
                    {/* Title */}
                    <h3 className="font-bold text-lg text-amber-900 line-clamp-1 mb-1">
                        {listing.public_title_en}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-amber-700/80 mb-4">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">
                            {listing.public_location_area && `${listing.public_location_area}, `}{listing.public_location_city_en}
                        </span>
                    </div>

                    {/* Price & ROI */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-amber-600 uppercase font-medium">Asking Price</p>
                            <p className="text-2xl font-bold text-amber-900">
                                {formatCurrency(listing.asking_price_eur, "EUR")}
                            </p>
                        </div>
                        {listing.roi && (
                            <div className="text-right">
                                <p className="text-xs text-amber-600 uppercase font-medium">ROI</p>
                                <div className="flex items-center gap-1">
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                    <span className="text-xl font-bold text-green-700">{listing.roi}%</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Agent info teaser */}
                    {listing.agent_name && (
                        <div className="mt-4 pt-4 border-t border-amber-200 flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-amber-200 flex items-center justify-center">
                                <span className="text-xs font-semibold text-amber-800">
                                    {listing.agent_name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-amber-900 truncate">
                                    {listing.agent_name}
                                </p>
                                <p className="text-xs text-amber-600 truncate">
                                    {listing.agent_agency_name || "Business Broker"}
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    )
}
