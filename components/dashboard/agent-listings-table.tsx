"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/currency"
import { PromotionBadge } from "@/components/shared/promotion-badge"
import { getListingStatusBadge } from "@/lib/badge-utils"
import { Edit, Sparkles } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Listing } from "@/lib/api/types"
import type { Currency } from "@/lib/currency"

interface AgentListingsTableProps {
  listings: Listing[]
  onEdit: (listing: Listing) => void
  onPromote: (listing: Listing) => void
}

export function AgentListingsTable({ listings, onEdit, onPromote }: AgentListingsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[280px] pl-0">Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Promotion</TableHead>
          <TableHead>Views</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="text-right pr-0">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {listings.map((listing) => (
          <TableRow key={listing.id} className="cursor-pointer hover:bg-muted/30 border-b border-border/50">
            <TableCell className="font-medium text-base pl-0">
              {listing.public_title_en}
            </TableCell>
            <TableCell>
              {(() => {
                const badge = getListingStatusBadge(listing.status)
                return (
                  <Badge className={`font-normal ${badge.className}`}>
                    {badge.label ?? listing.status}
                  </Badge>
                )
              })()}
            </TableCell>
            <TableCell>
              {listing.promotion_tier !== "standard" ? (
                <PromotionBadge tier={listing.promotion_tier} />
              ) : (
                <span className="text-sm text-muted-foreground">Standard</span>
              )}
            </TableCell>
            <TableCell className="text-muted-foreground">{listing.view_count}</TableCell>
            <TableCell className="font-medium">
              {formatCurrency(listing.asking_price_eur, "EUR")}
            </TableCell>
            <TableCell className="text-right pr-0">
              <div className="flex items-center justify-end gap-1">
                {listing.status === "active" && listing.promotion_tier !== "premium" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Promote listing"
                    className="hover:bg-amber-50"
                    onClick={(e) => {
                      e.stopPropagation()
                      onPromote(listing)
                    }}
                  >
                    <Sparkles className="h-4 w-4 text-amber-500" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Edit listing"
                  className="hover:bg-muted"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(listing)
                  }}
                >
                  <Edit className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
