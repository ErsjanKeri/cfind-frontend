"use client"

import { use } from "react"
import type { CountryCode } from "@/lib/constants"
import { AIRecommendationsClient } from "../ai-recommendations/ai-recommendations-client"

export default function AIMatchingPage({
  params,
}: {
  params: Promise<{ country: string }>
}) {
  const { country } = use(params)
  return <AIRecommendationsClient country={country as CountryCode} mode="agent" />
}
