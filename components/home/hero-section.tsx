"use client"

import { SearchBar } from "./search-bar"
import { Shield, CheckCircle, Lock } from "lucide-react"
import { getCountryName, type CountryCode } from "@/lib/constants"

interface HeroSectionProps {
  country: CountryCode
}

export function HeroSection({ country }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/subtle-grid-pattern.png')] opacity-5" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-verified/10 px-4 py-2 text-sm text-verified mb-6">
            <Shield className="h-4 w-4" />
            <span className="font-medium">Verified Agents & Confidential Listings</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
            Discover Your Next Business Opportunity
            <span className="block text-primary">in {getCountryName(country)}</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed text-pretty">
            Connect with verified business brokers and explore confidential listings across {getCountryName(country)}. From thriving cafes to established retail stores – find your perfect acquisition.
          </p>

          {/* Search Bar */}
          <div className="mt-10">
            <SearchBar country={country} variant="hero" />
          </div>

          {/* Trust Points */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-5 w-5 text-verified" />
              <span>Verified agents only</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-5 w-5 text-verified" />
              <span>Confidential listings</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-5 w-5 text-verified" />
              <span>Secure transactions</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
