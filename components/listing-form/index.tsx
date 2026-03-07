"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImageUpload } from "@/components/shared/image-upload"
import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react"

import { useListingForm } from "./use-listing-form"
import { Step0AgentSelect } from "./steps/step-0-agent-select"
import { Step1PrivateInfo } from "./steps/step-1-private-info"
import { Step2PublicInfo } from "./steps/step-2-public-info"
import { Step3Financials } from "./steps/step-3-financials"
import { Step4Review } from "./steps/step-4-review"
import { useRole } from "@/lib/hooks/useRole"
import { useAllUsers } from "@/lib/hooks/useAdmin"
import { useUser } from "@/lib/hooks/useAuth"
import type { Listing } from "@/lib/api/types"

interface ListingFormProps {
  listing?: Listing
  mode: "create" | "edit"
  onSuccess?: () => void
}

export function ListingForm({ listing, mode, onSuccess }: ListingFormProps) {
  const { isAdmin } = useRole()
  const { user } = useUser()

  // Agent's operating country (locked for agents, flexible for admins)
  const agentCountry = !isAdmin ? user?.agent_profile?.operating_country : undefined

  // Admin needs verified agents for the agent selection step
  const { data: allUsers } = useAllUsers()
  const verifiedAgents = isAdmin
    ? (allUsers?.filter(u => u.role === "agent" && u.verification_status === "approved") || [])
        .map(a => ({ id: a.id, name: a.name }))
    : []

  const {
    step,
    isSubmitting,
    error,
    fieldErrors,
    formData,
    imageFiles,
    setImageFiles,
    updateData,
    calculateROI,
    handleNext,
    handleBack,
    handleSubmit,
  } = useListingForm({ listing, mode, isAdmin, agentCountry, onSuccess })

  const isDialog = !!onSuccess

  return (
    <div className={isDialog ? "" : "max-w-3xl mx-auto"}>
      {!isDialog && (
        <Link
          href="/profile"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Listings
        </Link>
      )}

      <div className="mb-8">
        {!isDialog && (
          <h1 className="text-2xl font-bold text-foreground">
            {mode === "create" ? "Create New Listing" : "Edit Listing"}
          </h1>
        )}
        <p className="text-muted-foreground mt-1 mb-4">Step {step} of 4</p>
        <div className="flex items-center gap-2">
          {[0, 1, 2, 3, 4].map((s) => {
            if (s === 0 && !isAdmin) return null
            return (
              <div key={s} className={`flex-1 h-2 rounded-full ${s <= step ? "bg-primary" : "bg-muted"}`} />
            )
          })}
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {step === 0 && isAdmin && (
        <Step0AgentSelect
          agentId={formData.agent_id}
          agents={verifiedAgents}
          fieldError={fieldErrors.agent_id}
          onAgentChange={(val) => updateData("agent_id", val)}
          onNext={handleNext}
        />
      )}

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Private Business Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Step1PrivateInfo data={formData} updateData={updateData} errors={fieldErrors} showCountry={isAdmin} />
            <div className="flex justify-between mt-6">
              {isAdmin ? (
                <Button variant="outline" onClick={handleBack}>Back</Button>
              ) : (
                <div />
              )}
              <Button onClick={handleNext}>Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Public Listing Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <div className="font-medium">Images</div>
                <ImageUpload
                  value={formData.images}
                  onChange={(imgs) => updateData("images", imgs)}
                  files={imageFiles}
                  onFilesChange={setImageFiles}
                  maxImages={10}
                  crop={true}
                  aspect={4 / 3}
                  manual={true}
                />
                {fieldErrors.images && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.images}
                  </p>
                )}
              </div>
            </div>
            <Step2PublicInfo data={formData} updateData={updateData} errors={fieldErrors} />
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext}>Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Financial Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Step3Financials data={formData} updateData={updateData} errors={fieldErrors} />
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext}>Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Review & Submit</CardTitle>
          </CardHeader>
          <CardContent>
            <Step4Review
              data={formData}
              updateData={updateData}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              displayROI={calculateROI()}
            />
            <div className="flex justify-start mt-6">
              <Button variant="outline" onClick={handleBack}>Back</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
