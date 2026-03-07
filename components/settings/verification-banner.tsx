"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { XCircle, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

interface VerificationBannerProps {
  verificationStatus: "pending" | "approved" | "rejected"
  rejectionReason: string | null
  onResubmit: () => void
}

export function VerificationBanner({ verificationStatus, rejectionReason, onResubmit }: VerificationBannerProps) {
  const [resubmitting, setResubmitting] = useState(false)

  if (verificationStatus === "rejected") {
    return (
      <Card className="mb-6 border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-900 flex items-center gap-2">
            <XCircle className="h-5 w-5" />
            Verification Rejected
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>
              <p className="font-semibold mb-2">Your verification was rejected</p>
              <p className="text-sm">{rejectionReason}</p>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <p className="text-sm text-red-900 font-medium">
              To resubmit for verification:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-red-800">
              <li>Review the rejection reason above</li>
              <li>Update your information below as needed</li>
              <li>Ensure all documents are uploaded in the Documents tab</li>
              <li>Save your changes</li>
              <li>Click &quot;Resubmit for Verification&quot;</li>
            </ol>
          </div>

          <Button
            onClick={async () => {
              setResubmitting(true)
              try {
                onResubmit()
                toast.success("Successfully resubmitted for verification!")
              } catch {
                toast.error("Failed to resubmit for verification")
              } finally {
                setResubmitting(false)
              }
            }}
            disabled={resubmitting}
            className="w-full"
          >
            {resubmitting ? "Resubmitting..." : "Resubmit for Verification"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (verificationStatus === "pending") {
    return (
      <Alert className="mb-6 bg-amber-50 border-amber-200">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-900">
          Your account is pending verification by an admin. You cannot create listings until verified.
        </AlertDescription>
      </Alert>
    )
  }

  return null
}
