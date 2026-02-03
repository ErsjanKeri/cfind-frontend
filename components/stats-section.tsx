"use client"

import { useState, useEffect } from "react"
import type { Currency } from "@/lib/currency"

export function StatsSection() {
  const [currency, setCurrency] = useState<Currency>("EUR")

  useEffect(() => {
    const saved = localStorage.getItem("currency") as Currency
    if (saved) setCurrency(saved)
  }, [])

  const totalValue = currency === "EUR" ? "€42M+" : "L4.2B+"

  const stats = [
    { label: "Verified Listings", value: "120+" },
    { label: "Licensed Agents", value: "45" },
    { label: "Successful Deals", value: "280+" },
    { label: "Total Value", value: totalValue },
  ]

  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
