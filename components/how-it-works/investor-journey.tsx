"use client"

import { formatCurrency } from "@/lib/currency"
import {
  Search,
  Handshake,
  Building2,
  MapPin,
  Phone,
  UserPlus,
  Briefcase,
  PhoneCall,
  BadgeCheck,
  MessageSquare,
} from "lucide-react"

export function InvestorJourney() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
              <Briefcase className="h-4 w-4" />
              <span className="font-medium">For Investors</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-6">Your Path to Ownership</h2>
            <p className="text-lg text-muted-foreground mb-8">Finding and buying a business on Cfind is simple. Browse, contact, negotiate.</p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">1. Browse & Discover</h3>
                  <p className="text-sm text-muted-foreground mt-1">Search by category, location, price range and ROI. View key financial data and general location on each listing.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">2. Create Account (Free)</h3>
                  <p className="text-sm text-muted-foreground mt-1">Sign up with just email and password. Once logged in, agent contact info (WhatsApp, phone, email) becomes visible.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <PhoneCall className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">3. Contact Agent Directly</h3>
                  <p className="text-sm text-muted-foreground mt-1">Reach out via WhatsApp or phone. The agent will verify your identity and seriousness before revealing sensitive details.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                  <Handshake className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">4. Negotiate & Buy</h3>
                  <p className="text-sm text-muted-foreground mt-1">Once the agent verifies your seriousness, you&apos;ll get the business name, exact location and full details to proceed.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8">
              <div className="space-y-4">
                <div className="bg-card rounded-xl border p-4 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-verified/10 text-verified px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      </div>
                      <h4 className="font-semibold text-foreground">High-End Italian Restaurant</h4>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>Blloku Area, Tirana</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Asking Price</p>
                      <p className="font-semibold text-foreground">{formatCurrency(180000, "EUR")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Annual Revenue</p>
                      <p className="font-semibold text-foreground">{formatCurrency(320000, "EUR")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">ROI</p>
                      <p className="font-semibold text-success">24%</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg border p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-verified/10 flex items-center justify-center">
                      <BadgeCheck className="h-5 w-5 text-verified" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Agent Arben Hoxha</p>
                      <p className="text-xs text-muted-foreground">Verified Agent</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-9 rounded bg-[#25D366]/10 flex items-center justify-center gap-2 text-sm text-[#25D366] font-medium">
                      <MessageSquare className="h-4 w-4" />
                      WhatsApp
                    </div>
                    <div className="flex-1 h-9 rounded bg-primary/10 flex items-center justify-center gap-2 text-sm text-primary font-medium">
                      <Phone className="h-4 w-4" />
                      Call
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
