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
import {
  Building2,
  FileText,
  MoreVertical,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
} from "lucide-react"
import type { UserWithProfile } from "@/lib/api/types"
import { getVerificationStatusBadge, getEmailVerificationBadge } from "@/lib/badge-utils"

interface AdminAgentCardProps {
  agent: UserWithProfile
  onView: (agent: UserWithProfile) => void
  onVerify: (agent: UserWithProfile) => void
  onReject: (agent: UserWithProfile) => void
  onDelete: (agent: UserWithProfile) => void
  onToggleEmail: (agent: UserWithProfile) => void
}

export function AdminAgentCard({
  agent,
  onView,
  onVerify,
  onReject,
  onDelete,
  onToggleEmail,
}: AdminAgentCardProps) {
  const status = agent.verification_status || "pending"
  const vBadge = getVerificationStatusBadge(status)
  const eBadge = getEmailVerificationBadge(agent.email_verified)
  const VIcon = vBadge.icon

  return (
    <Card className={
      status === "rejected"
        ? "border-red-300 bg-red-50/30"
        : status === "pending"
          ? "border-amber-300 bg-amber-50/30"
          : ""
    }>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <AvatarWithInitials
            name={agent.name}
            src={agent.image}
            className="h-12 w-12"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{agent.name}</h3>
              <Badge className={vBadge.className}>
                {VIcon && <VIcon className="h-3 w-3" />}
                {vBadge.label}
              </Badge>
              <Badge variant="outline" className={eBadge.className}>
                {eBadge.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{agent.email}</p>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span>{agent.company_name}</span>
              <span>License: {agent.agent_profile?.license_number || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {agent.agent_profile?.license_document_url ? (
                <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                  <FileText className="h-3 w-3 mr-1" />
                  License
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                  <XCircle className="h-3 w-3 mr-1" />
                  No License
                </Badge>
              )}
              {agent.agent_profile?.company_document_url ? (
                <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                  <Building2 className="h-3 w-3 mr-1" />
                  Company
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                  <XCircle className="h-3 w-3 mr-1" />
                  No Company
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {status === "pending" && (
              <>
                <Button size="sm" onClick={() => onVerify(agent)}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Verify
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onReject(agent)}>
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </>
            )}
            {status === "rejected" && (
              <Button size="sm" onClick={() => onVerify(agent)}>
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(agent)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onToggleEmail(agent)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {agent.email_verified ? "Mark Email Unverified" : "Mark Email Verified"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => onDelete(agent)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Agent
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
