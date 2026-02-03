/**
 * Utility functions for consistent badge styling across the application
 */

export type ListingStatus = "active" | "draft" | "sold" | "inactive" | "rejected"
export type VerificationStatus = "approved" | "pending" | "rejected"

interface BadgeConfig {
  className: string
  label?: string
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
    rejected: {
      className: "bg-red-100 text-red-700 hover:bg-red-100",
      label: "Rejected",
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
    },
    pending: {
      className: "bg-amber-100 text-amber-700 hover:bg-amber-100 gap-1",
      label: "Pending Verification",
    },
    rejected: {
      className: "bg-red-100 text-red-700 hover:bg-red-100 gap-1",
      label: "Rejected",
    },
  }

  return configs[status] || { className: "bg-muted text-muted-foreground", label: status }
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
