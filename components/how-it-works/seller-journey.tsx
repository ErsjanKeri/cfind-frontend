"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  EyeOff,
  Handshake,
  ClipboardCheck,
  ArrowRight,
  Send,
  Store,
} from "lucide-react"

export function SellerJourney() {
  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="bg-gradient-to-br from-accent/5 to-success/5 rounded-2xl p-8">
              <div className="space-y-4">
                <div className="bg-card rounded-xl border shadow-sm p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Store className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Your Submission</p>
                      <p className="text-xs text-muted-foreground">Confidential process</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-medium text-accent">
                        1
                      </div>
                      <span className="text-sm text-muted-foreground">Submit business details</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-medium text-accent">
                        2
                      </div>
                      <span className="text-sm text-muted-foreground">Agent contacts you privately</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-success/10">
                      <div className="h-6 w-6 rounded-full bg-success/20 flex items-center justify-center text-xs font-medium text-success">
                        3
                      </div>
                      <span className="text-sm text-foreground font-medium">Agent verifies and creates listing</span>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-verified/10 flex items-center justify-center">
                      <ClipboardCheck className="h-6 w-6 text-verified" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Agent Verifies Everything</p>
                      <p className="text-xs text-muted-foreground">Physical inspection completed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm text-accent mb-4">
              <Store className="h-4 w-4" />
              <span className="font-medium">For Sellers</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-6">Sell With Complete Confidentiality</h2>
            <p className="text-lg text-muted-foreground mb-8">Agents handle the entire process so your business stays anonymous until you&apos;re ready.</p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Send className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">1. Submit Your Business</h3>
                  <p className="text-sm text-muted-foreground mt-1">Fill out our confidential seller form. Your information is never published or shared publicly.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <ClipboardCheck className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">2. Agent Verification</h3>
                  <p className="text-sm text-muted-foreground mt-1">A licensed agent will reach out to visit your business, review financials, and verify all details.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <EyeOff className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">3. Anonymous Listing Goes Live</h3>
                  <p className="text-sm text-muted-foreground mt-1">Your business is listed with general descriptions only. No name, no address, no photos that identify you.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                  <Handshake className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">4. Agent Handles Inquiries</h3>
                  <p className="text-sm text-muted-foreground mt-1">The agent screens all inquiries and only shares your details with serious, verified buyers.</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/register">
                  List Your Business
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
