import { CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

/**
 * Billing & Subscription tab in Settings.
 * Currently a placeholder — will connect to Stripe/PayPal when payment integration is added.
 */
export function BillingTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing & Subscription</CardTitle>
        <CardDescription>Manage your subscription and payment methods</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
            <CreditCard className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">Free Plan</h3>
          <p className="text-sm text-muted-foreground mb-4">
            You are currently on the free plan
          </p>
          <Button>Upgrade to Pro</Button>
        </div>
      </CardContent>
    </Card>
  )
}
