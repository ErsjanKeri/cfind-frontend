"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUser } from "@/lib/hooks/useAuth"
import { useBuyerLeads } from "@/lib/hooks/useLeads"
import { formatCurrency } from "@/lib/currency"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MessageCircle, Phone, Mail, Search, ExternalLink, Loader2 } from "lucide-react"
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon"
import { getInitials } from "@/lib/utils"
import type { Lead } from "@/lib/api/types"
import { getCountryOrDefault } from "@/lib/country"

export default function ContactHistoryPage() {
  const country = getCountryOrDefault()
  const router = useRouter()
  const { user } = useUser() // Fetch user via JWT cookie
  const isAuthenticated = !!user // Derived

  // Use React Query hook instead of deprecated action
  const { data: contactHistory = [], isLoading: loading } = useBuyerLeads(user?.id)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/profile/contacts")
    }
  }, [isAuthenticated, router])

  if (!user) {
    return null
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
              {contactHistory.map((lead: Lead) => (
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
                              {lead.listing_title}
                            </h3>
                            <p className="text-lg font-semibold text-foreground mt-2">
                              {formatCurrency(lead.listing_asking_price_eur, "EUR")}
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
