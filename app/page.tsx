import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { FeaturedListings } from "@/components/featured-listings"
import { PremiumCarousel } from "@/components/premium-carousel"
import { HowItWorksPreview } from "@/components/how-it-works-preview"
import { StatsSection } from "@/components/stats-section"
import { api } from "@/lib/api"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  // Fetch listings from backend API (server component)
  let listings: any[] = []
  try {
    const response = await api.listings.getListings({ page: 1, page_size: 20 })
    listings = response.listings || []
  } catch (error) {
    console.error('Failed to fetch listings:', error)
    listings = []
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <PremiumCarousel listings={listings} />
        <StatsSection />
        <FeaturedListings listings={listings} />
        <HowItWorksPreview />
      </main>
      <Footer />
    </div>
  )
}
