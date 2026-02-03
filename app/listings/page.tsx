"use client"

import ListingsClientPage from "./listings-client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ListingsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <ListingsClientPage />
      </main>
      <Footer />
    </div>
  )
}
