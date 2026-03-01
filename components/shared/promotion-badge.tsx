"use client"

import { Badge } from "@/components/ui/badge"
import { Sparkles, Star } from "lucide-react"
import type { PromotionTier } from "@/lib/api/types"

interface PromotionBadgeProps {
  tier: PromotionTier
  className?: string
  showIcon?: boolean
}

export function PromotionBadge({ tier, className = "", showIcon = true }: PromotionBadgeProps) {
  if (tier === "standard") {
    return null
  }

  if (tier === "featured") {
    return (
      <Badge className={`bg-blue-500 text-white border-blue-600 ${className}`}>
        {showIcon && <Star className="h-3 w-3 mr-1 fill-current" />}
        Featured
      </Badge>
    )
  }

  if (tier === "premium") {
    return (
      <Badge className={`bg-amber-500 text-white border-amber-600 ${className}`}>
        {showIcon && <Sparkles className="h-3 w-3 mr-1" />}
        Premium
      </Badge>
    )
  }

  return null
}
