"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Phone, UserPlus, ArrowRight } from "lucide-react"

export function HowItWorksPreview() {
  const steps = [
    {
      icon: Search,
      title: "Browse Freely",
      desc: "Explore verified listings with detailed financials. No account needed to browse.",
    },
    {
      icon: UserPlus,
      title: "Create Free Account",
      desc: "Sign up with just email and password. No documents required to see agent contacts.",
    },
    {
      icon: Phone,
      title: "Contact Agent Directly",
      desc: "Reach agents via WhatsApp, phone, or email. They handle all verifications privately.",
    },
  ]

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
            <span className="font-medium">Simple & Secure</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground">How It Works</h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">From discovery to ownership in three simple steps</p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={index} className="relative border-border bg-card">
              <CardContent className="pt-8 pb-6 px-6">
                {/* Step Number */}
                <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/how-it-works">
            <Button size="lg" variant="outline" className="group bg-transparent">
              Learn More
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
