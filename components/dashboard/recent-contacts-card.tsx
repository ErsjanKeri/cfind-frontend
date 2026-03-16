"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"
import { MessageSquare, Phone, Mail } from "lucide-react"
import type { AgentLead } from "@/lib/api/types"
import { formatDate } from "@/lib/utils"

function getContactIcon(method: string | undefined) {
  if (!method) return <MessageSquare className="h-4 w-4" />
  const norm = method.toLowerCase()
  if (norm.includes("whatsapp")) return <MessageSquare className="h-4 w-4 text-green-600" />
  if (norm.includes("phone")) return <Phone className="h-4 w-4 text-blue-600" />
  if (norm.includes("email")) return <Mail className="h-4 w-4 text-amber-600" />
  return <MessageSquare className="h-4 w-4" />
}

interface RecentContactsCardProps {
  leads: AgentLead[]
}

export function RecentContactsCard({ leads }: RecentContactsCardProps) {
  return (
    <Card className="col-span-1 border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle>Recent Contacts</CardTitle>
        <CardDescription>View and manage recent buyer inquiries</CardDescription>
      </CardHeader>
      <CardContent>
        {leads.length > 0 ? (
          <div className="space-y-4">
            {leads.slice(0, 5).map((lead) => (
              <div
                key={lead.id}
                className="flex items-center gap-4 p-3 rounded-lg border border-border/60 hover:bg-muted/30 transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  {getContactIcon(lead.interaction_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {lead.buyer_name}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {lead.listing_title}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="capitalize font-normal">
                    {lead.interaction_type?.replace('_', ' ')}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(lead.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={MessageSquare}
            title="No contact history yet"
            description=""
            size="sm"
          />
        )}
      </CardContent>
    </Card>
  )
}
