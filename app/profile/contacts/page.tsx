"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUser } from "@/lib/hooks/useAuth"
import { useBuyerLeads } from "@/lib/hooks/useLeads"
import { formatCurrency, type Currency } from "@/lib/currency"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MessageCircle, Phone, Mail, Search, ExternalLink, Loader2 } from "lucide-react"

// WhatsApp icon component
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default function ContactHistoryPage() {
  const router = useRouter()
  const { user } = useUser() // Fetch user via JWT cookie
  const isAuthenticated = !!user // Derived
  const [currency, setCurrency] = useState<Currency>("EUR")

  // Use React Query hook instead of deprecated action
  const { data: contactHistory = [], isLoading: loading } = useBuyerLeads(user?.id)

  useEffect(() => {
    const saved = localStorage.getItem("currency") as Currency
    if (saved) setCurrency(saved)
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/profile/contacts")
    }
  }, [isAuthenticated, router])

  if (!user) {
    return null
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getContactIcon = (method: string) => {
    switch (method) {
      case "whatsapp":
        return <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
      case "phone":
        return <Phone className="h-5 w-5 text-primary" />
      case "email":
        return <Mail className="h-5 w-5 text-primary" />
      default:
        return <MessageCircle className="h-5 w-5 text-primary" />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
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
              <h1 className="text-2xl font-bold text-foreground">Contact History</h1>
              <p className="text-muted-foreground mt-1">
                {contactHistory.length} agents contacted
              </p>
            </div>
          </div>

          {/* Contact History List */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : contactHistory.length > 0 ? (
            <div className="space-y-4">
              {contactHistory.map((lead: any) => (
                <Card key={lead.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      {/* Listing Info */}
                      <div className="flex-1 p-4 sm:p-6">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                            {getContactIcon(lead.interaction_type)}
                          </div>
                          <div className="flex-1">
                            <Badge variant="outline" className="mb-2">
                              {lead.interaction_type === "whatsapp" && "WhatsApp"}
                              {lead.interaction_type === "phone" && "Call"}
                              {lead.interaction_type === "email" && "Email"}
                            </Badge>
                            <h3 className="font-semibold text-lg text-foreground">
                              {lead.listing?.public_title_en || "Listing"}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {lead.listing?.public_location_area}, {lead.listing?.public_location_city_en}
                            </p>
                            <p className="text-lg font-semibold text-foreground mt-2">
                              {formatCurrency(Number(lead.listing?.asking_price_eur) || 0, currency)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            Contacted on {new Date(lead.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Agent Info - Backend doesn't return agent info yet */}
                      <div className="border-t sm:border-t-0 sm:border-l border-border p-4 sm:p-6 sm:w-64 bg-muted/30">
                        <p className="text-xs font-medium text-muted-foreground mb-3">
                          LISTING
                        </p>

                        <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent" asChild>
                          <Link href={`/listings/${lead.listing_id}`}>
                            View Details
                            <ExternalLink className="ml-2 h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <MessageCircle className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No contacts yet</h3>
              <p className="text-muted-foreground mb-6">Browse listings and contact agents to see your contact history here</p>
              <Button asChild>
                <Link href="/listings">
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
