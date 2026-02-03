"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useCreateListing, useUpdateListing } from "@/lib/hooks/useListings"
import { useFileUpload } from "@/lib/hooks/useFileUpload"
// Old S3 imports removed in Phase 2:
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, ArrowRight, Lock, Globe, DollarSign, Users, CheckCircle, AlertCircle } from "lucide-react"

import { Step1PrivateInfo } from "./listing-form/steps/step-1-private-info"
import { Step2PublicInfo } from "./listing-form/steps/step-2-public-info"
import { Step3Financials } from "./listing-form/steps/step-3-financials"
import { Step4Review } from "./listing-form/steps/step-4-review"
import type { Listing } from "@/lib/api/types"

interface ListingFormProps {
  listing?: Listing
  mode: "create" | "edit"
  agents?: { id: string; name: string | null }[] // For admin use
  onSuccess?: () => void
}

export function ListingForm({ listing, mode, agents, onSuccess }: ListingFormProps) {
  const router = useRouter()
  const { uploadMultiple } = useFileUpload()
  const createListing = useCreateListing()
  const updateListing = useUpdateListing()

  // Steps handling
  // If agents provided (Admin), start at Step 0. Else Step 1.
  const [step, setStep] = useState(agents && agents.length > 0 ? 0 : 1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Check if we are in admin mode (if agents array is passed)
  const isAdmin = !!(agents && agents.length > 0)

  // Unified Form State
  const [formData, setFormData] = useState({
    // Step 0 - Admin
    agentId: listing?.agent_id || "",

    // Step 1 - Private
    realBusinessName: listing?.real_business_name || "",
    realStreet: listing?.real_location_address || "",
    realCity: listing?.public_location_city_en || "",
    realDescriptionEn: listing?.real_description_en || "",
    category: listing?.category?.toLowerCase() || "",

    // Step 2 - Public
    publicTitleEn: listing?.public_title_en || "",
    publicDescriptionEn: listing?.public_description_en || "",
    publicArea: listing?.public_location_area || "",
    publicCity: listing?.public_location_city_en || "",
    images: listing?.images?.map(img => img.url) || [] as string[],

    // Step 3 - Financials (Dual Currency)
    askingPriceEur: listing?.asking_price_eur || "",
    askingPriceLek: listing?.asking_price_lek || "",
    monthlyRevenueEur: listing?.monthly_revenue_eur || "",
    monthlyRevenueLek: listing?.monthly_revenue_lek || "",
    employeeCount: listing?.employee_count || "",
    yearsInOperation: listing?.years_in_operation || "",
    isPhysicallyVerified: mode === "edit",
  })

  // Separate state for file handling
  const [imageFiles, setImageFiles] = useState<File[]>([])

  const updateData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // --- Helpers ---

  // Upload images using new backend API (Phase 2)
  const uploadImagesServerSide = async (files: File[]) => {
    const urls = await uploadMultiple(files, 'listing')
    if (urls.length === 0) {
      throw new Error("Upload failed")
    }
    return urls
  }

  const calculateROI = () => {
    const price = Number(formData.askingPriceEur) || 0
    const revenue = Number(formData.monthlyRevenueEur) || 0
    if (price > 0 && revenue > 0) {
      return ((revenue * 12) / price * 100).toFixed(1)
    }
    return "N/A"
  }

  const handleNext = () => {
    setError("")
    setFieldErrors({})
    const errors: Record<string, string> = {}

    // Validation per step
    if (step === 0 && isAdmin) {
      if (!formData.agentId) {
        errors.agentId = "Please select an agent"
      }
    }

    if (step === 1) {
      if (!formData.realBusinessName) {
        errors.realBusinessName = "Business name is required"
      }
      if (!formData.category) {
        errors.category = "Category is required"
      }
      if (!formData.realStreet) {
        errors.realStreet = "Street address is required"
      }
      if (!formData.realCity) {
        errors.realCity = "City is required"
      }
    }

    if (step === 2) {
      if (!formData.publicTitleEn) {
        errors.publicTitleEn = "Title is required"
      }
      if (!formData.publicDescriptionEn) {
        errors.publicDescriptionEn = "Description is required"
      }
      if (!formData.publicArea) {
        errors.publicArea = "Public area is required"
      }
      if (!formData.publicCity) {
        errors.publicCity = "Public city is required"
      }
      if (!formData.category) {
        errors.category = "Category is required"
      }
      if (formData.images.length === 0 && imageFiles.length === 0) {
        errors.images = "Please upload at least one image"
      }
    }

    if (step === 3) {
      if (!formData.askingPriceEur) {
        errors.askingPriceEur = "Asking price (EUR) is required"
      }
      if (!formData.askingPriceLek) {
        errors.askingPriceLek = "Asking price (LEK) is required"
      }
      // Monthly revenue is optional - no validation needed
    }

    // If there are errors, set them and don't proceed
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setError("Please fix the errors above before continuing")
      return
    }

    setStep(prev => prev + 1)
  }

  const handleBack = () => {
    setStep(prev => prev - 1)
  }

  const handleSubmit = async () => {
    if (!formData.isPhysicallyVerified) {
      setError("Please confirm that you have physically inspected this business")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {


      // 1. Upload new files DIRECTLY from Client (Bypass Server Action limits)
      let uploadedUrls: string[] = []
      if (imageFiles.length > 0) {
        // uploadedUrls = await uploadFilesToS3(imageFiles) // OLD
        uploadedUrls = await uploadImagesServerSide(imageFiles)
      }

      // 2. Combine images
      const finalImages = [...formData.images, ...uploadedUrls]

      const payload = {
        ...formData,
        images: finalImages,
        // Ensure numbers are numbers - using dual currency fields
        askingPriceEur: Number(formData.askingPriceEur),
        askingPriceLek: Number(formData.askingPriceLek),
        monthlyRevenueEur: Number(formData.monthlyRevenueEur),
        monthlyRevenueLek: Number(formData.monthlyRevenueLek),
        employeeCount: Number(formData.employeeCount),
        yearsInOperation: Number(formData.yearsInOperation),
      }

      if (mode === "create") {
        const result = await createListing.mutateAsync(payload).then(() => ({ success: true })).catch((e) => ({ success: false, error: e.message }))
        if ((result as any).error) {
          console.error("Create listing error:", (result as any).error)
          setError((result as any).error)
          setIsSubmitting(false)
          return
        }
        toast({ title: "Success", description: "Listing created details" })

        if (onSuccess) {
          onSuccess()
          return
        }

        router.push("/profile?success=true")

      } else {
        if (!listing) return
        const result = await updateListing.mutateAsync({ id: listing.id, data: payload }).then(() => ({ success: true })).catch((e) => ({ success: false, error: e.message }))
        if ((result as any).error) {
          console.error("Update listing error:", (result as any).error)
          setError((result as any).error)
          setIsSubmitting(false)
          return
        }
        toast({ title: "Updated", description: "Listing updated" })

        if (onSuccess) {
          onSuccess()
          return
        }

        // Default behavior for agents
        router.push("/profile")
      }

    } catch (e) {
      console.error("Unexpected submission error:", e)
      setError("An unexpected error occurred. Check console for details.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back Link */}
      <Link
        href="/profile"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Listings
      </Link>

      {/* Header with Progress */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          {mode === "create" ? "Create New Listing" : "Edit Listing"}
        </h1>
        <p className="text-muted-foreground mt-1 mb-4">
          Step {step} of 4
        </p>
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

      {/* Step 0: Agent Selection (Admin Only) */}
      {step === 0 && isAdmin && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Assign Agent</CardTitle>
                <CardDescription>Select the agent who owns this listing</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Select value={formData.agentId} onValueChange={(val) => updateData("agentId", val)}>
                <SelectTrigger className={fieldErrors.agentId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select an agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents?.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name || "Unnamed Agent"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.agentId && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.agentId}
                </p>
              )}
            </div>
            <div className="flex justify-end">
              <Button onClick={handleNext}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Private Info */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Private Business Information</CardTitle>
            <CardDescription>This information is kept confidential and only visible to verified buyers</CardDescription>
          </CardHeader>
          <CardContent>
            <Step1PrivateInfo data={formData} updateData={updateData} errors={fieldErrors} />
            <div className="flex justify-between mt-6">
              {isAdmin ? (
                <Button variant="outline" onClick={handleBack}>Back</Button>
              ) : (
                <div /> // Placeholder
              )}
              <Button onClick={handleNext}>Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Public Info & Images */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Public Listing Details</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Images are part of this step in this design */}
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
                  manual={true} // Crucial: listing form handles the upload on SUBMIT
                />
                {fieldErrors.images && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.images}
                  </p>
                )}
              </div>
            </div>

            <Step2PublicInfo
              data={formData}
              updateData={updateData}
              errors={fieldErrors}
            />

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext}>Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Financials */}
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

      {/* Step 4: Review */}
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
