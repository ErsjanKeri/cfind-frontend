"use client"

import { use } from "react"
import type { CountryCode } from "@/lib/constants"
import { AIRecommendationsClient } from "./ai-recommendations-client"

export default function AIRecommendationsPage({
  params,
}: {
  params: Promise<{ country: string }>
}) {
  const { country } = use(params)
  return <AIRecommendationsClient country={country as CountryCode} />
}
