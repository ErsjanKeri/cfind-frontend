"use client"

import { use } from "react"
import { ListingDetailClient } from "./listing-detail-client"
import type { CountryCode } from "@/lib/constants"

export default function ListingDetailPage({ params }: { params: Promise<{ country: string; id: string }> }) {
  const { country, id } = use(params)

  return <ListingDetailClient listingId={id} country={country as CountryCode} />
}
