"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { XCircle, AlertCircle } from "lucide-react"
import type { AgentProfile } from "@/lib/api/types"

interface AgentAlertsProps {
  agentProfile: AgentProfile | undefined
}

export function AgentAlerts({ agentProfile }: AgentAlertsProps) {
  const router = useRouter()

  if (!agentProfile) return null

  return (
    <>
      {/* Rejection Banner */}
      {agentProfile.verification_status === "rejected" && (
        <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-300">
          <XCircle className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">Your verification application was rejected</AlertTitle>
          <AlertDescription>
            <div className="space-y-3 mt-2">
              <div className="bg-red-100 border border-red-200 rounded-md p-3">
                <p className="text-sm font-medium mb-1">Rejection Reason:</p>
                <p className="text-sm">{agentProfile.rejection_reason}</p>
              </div>
              <p className="text-sm">
                Please address the issues mentioned above and update your profile in Settings, then contact support for re-verification.
              </p>
              <div className="flex gap-2">
                <Button variant="default" size="sm" onClick={() => router.push('/settings')}>
                  Go to Settings
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Missing Documents Alert */}
      {(!agentProfile.license_document_url || !agentProfile.company_document_url || !agentProfile.id_document_url) && agentProfile.verification_status !== "approved" && agentProfile.verification_status !== "rejected" && (
        <Alert className="bg-blue-50 text-blue-900 border-blue-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Complete Your Profile</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>
              Please upload your required documents to complete your profile:
              {!agentProfile.license_document_url && " License document,"}
              {!agentProfile.company_document_url && " Company/Agency document,"}
              {!agentProfile.id_document_url && " ID/Passport document"}
            </span>
            <Button
              variant="default"
              size="sm"
              onClick={() => router.push('/settings')}
              className="ml-4 flex-shrink-0"
            >
              Upload Documents
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Verification Pending Warning */}
      {agentProfile.verification_status === "pending" && agentProfile.license_document_url && agentProfile.company_document_url && agentProfile.id_document_url && (
        <Alert variant="destructive" className="bg-amber-50 text-amber-900 border-amber-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Account Pending Verification</AlertTitle>
          <AlertDescription>
            Your account is currently being reviewed by our team. You cannot create new listings until your account is verified.
          </AlertDescription>
        </Alert>
      )}
    </>
  )
}
