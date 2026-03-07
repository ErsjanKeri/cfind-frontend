"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Shield, Eye, Users, FileText, Search, Store } from "lucide-react"

import { TrustPillars } from "@/components/how-it-works/trust-pillars"
import { InvestorJourney } from "@/components/how-it-works/investor-journey"
import { SellerJourney } from "@/components/how-it-works/seller-journey"
import { FaqSection } from "@/components/how-it-works/faq-section"
import { getCountryOrDefault } from "@/lib/country"

export default function HowItWorksPage() {
  const country = getCountryOrDefault()
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary),0.08),transparent_50%)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full bg-verified/10 px-4 py-2 text-sm text-verified mb-6">
                <Shield className="h-4 w-4" />
                <span className="font-medium">Trust Through Verification</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
                How CompanyFinder Works
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed text-pretty">
                We are a secure marketplace where every business is physically verified by licensed agents. Investors can browse freely and contact agents directly. Sellers remain anonymous until they decide otherwise.
              </p>
            </div>
          </div>
        </section>

        {/* The Problem We Solve */}
        <section className="py-16 sm:py-20 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Why Traditional Marketplaces Fail</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">Selling a business is sensitive. Traditional platforms expose owners to competitors and unverified listings.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-destructive/20 bg-destructive/5">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                    <Eye className="h-6 w-6 text-destructive" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Exposure Risk</h3>
                  <p className="text-sm text-muted-foreground">Competitors can see your business is for sale, potentially damaging relationships with customers and employees.</p>
                </CardContent>
              </Card>

              <Card className="border-destructive/20 bg-destructive/5">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-destructive" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Unverified Listings</h3>
                  <p className="text-sm text-muted-foreground">Anyone can list anything. Investors waste time viewing businesses that don&apos;t exist or have exaggerated data.</p>
                </CardContent>
              </Card>

              <Card className="border-destructive/20 bg-destructive/5">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-destructive" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">No Professional Intermediary</h3>
                  <p className="text-sm text-muted-foreground">Without a verified agent, both buyers and sellers are exposed to scams and wasted time.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <TrustPillars />
        <InvestorJourney />
        <SellerJourney />
        <FaqSection />

        {/* CTA Section */}
        <section className="py-16 sm:py-24 bg-primary">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl mb-4">Ready to Start?</h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">Whether you&apos;re looking to buy or sell, CompanyFinder provides the secure, agent-driven process you need.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-base">
                <Link href={`/${country}/listings`}>
                  <Search className="mr-2 h-5 w-5" />
                  Browse Listings
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-base bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link href="/register">
                  <Store className="mr-2 h-5 w-5" />
                  List Your Business
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
