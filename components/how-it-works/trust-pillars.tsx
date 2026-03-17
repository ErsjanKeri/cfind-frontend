"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BadgeCheck, EyeOff, Phone, CheckCircle } from "lucide-react"

export function TrustPillars() {
  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Our Solution: Three Pillars of Trust</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">Cfind operates on three non-negotiable principles that protect everyone involved.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="relative">
            <div className="absolute -top-4 -left-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <Card className="pt-10 h-full">
              <CardContent>
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <BadgeCheck className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Agent-Verified Listings</h3>
                <p className="text-muted-foreground mb-4">Business owners cannot list directly. Every listing is created by a verified agent who has physically inspected the business.</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-verified mt-0.5 shrink-0" />
                    <span>Agents visit the business in person</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-verified mt-0.5 shrink-0" />
                    <span>Financial documents are reviewed</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-verified mt-0.5 shrink-0" />
                    <span>Agent certifies listing accuracy</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="relative">
            <div className="absolute -top-4 -left-4 h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-accent">2</span>
            </div>
            <Card className="pt-10 h-full">
              <CardContent>
                <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                  <EyeOff className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Blind Listings</h3>
                <p className="text-muted-foreground mb-4">Listings never reveal the business name or exact address. Competitors cannot identify who is selling. Your business stays protected.</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-verified mt-0.5 shrink-0" />
                    <span>Only general descriptions (e.g., &quot;Italian Restaurant&quot;)</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-verified mt-0.5 shrink-0" />
                    <span>Area shown, not full address</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-verified mt-0.5 shrink-0" />
                    <span>Photos avoid branding and signage</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="relative">
            <div className="absolute -top-4 -left-4 h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-success">3</span>
            </div>
            <Card className="pt-10 h-full">
              <CardContent>
                <div className="h-14 w-14 rounded-xl bg-success/10 flex items-center justify-center mb-6">
                  <Phone className="h-7 w-7 text-success" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Direct Agent Contact</h3>
                <p className="text-muted-foreground mb-4">Investors contact agents directly via WhatsApp, phone, or email. The agent manages all verifications and negotiations personally.</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-verified mt-0.5 shrink-0" />
                    <span>Create account to see agent contacts</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-verified mt-0.5 shrink-0" />
                    <span>WhatsApp, phone and email available</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-verified mt-0.5 shrink-0" />
                    <span>Agent manually verifies each investor</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
