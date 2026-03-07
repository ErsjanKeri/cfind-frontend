"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useUser } from "@/lib/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { useCreateLead, useToggleSavedListing, useSavedListings } from "@/lib/hooks/useLeads"
import { useListing } from "@/lib/hooks/useListings"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  MapPin,
  Users,
  Clock,
  Eye,
  Lock,
  Building2,
  FileText,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { getInitials } from "@/lib/utils"
import type { Listing } from "@/lib/api/types"
import type { CountryCode } from "@/lib/constants"
import { ListingImageGallery } from "@/components/listings/listing-image-gallery"
import { FinancialOverviewCard } from "@/components/listings/financial-overview-card"
import { AgentContactSidebar } from "@/components/listings/agent-contact-sidebar"

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
  const toggleSaved = useToggleSavedListing()
  const { data: savedListings } = useSavedListings()
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isContactingAgent, setIsContactingAgent] = useState(false)

  // Check if listing is already saved on mount
  useEffect(() => {
    if (user?.id && listing) {
      Promise.resolve(savedListings || []).then((savedListings) => {
        const isAlreadySaved = savedListings.some((saved: Listing) => saved.id === listing.id)
        setIsSaved(isAlreadySaved)
      })
    }
  }, [user?.id, listing, savedListings])


  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
  const getWhatsAppUrl = () => {
    const message = encodeURIComponent(
      `Hi ${listing.agent_name}, I'm interested in your listing: "${listing.public_title_en}" on Company Finder. Can we discuss this opportunity?`,
    )
    return `https://wa.me/${listing.agent_whatsapp?.replace(/[^0-9]/g, "")}?text=${message}`
  }

  const handleContactClick = async (method: "whatsapp" | "phone" | "email") => {
    if (isAuthenticated) {
      setIsContactingAgent(true)
      try {
        await createLead.mutateAsync({ listing_id: listing.id, interaction_type: method })
        toast.success("Contact recorded! Opening contact method...")
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : "Failed to record contact")
        setIsContactingAgent(false)
        return
      } finally {
        setIsContactingAgent(false)
      }
    }

    if (method === "whatsapp") {
      window.open(getWhatsAppUrl(), "_blank")
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
      window.location.href = `mailto:${listing.agent_email}?subject=Inquiry about: ${listing.public_title_en}`
    }
  }

  const handleSave = async () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true)
      return
    }

    setIsSaving(true)
    try {
      const result = await toggleSaved.mutateAsync(listing.id)
      setIsSaved(result.is_saved)
      toast.success(result.is_saved ? "Listing saved!" : "Listing unsaved")
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to save listing")
    } finally {
      setIsSaving(false)
    }
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

              {/* Business Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    Business Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <Users className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Employees</p>
                        <p className="font-semibold">{listing.employee_count || "-"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Years Operating</p>
                        <p className="font-semibold">
                          {listing.years_in_operation || "-"} years
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Views</p>
                        <p className="font-semibold">
                          {listing.view_count || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-start gap-3">
                      <Lock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Additional Information Hidden</p>
                        <p className="text-sm text-muted-foreground mt-1">Contact the agent to receive the full business profile including exact location, business name, and detailed financials.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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

      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Create Account to Contact
            </DialogTitle>
            <DialogDescription>Create a free account to view agent contact information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{getInitials(listing.agent_name || "Agent")}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{listing.agent_name}</p>
                  <p className="text-sm text-muted-foreground">{listing.agent_agency_name}</p>
                </div>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-verified" />
                View agent contact details
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-verified" />
                Save favorite listings
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-verified" />
                Get instant responses
              </li>
            </ul>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowLoginPrompt(false)} className="flex-1">
              Maybe Later
            </Button>
            <Button asChild className="flex-1">
              <Link href={`/register?redirect=${encodeURIComponent(`/${country}/listings/${listing.id}`)}`}>
                Create Free Account
              </Link>
            </Button>
          </DialogFooter>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href={`/login?redirect=${encodeURIComponent(`/${country}/listings/${listing.id}`)}`}
              className="text-primary hover:underline"
            >
              Sign In
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
