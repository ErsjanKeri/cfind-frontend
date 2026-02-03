"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useUser } from "@/lib/hooks/useAuth"
import { formatCurrency, type Currency } from "@/lib/currency"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
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
  TrendingUp,
  Users,
  Clock,
  Eye,
  Shield,
  Lock,
  ChevronLeft,
  ChevronRight,
  Building2,
  Calendar,
  FileText,
  CheckCircle,
  MessageCircle,
  Phone,
  Mail,
  Heart,
  Share2,
  Loader2,
} from "lucide-react"
import { businessCategories } from "@/lib/constants"
import type { Listing } from "@/lib/api/types"

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

interface ListingDetailClientProps {
  listingId: string
}

export function ListingDetailClient({ listingId }: ListingDetailClientProps) {
  const { user } = useUser() // Fetch user via JWT cookie
  const isAuthenticated = !!user // Derived

  // Fetch listing data using React Query
  const { data: listing, isLoading } = useListing(listingId)

  const createLead = useCreateLead()
  const toggleSaved = useToggleSavedListing()
  const { data: savedListings } = useSavedListings()
  const [currency, setCurrency] = useState<Currency>("EUR")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isContactingAgent, setIsContactingAgent] = useState(false)

  // Load currency preference
  useEffect(() => {
    const saved = localStorage.getItem("currency") as Currency
    if (saved) setCurrency(saved)
  }, [])

  // Check if listing is already saved on mount
  useEffect(() => {
    if (user?.id && listing) {
      Promise.resolve(savedListings || []).then((savedListings) => {
        const isAlreadySaved = savedListings.some((saved: any) => saved.id === listing.id)
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
            <p className="text-muted-foreground mt-2">The listing you're looking for doesn't exist.</p>
            <Link href="/listings">
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
      } catch (error: any) {
        toast.error(error.message || "Failed to record contact")
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
    } catch (error: any) {
      toast.error(error.message || "Failed to save listing")
    } finally {
      setIsSaving(false)
    }
  }

  const nextImage = () => {
    if (!listing.images) return
    setCurrentImageIndex((prev) => (prev === listing.images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    if (!listing.images) return
    setCurrentImageIndex((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1))
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getCategoryLabel = (category: string) => {
    return businessCategories.find((c) => c.value === category)?.label ?? category
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-card border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/listings" className="text-muted-foreground hover:text-foreground">
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
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
                <Image
                  src={listing.images?.[currentImageIndex]?.url || "/placeholder.svg?height=600&width=900&query=business"}
                  alt={listing.public_title_en}
                  fill
                  className="object-cover"
                  priority
                />

                {listing.images && listing.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card/90 backdrop-blur flex items-center justify-center hover:bg-card transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card/90 backdrop-blur flex items-center justify-center hover:bg-card transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {listing.images?.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`h-2 w-2 rounded-full transition-colors ${idx === currentImageIndex ? "bg-primary" : "bg-card/70"
                            }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-card/90 text-card-foreground backdrop-blur">
                    {getCategoryLabel(listing.category)}
                  </Badge>
                  {listing.is_physically_verified && (
                    <Badge className="bg-verified text-verified-foreground">
                      <Shield className="mr-1 h-3 w-3" />
                      Agent Verified
                    </Badge>
                  )}
                </div>

                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-10 w-10 rounded-full bg-card/90 backdrop-blur flex items-center justify-center hover:bg-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Heart className={`h-5 w-5 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
                    )}
                  </button>
                  <button className="h-10 w-10 rounded-full bg-card/90 backdrop-blur flex items-center justify-center hover:bg-card transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

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

              {/* Key Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    Financial Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Asking Price</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(currency === "EUR" ? listing.asking_price_eur : listing.asking_price_lek, currency)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {formatCurrency(
                          (currency === "EUR" ? listing.monthly_revenue_eur : listing.monthly_revenue_lek) || 0,
                          currency
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ROI</p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {listing.roi ? (
                          `${listing.roi}%`
                        ) : (
                          <span className="flex items-center gap-1 text-base font-normal text-muted-foreground">
                            <Lock className="h-4 w-4" />
                            Hidden
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ROI</p>
                      <p className="text-2xl font-bold text-accent mt-1">{listing.roi}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <p className="text-sm text-muted-foreground">Asking Price</p>
                    <p className="text-4xl font-bold text-foreground mt-1">{formatCurrency(currency === "EUR" ? listing.asking_price_eur : listing.asking_price_lek, currency)}</p>
                    <p className="text-sm text-accent mt-1">
                      {listing.roi}% ROI
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button
                      className="w-full h-12 text-base bg-[#25D366] hover:bg-[#20BD5A] text-white"
                      size="lg"
                      onClick={() => handleContactClick("whatsapp")}
                      disabled={isContactingAgent}
                    >
                      {isContactingAgent ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <WhatsAppIcon className="mr-2 h-5 w-5" />
                      )}
                      {isContactingAgent ? "Recording contact..." : "Contact via WhatsApp"}
                    </Button>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="h-10 bg-transparent"
                        onClick={() => handleContactClick("phone")}
                        disabled={isContactingAgent}
                      >
                        {isContactingAgent ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Phone className="mr-2 h-4 w-4" />
                        )}
                        Call
                      </Button>
                      <Button
                        variant="outline"
                        className="h-10 bg-transparent"
                        onClick={() => handleContactClick("email")}
                        disabled={isContactingAgent}
                      >
                        {isContactingAgent ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Mail className="mr-2 h-4 w-4" />
                        )}
                        Email
                      </Button>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {listing.agent_name && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-3">Listed By</p>
                      <div className="flex items-center gap-3 p-2">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(listing.agent_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate">{listing.agent_name}</p>
                          <Badge className="bg-verified/10 text-verified text-xs px-1.5 mt-1">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Verified Agent
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        {isAuthenticated ? (
                          <>
                            {listing.agent_phone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-foreground">{listing.agent_phone}</span>
                              </div>
                            )}
                            {listing.agent_whatsapp && (
                              <div className="flex items-center gap-2 text-sm">
                                <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                                <span className="text-foreground">{listing.agent_whatsapp}</span>
                              </div>
                            )}
                            {listing.agent_email && (
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-foreground truncate">{listing.agent_email}</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="p-3 rounded-lg bg-muted/50 border border-dashed border-border">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Lock className="h-4 w-4" />
                              <span>Sign in to see contact info</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>


              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground text-sm">Protected Listing</p>
                      <p className="text-xs text-muted-foreground mt-1">Create an account to view agent contact information and connect directly</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
              <Link href={`/register?redirect=${encodeURIComponent(`/listings/${listing.id}`)}`}>
                Create Free Account
              </Link>
            </Button>
          </DialogFooter>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href={`/login?redirect=${encodeURIComponent(`/listings/${listing.id}`)}`}
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
