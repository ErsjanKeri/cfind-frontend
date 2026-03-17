"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useUser } from "@/lib/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useCreateLead } from "@/lib/hooks/useLeads"
import { useSavedListing } from "@/lib/hooks/useSavedListing"
import { useListing } from "@/lib/hooks/useListings"
import { MapPin, Lock, FileText } from "lucide-react"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { LoginPromptDialog } from "@/components/shared/login-prompt-dialog"
import { getErrorMessage, getWhatsAppUrl } from "@/lib/utils"
import type { CountryCode } from "@/lib/constants"
import { ListingImageGallery } from "@/components/listings/listing-image-gallery"
import { FinancialOverviewCard } from "@/components/listings/financial-overview-card"
import { AgentContactSidebar } from "@/components/listings/agent-contact-sidebar"
import { BusinessDetailsCard } from "@/components/listings/business-details-card"

interface ListingDetailClientProps {
  listingId: string
  country: CountryCode
}

export function ListingDetailClient({ listingId, country }: ListingDetailClientProps) {
  const { user } = useUser() // Fetch user via JWT cookie
  const isAuthenticated = !!user // Derived

  // Fetch listing data using React Query
  const { data: listing, isLoading } = useListing(listingId)

  const createLead = useCreateLead()
  const { isSaved, toggleSave, isPending: isSaving } = useSavedListing(listing?.id)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [isContactingAgent, setIsContactingAgent] = useState(false)


  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </main>
        <Footer />
      </div>
    )
  }

  // Not found state
  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Listing Not Found</h1>
            <p className="text-muted-foreground mt-2">The listing you&apos;re looking for doesn&apos;t exist.</p>
            <Link href={`/${country}/listings`}>
              <Button className="mt-4">Browse Listings</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Helper functions (after we've confirmed listing exists)
  const whatsAppUrl = getWhatsAppUrl(
    listing.agent_whatsapp || '',
    `Hi ${listing.agent_name}, I'm interested in your listing: "${listing.public_title_en}" on Cfind. Can we discuss this opportunity?`,
  )

  const handleContactClick = async (method: "whatsapp" | "phone" | "email") => {
    if (isAuthenticated) {
      setIsContactingAgent(true)
      try {
        await createLead.mutateAsync({ listing_id: listing.id, interaction_type: method })
        toast.success("Contact recorded! Opening contact method...")
      } catch (error: unknown) {
        toast.error(getErrorMessage(error, "Failed to record contact"))
        setIsContactingAgent(false)
        return
      } finally {
        setIsContactingAgent(false)
      }
    }

    if (method === "whatsapp") {
      window.open(whatsAppUrl, "_blank")
    } else if (method === "phone") {
      if (!isAuthenticated) {
        setShowLoginPrompt(true)
        return
      }
      window.location.href = `tel:${listing.agent_phone}`
    } else if (method === "email") {
      if (!isAuthenticated) {
        setShowLoginPrompt(true)
        return
      }
      window.location.href = `mailto:${listing.agent_email}?subject=${encodeURIComponent(`Inquiry about: ${listing.public_title_en}`)}`
    }
  }

  const handleSave = async () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true)
      return
    }

    await toggleSave()
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-card border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm">
              <Link href={`/${country}/listings`} className="text-muted-foreground hover:text-foreground">
                Listings
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium truncate">{listing.public_title_en}</span>
            </nav>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <ListingImageGallery
                images={listing.images}
                title={listing.public_title_en}
                category={listing.category}
                isVerified={listing.is_physically_verified}
                isSaved={isSaved}
                isSaving={isSaving}
                onSave={handleSave}
              />

              {/* Title & Location */}
              <div>
                <h1 className="text-3xl font-bold text-foreground">{listing.public_title_en}</h1>
                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span className="text-lg">
                    {listing.public_location_area && `${listing.public_location_area}, `}{listing.public_location_city_en}
                  </span>
                  <Badge variant="outline" className="ml-2">
                    <Lock className="mr-1 h-3 w-3" />
                    Blind Location
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    Business Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{listing.public_description_en}</p>
                </CardContent>
              </Card>

              {/* Financial Overview */}
              <FinancialOverviewCard
                askingPriceEur={listing.asking_price_eur}
                monthlyRevenueEur={listing.monthly_revenue_eur}
                roi={listing.roi}
              />

              <BusinessDetailsCard
                employeeCount={listing.employee_count}
                yearsInOperation={listing.years_in_operation}
                viewCount={listing.view_count}
              />
            </div>

            {/* Sidebar */}
            <AgentContactSidebar
              askingPriceEur={listing.asking_price_eur}
              roi={listing.roi}
              agentName={listing.agent_name}
              agentPhone={listing.agent_phone}
              agentWhatsapp={listing.agent_whatsapp}
              agentEmail={listing.agent_email}
              isAuthenticated={isAuthenticated}
              isContactingAgent={isContactingAgent}
              onContactClick={handleContactClick}
            />
          </div>
        </div>
      </main>

      <Footer />

      <LoginPromptDialog
        open={showLoginPrompt}
        onOpenChange={setShowLoginPrompt}
        redirectPath={`/${country}/listings/${listing.id}`}
        agentName={listing.agent_name}
        agentAgencyName={listing.agent_agency_name}
      />
    </div>
  )
}
