"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/currency"
import { MapPin, Banknote, Tag, Phone, Mail, MessageSquare, Trash2, CheckCircle, XCircle, User } from "lucide-react"
import type { BuyerDemand } from "@/lib/api/types"
import { getCategoryLabel } from "@/lib/constants"
import { getDemandStatusBadge, getDemandTypeBadge } from "@/lib/badge-utils"
import { formatDate, getWhatsAppUrl } from "@/lib/utils"

interface DemandCardProps {
    demand: BuyerDemand
    variant: "buyer" | "agent" | "agent-claimed"
    onClaim?: () => void
    onMarkFulfilled?: () => void
    onClose?: () => void
    onDelete?: () => void
    isClaimLoading?: boolean
}

export function DemandCard({
    demand,
    variant,
    onClaim,
    onMarkFulfilled,
    onClose,
    onDelete,
    isClaimLoading
}: DemandCardProps) {
    const statusBadge = getDemandStatusBadge(demand.status)
    const typeBadge = getDemandTypeBadge(demand.demand_type)

    return (
        <Card className="hover:border-primary/30 transition-colors">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-primary" />
                            <span className="font-medium">{getCategoryLabel(demand.category)}</span>
                        </div>
                        <Badge className={`w-fit text-xs ${typeBadge.className}`}>
                            {typeBadge.label}
                        </Badge>
                    </div>
                    <Badge className={statusBadge.className}>
                        {statusBadge.label}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Budget */}
                <div className="flex items-center gap-2 text-sm">
                    <Banknote className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                        {formatCurrency(demand.budget_min_eur, "EUR")} - {formatCurrency(demand.budget_max_eur, "EUR")}
                    </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                        {demand.preferred_city_en}
                        {demand.preferred_area && `, ${demand.preferred_area}`}
                    </span>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {demand.description}
                </p>

                {/* Buyer Info (for agent variant - show buyer name) */}
                {variant === "agent" && demand.buyer_name && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{demand.buyer_name}</span>
                        {demand.buyer_company && (
                            <span className="text-xs">({demand.buyer_company})</span>
                        )}
                    </div>
                )}

                {/* Agent Info (for buyer variant when assigned) */}
                {variant === "buyer" && demand.status === "assigned" && demand.assigned_agent_name && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm font-medium text-green-800 mb-2">
                            Assigned Agent
                        </p>
                        <p className="font-medium">{demand.assigned_agent_name}</p>
                        {demand.assigned_agent_email && (
                            <a href={`mailto:${demand.assigned_agent_email}`} className="flex items-center gap-1 text-sm text-blue-600 hover:underline mt-1">
                                <Mail className="h-3 w-3" /> {demand.assigned_agent_email}
                            </a>
                        )}
                        {demand.assigned_agent_phone && (
                            <a href={`tel:${demand.assigned_agent_phone}`} className="flex items-center gap-1 text-sm text-blue-600 hover:underline mt-1">
                                <Phone className="h-3 w-3" /> {demand.assigned_agent_phone}
                            </a>
                        )}
                        {demand.assigned_agent_whatsapp && (
                            <a
                                href={getWhatsAppUrl(demand.assigned_agent_whatsapp)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-sm text-green-600 hover:underline mt-1"
                            >
                                <MessageSquare className="h-3 w-3" /> WhatsApp
                            </a>
                        )}
                    </div>
                )}

                {/* Buyer Info (for agent-claimed variant) */}
                {variant === "agent-claimed" && demand.buyer_name && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-800 mb-2">
                            Buyer Information
                        </p>
                        <p className="font-medium">{demand.buyer_name}</p>
                        {demand.buyer_email && (
                            <a href={`mailto:${demand.buyer_email}`} className="flex items-center gap-1 text-sm text-blue-600 hover:underline mt-1">
                                <Mail className="h-3 w-3" /> {demand.buyer_email}
                            </a>
                        )}
                        {demand.buyer_company && (
                            <p className="text-sm text-muted-foreground mt-1">{demand.buyer_company}</p>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                    {variant === "agent" && demand.status === "active" && (
                        <Button onClick={onClaim} disabled={isClaimLoading} className="w-full">
                            {isClaimLoading ? "Claiming..." : "Claim This Demand"}
                        </Button>
                    )}

                    {variant === "buyer" && demand.status === "assigned" && (
                        <Button onClick={onMarkFulfilled} variant="outline" className="flex-1">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Fulfilled
                        </Button>
                    )}

                    {variant === "buyer" && demand.status === "active" && (
                        <>
                            <Button onClick={onClose} variant="outline" className="flex-1">
                                <XCircle className="h-4 w-4 mr-2" />
                                Close Demand
                            </Button>
                            <Button onClick={onDelete} variant="destructive" size="icon" aria-label="Delete demand">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                </div>

                {/* Date */}
                <p className="text-xs text-muted-foreground">
                    {formatDate(demand.created_at)}
                </p>
            </CardContent>
        </Card>
    )
}
