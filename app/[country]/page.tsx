import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedListings } from "@/components/home/featured-listings"
import { PremiumCarousel } from "@/components/home/premium-carousel"
import { HowItWorksPreview } from "@/components/home/how-it-works-preview"
import { StatsSection } from "@/components/home/stats-section"
import { api } from "@/lib/api"
import type { Listing } from "@/lib/api/types"
import type { CountryCode } from "@/lib/constants"

export const dynamic = "force-dynamic"

export default async function HomePage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params
  const countryCode = country as CountryCode

  let listings: Listing[] = []
  try {
    const response = await api.listings.getListings({ country_code: countryCode, page: 1, page_size: 20 })
    listings = response.listings || []
  } catch {
    listings = []
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection country={countryCode} />
        <PremiumCarousel listings={listings} />
        <StatsSection />
        <FeaturedListings listings={listings} country={countryCode} />
        <HowItWorksPreview />
      </main>
      <Footer />
    </div>
  )
}
