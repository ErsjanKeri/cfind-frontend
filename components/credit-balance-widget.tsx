"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coins, Sparkles, Plus, Loader2 } from "lucide-react"
import { useAgentCredits, useActivePromotions } from "@/lib/hooks/usePromotions"
import Link from "next/link"

interface CreditBalanceWidgetProps {
    variant?: "compact" | "full"
}

export function CreditBalanceWidget({ variant = "full" }: CreditBalanceWidgetProps) {
    // Use React Query hooks
    const { data: creditsData, isLoading: isLoadingCredits } = useAgentCredits()
    const { data: promotionsData, isLoading: isLoadingPromotions } = useActivePromotions()

    const creditBalance = creditsData?.balance || 0
    const activePromotions = promotionsData?.length || 0
    const isLoading = isLoadingCredits || isLoadingPromotions

    if (variant === "compact") {
        return (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/60">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Coins className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Credits</p>
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <p className="text-lg font-bold">{creditBalance}</p>
                    )}
                </div>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/credits">
                        <Plus className="h-4 w-4 mr-1" />
                        Buy
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Coins className="h-5 w-5 text-amber-500" />
                    Promotion Credits
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                            <div>
                                <p className="text-sm text-amber-700">Available Credits</p>
                                <p className="text-3xl font-bold text-amber-900">{creditBalance}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                                <Coins className="h-6 w-6 text-amber-600" />
                            </div>
                        </div>

                        {activePromotions > 0 && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Sparkles className="h-4 w-4 text-blue-500" />
                                <span>{activePromotions} active promotion{activePromotions !== 1 ? "s" : ""}</span>
                            </div>
                        )}

                        <Button className="w-full" asChild>
                            <Link href="/credits">
                                <Plus className="h-4 w-4 mr-2" />
                                Buy Credits
                            </Link>
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
