"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency, type Currency } from "@/lib/currency"
import Link from "next/link"
import { useState, useEffect } from "react"
import {
  Shield,
  EyeOff,
  BadgeCheck,
  Search,
  MessageSquare,
  Handshake,
  Building2,
  ClipboardCheck,
  CheckCircle,
  ArrowRight,
  Users,
  MapPin,
  Phone,
  UserPlus,
  FileText,
  Send,
  Eye,
  Briefcase,
  Store,
  PhoneCall,
  HelpCircle,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HowItWorksPage() {
  const [currency, setCurrency] = useState<Currency>("EUR")

  useEffect(() => {
    const saved = localStorage.getItem("currency") as Currency
    if (saved) setCurrency(saved)
  }, [])

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
                  <p className="text-sm text-muted-foreground">Anyone can list anything. Investors waste time viewing businesses that don't exist or have exaggerated data.</p>
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

        {/* Our Solution - The Three Pillars */}
        <section className="py-16 sm:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Our Solution: Three Pillars of Trust</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">CompanyFinder operates on three non-negotiable principles that protect everyone involved.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Pillar 1 */}
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

              {/* Pillar 2 */}
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
                        <span>Only general descriptions (e.g., "Italian Restaurant")</span>
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

              {/* Pillar 3 */}
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

        {/* Journey Section - For Investors */}
        <section className="py-16 sm:py-24 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
                  <Briefcase className="h-4 w-4" />
                  <span className="font-medium">For Investors</span>
                </div>
                <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-6">Your Path to Ownership</h2>
                <p className="text-lg text-muted-foreground mb-8">Finding and buying a business on CompanyFinder is simple. Browse, contact, negotiate.</p>

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
                      <p className="text-sm text-muted-foreground mt-1">Once the agent verifies your seriousness, you'll get the business name, exact location and full details to proceed.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Representation */}
              <div className="relative">
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8">
                  <div className="space-y-4">
                    {/* Mock Listing Card */}
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
                          <p className="font-semibold text-foreground">{formatCurrency(180000, currency)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Annual Revenue</p>
                          <p className="font-semibold text-foreground">{formatCurrency(320000, currency)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">ROI</p>
                          <p className="font-semibold text-success">24%</p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info Preview */}
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

        {/* Journey Section - For Sellers */}
        <section className="py-16 sm:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Visual Representation */}
              <div className="order-2 lg:order-1">
                <div className="bg-gradient-to-br from-accent/5 to-success/5 rounded-2xl p-8">
                  {/* Seller to Agent Flow */}
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

                    {/* Agent Verification Badge */}
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
                <p className="text-lg text-muted-foreground mb-8">Agents handle the entire process so your business stays anonymous until you're ready.</p>

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

        {/* FAQ Section */}
        <section className="py-16 sm:py-24 bg-background">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground mb-4">
                <HelpCircle className="h-4 w-4" />
                <span>FAQ</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Frequently Asked Questions</h2>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium">Why can't sellers list directly?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">To protect both buyers and sellers. Agent verification ensures every listing is real, data is accurate, and sellers stay anonymous until they choose to reveal themselves.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium">Do investors need to provide documents?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">No! Just create a free account with email and password. The agent will verify your seriousness through conversation, not documents.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium">How long does listing verification take?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">Typically 3-5 business days. The agent must physically visit the business and review all documentation before publishing.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium">How do I contact the agent?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">Once logged in, you'll see the agent's WhatsApp, phone number, and email on each listing. Choose your preferred method and reach out directly.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium">What does 'blind listing' mean?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">The business name and exact address are never shown. Only general details like category, area, and financials are visible to protect the seller's identity.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium">Is there a fee for buyers?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">No! Browsing and contacting agents is completely free for buyers. Agents are paid by sellers upon successful sale completion.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24 bg-primary">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl mb-4">Ready to Start?</h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">Whether you're looking to buy or sell, CompanyFinder provides the secure, agent-driven process you need.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-base">
                <Link href="/listings">
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
