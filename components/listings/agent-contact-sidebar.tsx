"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Shield,
  Lock,
  CheckCircle,
  Phone,
  Mail,
  Loader2,
} from "lucide-react"
import { formatCurrency } from "@/lib/currency"
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon"
import { getInitials } from "@/lib/utils"

interface AgentContactSidebarProps {
  askingPriceEur: number
  roi: number | null
  agentName: string | null
  agentPhone: string | null
  agentWhatsapp: string | null
  agentEmail: string | null
  isAuthenticated: boolean
  isContactingAgent: boolean
  onContactClick: (method: "whatsapp" | "phone" | "email") => void
}

export function AgentContactSidebar({
  askingPriceEur,
  roi,
  agentName,
  agentPhone,
  agentWhatsapp,
  agentEmail,
  isAuthenticated,
  isContactingAgent,
  onContactClick,
}: AgentContactSidebarProps) {
  const price = askingPriceEur

  return (
    <div className="space-y-6">
      <Card className="sticky top-24">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">Asking Price</p>
            <p className="text-4xl font-bold text-foreground mt-1">{formatCurrency(price, "EUR")}</p>
            {roi && (
              <p className="text-sm text-accent mt-1">
                {roi}% ROI
              </p>
            )}
          </div>

          <div className="space-y-3">
            <button
              className="w-full h-12 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 flex items-center justify-center gap-2.5 text-[#25D366] font-medium transition-colors disabled:opacity-50"
              onClick={() => onContactClick("whatsapp")}
              disabled={isContactingAgent}
            >
              {isContactingAgent ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <WhatsAppIcon className="h-5 w-5" />
              )}
              {isContactingAgent ? "Recording contact..." : "Contact via WhatsApp"}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                className="h-10 rounded-lg bg-primary/10 hover:bg-primary/15 flex items-center justify-center gap-2 text-sm text-primary font-medium transition-colors disabled:opacity-50"
                onClick={() => onContactClick("phone")}
                disabled={isContactingAgent}
              >
                {isContactingAgent ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Phone className="h-4 w-4" />
                )}
                Call
              </button>
              <button
                className="h-10 rounded-lg bg-primary/10 hover:bg-primary/15 flex items-center justify-center gap-2 text-sm text-primary font-medium transition-colors disabled:opacity-50"
                onClick={() => onContactClick("email")}
                disabled={isContactingAgent}
              >
                {isContactingAgent ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                Email
              </button>
            </div>
          </div>

          <Separator className="my-6" />

          {agentName && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-3">Listed By</p>
              <div className="flex items-center gap-3 p-2">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(agentName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{agentName}</p>
                  <Badge className="bg-verified/10 text-verified text-xs px-1.5 mt-1">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Verified Agent
                  </Badge>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    {agentPhone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{agentPhone}</span>
                      </div>
                    )}
                    {agentWhatsapp && (
                      <div className="flex items-center gap-2 text-sm">
                        <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                        <span className="text-foreground">{agentWhatsapp}</span>
                      </div>
                    )}
                    {agentEmail && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground truncate">{agentEmail}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-3 rounded-lg bg-muted/50 border border-dashed border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Lock className="h-4 w-4" />
                      <span>Sign in to see contact info</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground text-sm">Protected Listing</p>
              <p className="text-xs text-muted-foreground mt-1">Create an account to view agent contact information and connect directly</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
