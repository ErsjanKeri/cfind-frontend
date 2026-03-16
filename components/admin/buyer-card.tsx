"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AvatarWithInitials } from "@/components/shared/avatar-with-initials"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, CheckCircle, Eye, Trash2 } from "lucide-react"
import type { UserWithProfile } from "@/lib/api/types"
import { getEmailVerificationBadge } from "@/lib/badge-utils"

interface AdminBuyerCardProps {
  buyer: UserWithProfile
  onToggleEmail: (buyer: UserWithProfile) => void
  onDelete: (buyer: UserWithProfile) => void
}

export function AdminBuyerCard({ buyer, onToggleEmail, onDelete }: AdminBuyerCardProps) {
  const eBadge = getEmailVerificationBadge(buyer.email_verified)

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <AvatarWithInitials
            name={buyer.name}
            src={buyer.image}
            className="h-12 w-12"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{buyer.name}</h3>
              <Badge variant="outline" className={eBadge.className}>
                {eBadge.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{buyer.email}</p>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              {buyer.company_name && <span>{buyer.company_name}</span>}
              {buyer.phone_number && <span>{buyer.phone_number}</span>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Buyer actions">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onToggleEmail(buyer)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {buyer.email_verified ? "Mark Email Unverified" : "Mark Email Verified"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => onDelete(buyer)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Buyer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
