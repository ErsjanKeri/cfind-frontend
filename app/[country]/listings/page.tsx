"use client"

import { use } from "react"
import ListingsClientPage from "./listings-client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { CountryCode } from "@/lib/constants"

export default function ListingsPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = use(params)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <ListingsClientPage country={country as CountryCode} />
      </main>
      <Footer />
    </div>
  )
}
