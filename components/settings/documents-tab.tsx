"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  Building2,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "sonner"

interface DocumentsTabProps {
  licenseDocumentUrl: string
  companyDocumentUrl: string
  idDocumentUrl: string
  verificationStatus: "pending" | "approved" | "rejected"
}

export function DocumentsTab({
  licenseDocumentUrl,
  companyDocumentUrl,
  idDocumentUrl,
  verificationStatus,
}: DocumentsTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Verification Documents</CardTitle>
            <CardDescription>View and manage your uploaded verification documents</CardDescription>
          </div>
          {verificationStatus === "approved" && (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {(!licenseDocumentUrl || !companyDocumentUrl || !idDocumentUrl) && (
          <Alert className="border-amber-300 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Please upload all 3 required documents (License, Company, and ID/Passport) to complete your verification process.
            </AlertDescription>
          </Alert>
        )}

        <DocumentDisplayCard
          title="License Document"
          label="Professional License"
          description="Your professional licensing document has been uploaded."
          missingMessage="No license document uploaded. Please upload your document in the Profile tab."
          url={licenseDocumentUrl}
          icon="file"
          downloadName="license-document"
        />

        <Separator />

        <DocumentDisplayCard
          title="Company Document"
          label="Company Registration"
          description="Your company registration document has been uploaded."
          missingMessage="No company document uploaded. Please upload your document in the Profile tab."
          url={companyDocumentUrl}
          icon="building"
          downloadName="company-document"
        />

        <Separator />

        <DocumentDisplayCard
          title={<>Government ID / Passport <span className="text-red-500">*</span></>}
          label="Government ID / Passport"
          description="Your ID document has been uploaded. This is only visible to admins for security."
          missingMessage={<>No ID document uploaded. Please upload your government-issued ID or passport in the Profile tab. <strong>Required for verification.</strong></>}
          url={idDocumentUrl}
          icon="file"
          downloadName="id-document"
        />

        <Alert className="border-blue-200 bg-blue-50/50">
          <FileText className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Need to update documents?</strong> Go to the Profile tab to upload new documents.
            Uploading new documents will require re-verification by an admin.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

function DocumentDisplayCard({
  title,
  label,
  description,
  missingMessage,
  url,
  icon,
  downloadName,
}: {
  title: React.ReactNode
  label: string
  description: string
  missingMessage: React.ReactNode
  url: string
  icon: "file" | "building"
  downloadName: string
}) {
  const Icon = icon === "building" ? Building2 : FileText
  const [isLoading, setIsLoading] = useState(false)

  const handleViewDocument = async () => {
    setIsLoading(true)
    try {
      const signedUrl = await api.upload.getDocumentViewUrl(url)
      window.open(signedUrl, '_blank')
    } catch {
      toast.error("Failed to load document")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {url && (
          <Badge variant="outline" className="text-green-600 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Uploaded
          </Badge>
        )}
      </div>

      {url ? (
        <Card className="border-green-200 bg-green-50/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <Icon className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground mb-1">{label}</p>
                <p className="text-sm text-muted-foreground mb-3">{description}</p>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleViewDocument}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Icon className="h-4 w-4 mr-2" />
                  )}
                  View Document
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{missingMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
