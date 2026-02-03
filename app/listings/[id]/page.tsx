"use client"

import { use } from "react"
import { ListingDetailClient } from "./listing-detail-client"

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  return <ListingDetailClient listingId={id} />
}
