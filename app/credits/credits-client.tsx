"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Coins,
    Sparkles,
    Crown,
    CheckCircle,
    Loader2,
    ShieldAlert,
    ArrowRight,
    History,
    Plus,
    Minus,
} from "lucide-react"
import { formatCurrency } from "@/lib/currency"
import { getErrorMessage } from "@/lib/utils"
import { usePurchaseCredits, useCreditPackages, useAgentCredits } from "@/lib/hooks/usePromotions"
import type { CreditPackage, CreditTransaction } from "@/lib/api/types"

interface CreditsPageClientProps {
    packages: CreditPackage[]
    initialBalance: number
    transactions: CreditTransaction[]
    isVerified: boolean
}

export function CreditsPageClient({
    packages,
    initialBalance,
    transactions,
    isVerified,
}: CreditsPageClientProps) {
    const [balance, setBalance] = useState(initialBalance)
    const purchaseCredits = usePurchaseCredits()

    const handlePurchase = async (pkg: CreditPackage) => {
        if (!isVerified) {
            toast.error("Only verified agents can purchase credits")
            return
        }

        try {
            const result = await purchaseCredits.mutateAsync({
                package_id: pkg.id,
            })
            toast.success(`Successfully purchased ${pkg.credits} credits!`)
            if (result.new_balance !== undefined) {
                setBalance(result.new_balance)
            }
        } catch (error: unknown) {
            toast.error(getErrorMessage(error))
        } finally {
            // Mutation completes automatically
        }
    }

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case "purchase":
                return <Plus className="h-4 w-4 text-green-500" />
            case "usage":
                return <Minus className="h-4 w-4 text-red-500" />
            case "refund":
                return <Plus className="h-4 w-4 text-blue-500" />
            case "bonus":
                return <Sparkles className="h-4 w-4 text-amber-500" />
            default:
                return <History className="h-4 w-4 text-gray-500" />
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200/50">
                        <Coins className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold">Promotion Credits</h1>
                </div>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    Purchase credits to promote your listings and get more visibility. Premium listings appear first in search results and on the homepage.
                </p>
            </div>

            {/* Verification Warning */}
            {!isVerified && (
                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="flex items-center gap-4 py-4">
                        <ShieldAlert className="h-8 w-8 text-amber-600 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-amber-900">Verification Required</h3>
                            <p className="text-sm text-amber-700">
                                You need to be a verified agent to purchase and use promotion credits.
                                Please complete your verification first.
                            </p>
                        </div>
                        <Button variant="outline" className="ml-auto border-amber-300 hover:bg-amber-100" asChild>
                            <a href="/profile">
                                Complete Verification
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Current Balance */}
            <Card className="border-2 border-amber-200 shadow-lg">
                <CardContent className="py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                                <Coins className="h-8 w-8 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Your Credit Balance</p>
                                <p className="text-4xl font-bold text-amber-900">{balance}</p>
                                <p className="text-sm text-amber-600">credits available</p>
                            </div>
                        </div>
                        <div className="text-center sm:text-right">
                            <p className="text-sm text-muted-foreground">What you can do</p>
                            <p className="text-sm">
                                <span className="font-semibold text-blue-600">5 credits</span> = Featured (30 days)
                            </p>
                            <p className="text-sm">
                                <span className="font-semibold text-amber-600">15 credits</span> = Premium (30 days)
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Credit Packages */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Crown className="h-5 w-5 text-amber-500" />
                    Credit Packages
                </h2>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {packages.map((pkg) => (
                        <Card
                            key={pkg.id}
                            className={`relative overflow-hidden transition-all hover:shadow-lg ${
                                pkg.is_popular
                                    ? "border-2 border-amber-400 shadow-md shadow-amber-200/30"
                                    : "border-border"
                            }`}
                        >
                            {pkg.is_popular && (
                                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 py-1 px-2 text-center">
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <CardHeader className={pkg.is_popular ? "pt-10" : ""}>
                                <CardTitle className="flex items-center justify-between">
                                    <span>{pkg.name}</span>
                                    {pkg.savings && (
                                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                                            {pkg.savings}
                                        </Badge>
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    <span className="text-3xl font-bold text-foreground">{pkg.credits}</span>
                                    <span className="text-muted-foreground ml-1">credits</span>
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-2xl font-bold">{formatCurrency(pkg.price_eur, "EUR")}</p>
                                </div>

                                <div className="text-xs text-muted-foreground space-y-1">
                                    <p className="flex items-center gap-1">
                                        <CheckCircle className="h-3 w-3 text-green-500" />
                                        {Math.floor(pkg.credits / 5)} Featured promotions
                                    </p>
                                    <p className="flex items-center gap-1">
                                        <CheckCircle className="h-3 w-3 text-green-500" />
                                        {Math.floor(pkg.credits / 15)} Premium promotions
                                    </p>
                                </div>

                                <Button
                                    className={`w-full ${
                                        pkg.is_popular
                                            ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                                            : ""
                                    }`}
                                    onClick={() => handlePurchase(pkg)}
                                    disabled={!isVerified || purchaseCredits.isPending}
                                >
                                    {purchaseCredits.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Buy Now"
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <p className="text-xs text-center text-muted-foreground">
                    * This is a demo environment. In production, this would connect to a payment gateway.
                </p>
            </div>

            {/* Transaction History */}
            {transactions.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <History className="h-5 w-5 text-muted-foreground" />
                        Transaction History
                    </h2>

                    <Card>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border">
                                {transactions.slice(0, 10).map((tx) => (
                                    <div
                                        key={tx.id}
                                        className="flex items-center justify-between p-4 hover:bg-muted/50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                                {getTransactionIcon(tx.type)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{tx.description}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(tx.created_at).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            className={`font-semibold ${
                                                tx.amount > 0 ? "text-green-600" : "text-red-600"
                                            }`}
                                        >
                                            {tx.amount > 0 ? "+" : ""}
                                            {tx.amount} credits
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {transactions.length > 10 && (
                        <p className="text-sm text-center text-muted-foreground">
                            Showing 10 of {transactions.length} transactions
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}
