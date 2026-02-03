"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Star, Sparkles, CheckCircle, Coins } from "lucide-react"
import { usePromotionTiers, useAgentCredits, usePromoteListing } from "@/lib/hooks/usePromotions"
import type { PromotionTier, PromotionTierConfig } from "@/lib/api/types"

interface PromoteListingDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    listingId: string
    listingTitle: string
    currentTier: PromotionTier
    onSuccess?: () => void
}

export function PromoteListingDialog({
    open,
    onOpenChange,
    listingId,
    listingTitle,
    currentTier,
    onSuccess,
}: PromoteListingDialogProps) {
    const [selectedTier, setSelectedTier] = useState<"featured" | "premium" | null>(null)

    // Use React Query hooks
    const { data: tierConfigs = [], isLoading: isLoadingTiers } = usePromotionTiers()
    const { data: creditsData, isLoading: isLoadingCredits } = useAgentCredits()
    const promoteListing = usePromoteListing()

    const creditBalance = creditsData?.balance || 0
    const isLoading = isLoadingTiers || isLoadingCredits

    const getFeaturedConfig = () => tierConfigs.find((c: any) => c.tier === "featured")
    const getPremiumConfig = () => tierConfigs.find((c: any) => c.tier === "premium")

    const getEffectiveCost = (tier: "featured" | "premium"): number => {
        const config = tier === "featured" ? getFeaturedConfig() : getPremiumConfig()
        if (!config) return 0

        // If upgrading from featured to premium, only charge the difference
        if (currentTier === "featured" && tier === "premium") {
            const featuredConfig = getFeaturedConfig()
            return (config as any).credit_cost - ((featuredConfig as any)?.credit_cost || 0)
        }

        return (config as any).credit_cost || 0
    }

    const canAfford = (tier: "featured" | "premium") => {
        const cost = getEffectiveCost(tier)
        return creditBalance >= cost
    }

    const handlePromote = async () => {
        if (!selectedTier) return

        const cost = getEffectiveCost(selectedTier)
        if (creditBalance < cost) {
            toast.error("Insufficient credits. Please purchase more credits.")
            return
        }

        try {
            await promoteListing.mutateAsync({ listingId, tier: selectedTier })
            toast.success(`Listing promoted to ${selectedTier}!`)
            onOpenChange(false)
            onSuccess?.()
        } catch (error: any) {
            toast.error(error.message || "Failed to promote listing")
        }
    }

    const getTierIcon = (tier: string) => {
        if (tier === "premium") return <Sparkles className="h-5 w-5" />
        if (tier === "featured") return <Star className="h-5 w-5" />
        return null
    }

    const getTierColor = (tier: string) => {
        if (tier === "premium") return "text-purple-600"
        if (tier === "featured") return "text-blue-600"
        return ""
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Promote Listing</DialogTitle>
                    <DialogDescription>
                        Boost visibility for: {listingTitle}
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Credit Balance Display */}
                        <div className="flex items-center justify-between p-4 rounded-lg bg-amber-50 border border-amber-200">
                            <div className="flex items-center gap-2">
                                <Coins className="h-5 w-5 text-amber-600" />
                                <span className="font-medium">Available Credits:</span>
                            </div>
                            <span className="text-2xl font-bold text-amber-900">{creditBalance}</span>
                        </div>

                        {/* Tier Options */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            {[getFeaturedConfig(), getPremiumConfig()].filter(Boolean).map((config: any) => {
                                const tier = config.tier
                                const cost = getEffectiveCost(tier)
                                const affordable = canAfford(tier)
                                const isCurrent = currentTier === tier
                                const isSelected = selectedTier === tier

                                return (
                                    <button
                                        key={tier}
                                        type="button"
                                        onClick={() => setSelectedTier(tier)}
                                        disabled={isCurrent || !affordable || promoteListing.isPending}
                                        className={`
                                            relative p-6 rounded-lg border-2 text-left transition-all
                                            ${isCurrent ? "border-green-300 bg-green-50 cursor-not-allowed" : ""}
                                            ${isSelected && !isCurrent ? "border-primary bg-primary/5" : ""}
                                            ${!isSelected && !isCurrent && affordable ? "border-border hover:border-primary/50" : ""}
                                            ${!affordable && !isCurrent ? "opacity-50 cursor-not-allowed" : ""}
                                        `}
                                    >
                                        {isCurrent && (
                                            <div className="absolute top-3 right-3">
                                                <Badge className="bg-green-600 hover:bg-green-600">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Current
                                                </Badge>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`h-10 w-10 rounded-full bg-muted flex items-center justify-center ${getTierColor(tier)}`}>
                                                {getTierIcon(tier)}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">{config.display_name}</h3>
                                                <p className="text-sm text-muted-foreground">{config.duration_days} days</p>
                                            </div>
                                        </div>

                                        <p className="text-sm text-muted-foreground mb-4">{config.description}</p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <Coins className="h-4 w-4 text-amber-600" />
                                                <span className="font-bold text-lg">{cost}</span>
                                                <span className="text-sm text-muted-foreground">credits</span>
                                            </div>
                                            {!affordable && !isCurrent && (
                                                <Badge variant="destructive">Insufficient</Badge>
                                            )}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={promoteListing.isPending}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handlePromote}
                                disabled={!selectedTier || promoteListing.isPending}
                            >
                                {promoteListing.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {promoteListing.isPending ? "Promoting..." : "Confirm Promotion"}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
