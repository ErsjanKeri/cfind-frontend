import { ShieldCheck, Clock, XCircle, type LucideIcon } from "lucide-react"
import type { ListingStatus, DemandStatus } from "@/lib/api/types"

type VerificationStatus = "approved" | "pending" | "rejected"

interface BadgeConfig {
  className: string
  label?: string
  icon?: LucideIcon
}

/**
 * Get consistent badge styling for listing statuses
 */
export function getListingStatusBadge(status: ListingStatus): BadgeConfig {
  const configs: Record<ListingStatus, BadgeConfig> = {
    active: {
      className: "bg-green-100 text-green-700 hover:bg-green-100",
      label: "Active",
    },
    draft: {
      className: "bg-gray-100 text-gray-700 hover:bg-gray-100",
      label: "Draft",
    },
    sold: {
      className: "bg-blue-100 text-blue-700 hover:bg-blue-100",
      label: "Sold",
    },
    inactive: {
      className: "bg-muted text-muted-foreground hover:bg-muted",
      label: "Inactive",
    },
  }

  return configs[status] || { className: "bg-muted text-muted-foreground", label: status }
}

/**
 * Get consistent badge styling for verification statuses
 */
export function getVerificationStatusBadge(status: VerificationStatus): BadgeConfig {
  const configs: Record<VerificationStatus, BadgeConfig> = {
    approved: {
      className: "bg-green-100 text-green-700 hover:bg-green-100 gap-1",
      label: "Verified",
      icon: ShieldCheck,
    },
    pending: {
      className: "bg-amber-100 text-amber-700 hover:bg-amber-100 gap-1",
      label: "Pending Verification",
      icon: Clock,
    },
    rejected: {
      className: "bg-red-100 text-red-700 hover:bg-red-100 gap-1",
      label: "Rejected",
      icon: XCircle,
    },
  }

  return configs[status] || { className: "bg-muted text-muted-foreground", label: status }
}

/**
 * Get consistent badge styling for demand statuses.
 * Replaces the inline statusColors maps in demand-card.tsx and buyer-view.tsx.
 */
export function getDemandStatusBadge(status: DemandStatus): BadgeConfig {
  const configs: Record<DemandStatus, BadgeConfig> = {
    active: {
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      label: "Active",
    },
    assigned: {
      className: "bg-blue-50 text-blue-700 border-blue-200",
      label: "Assigned",
    },
    fulfilled: {
      className: "bg-purple-50 text-purple-700 border-purple-200",
      label: "Fulfilled",
    },
    closed: {
      className: "bg-gray-50 text-gray-700 border-gray-200",
      label: "Closed",
    },
  }

  return configs[status] || { className: "bg-muted text-muted-foreground", label: status }
}

/**
 * Get consistent badge styling for demand types
 */
export function getDemandTypeBadge(demandType: "investor" | "seeking_funding"): BadgeConfig {
  const configs: Record<string, BadgeConfig> = {
    seeking_funding: {
      className: "bg-blue-50 text-blue-700 border-blue-200",
      label: "Seeking Funding",
    },
    investor: {
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      label: "Investor",
    },
  }

  return configs[demandType] || { className: "bg-muted text-muted-foreground", label: demandType }
}

/**
 * Get consistent badge styling for email verification
 */
export function getEmailVerificationBadge(isVerified: boolean): BadgeConfig {
  if (isVerified) {
    return {
      className: "text-xs border-green-300 text-green-700",
      label: "Email Verified",
    }
  }
  return {
    className: "text-xs border-amber-300 text-amber-700",
    label: "Email Unverified",
  }
}
