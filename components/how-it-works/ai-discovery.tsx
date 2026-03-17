"use client"

import { formatCurrency } from "@/lib/currency"
import {
  Sparkles,
  MessageSquare,
  Search,
  Building2,
  MapPin,
  BadgeCheck,
  Send,
} from "lucide-react"

export function AiDiscovery() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-background to-accent/[0.03]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Steps */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm text-accent mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="font-medium">AI-Powered</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-6">Smart Business Discovery</h2>
            <p className="text-lg text-muted-foreground mb-8">Our AI assistant understands what you&apos;re looking for and finds the best matches from our verified listings.</p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">1. Tell Us What You Want</h3>
                  <p className="text-sm text-muted-foreground mt-1">Describe your ideal business in plain language &mdash; budget, location, industry, ROI expectations. Our AI understands natural conversation.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Search className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">2. AI Searches Our Database</h3>
                  <p className="text-sm text-muted-foreground mt-1">The AI searches across all verified listings, matching your criteria against real financial data, location, and business details.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">3. Get Curated Results</h3>
                  <p className="text-sm text-muted-foreground mt-1">Receive a personalized shortlist with key metrics &mdash; asking price, revenue, ROI &mdash; so you can compare opportunities instantly.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">4. Refine & Explore</h3>
                  <p className="text-sm text-muted-foreground mt-1">Ask follow-up questions, narrow your search, or explore related opportunities. The AI remembers your preferences across conversations.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Static chat mockup */}
          <div className="relative">
            <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-2xl p-6 sm:p-8">
              <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                {/* Chat header */}
                <div className="h-11 border-b border-border flex items-center px-4 gap-2.5">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-foreground">AI Recommendations</span>
                </div>

                {/* Chat messages */}
                <div className="p-4 space-y-4 min-h-[320px]">
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5 max-w-[85%]">
                      <p className="text-sm">I&apos;m looking for restaurants in Tirana under &euro;200,000 with good ROI</p>
                    </div>
                  </div>

                  {/* AI response */}
                  <div className="flex gap-2.5 items-start">
                    <div className="h-7 w-7 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <div className="space-y-3 flex-1 min-w-0">
                      <p className="text-sm text-foreground">I found 3 verified restaurants matching your criteria:</p>

                      {/* Mini listing card */}
                      <div className="bg-muted/50 rounded-lg border border-border/60 p-3">
                        <div className="flex items-start gap-3">
                          <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center shrink-0">
                            <Building2 className="h-5 w-5 text-muted-foreground/50" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[10px] bg-verified/10 text-verified px-1.5 py-px rounded-full flex items-center gap-1">
                                <BadgeCheck className="h-2.5 w-2.5" />
                                Verified
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-foreground truncate">Italian Restaurant</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                              <MapPin className="h-2.5 w-2.5" />
                              <span>Blloku, Tirana</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2.5 pt-2.5 border-t border-border/60 grid grid-cols-3 gap-2 text-center">
                          <div>
                            <p className="text-[10px] text-muted-foreground">Price</p>
                            <p className="text-xs font-semibold text-foreground">{formatCurrency(180000, "EUR")}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground">Revenue</p>
                            <p className="text-xs font-semibold text-foreground">{formatCurrency(15000, "EUR")}/mo</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground">ROI</p>
                            <p className="text-xs font-semibold text-success">24%</p>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        Want to see the other 2 results, or narrow down by area?
                      </p>
                    </div>
                  </div>
                </div>

                {/* Input bar */}
                <div className="border-t border-border p-3">
                  <div className="flex gap-2 items-center">
                    <div className="flex-1 h-9 rounded-md border border-input bg-background px-3 flex items-center">
                      <span className="text-sm text-muted-foreground">Ask about businesses...</span>
                    </div>
                    <div className="h-9 w-9 rounded-md bg-primary flex items-center justify-center shrink-0">
                      <Send className="h-3.5 w-3.5 text-primary-foreground" />
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
