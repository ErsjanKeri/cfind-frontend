"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Lock } from "lucide-react"
import { formatCurrency } from "@/lib/currency"

interface FinancialOverviewCardProps {
  askingPriceEur: number
  monthlyRevenueEur: number | null
  roi: number | null
}

export function FinancialOverviewCard({
  askingPriceEur,
  monthlyRevenueEur,
  roi,
}: FinancialOverviewCardProps) {
  const price = askingPriceEur
  const revenue = monthlyRevenueEur || 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
          Financial Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Asking Price</p>
            <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(price, "EUR")}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Monthly Revenue</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {formatCurrency(revenue, "EUR")}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">ROI</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {roi ? (
                `${roi}%`
              ) : (
                <span className="flex items-center gap-1 text-base font-normal text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  Hidden
                </span>
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
