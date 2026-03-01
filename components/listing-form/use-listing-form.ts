"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCreateListing, useUpdateListing } from "@/lib/hooks/useListings"
import { useFileUpload } from "@/lib/hooks/useFileUpload"
import { toast } from "@/components/ui/use-toast"
import type { Listing, ListingFormData } from "@/lib/api/types"

interface UseListingFormOptions {
  listing?: Listing
  mode: "create" | "edit"
  isAdmin: boolean
  onSuccess?: () => void
}

export function useListingForm({ listing, mode, isAdmin, onSuccess }: UseListingFormOptions) {
  const router = useRouter()
  const { uploadMultiple } = useFileUpload()
  const createListing = useCreateListing()
  const updateListing = useUpdateListing()

  const [step, setStep] = useState(isAdmin ? 0 : 1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<ListingFormData>({
    agent_id: listing?.agent_id || "",
    real_business_name: listing?.real_business_name || "",
    real_location_address: listing?.real_location_address || "",
    real_description_en: listing?.real_description_en || "",
    category: listing?.category?.toLowerCase() || "",
    public_title_en: listing?.public_title_en || "",
    public_description_en: listing?.public_description_en || "",
    public_location_area: listing?.public_location_area || "",
    public_location_city_en: listing?.public_location_city_en || "",
    images: listing?.images?.map(img => img.url) || [] as string[],
    asking_price_eur: listing?.asking_price_eur || "",
    monthly_revenue_eur: listing?.monthly_revenue_eur || "",
    employee_count: listing?.employee_count || "",
    years_in_operation: listing?.years_in_operation || "",
    is_physically_verified: mode === "edit",
  })

  const [imageFiles, setImageFiles] = useState<File[]>([])

  const updateData = (field: string, value: string | number | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const calculateROI = () => {
    const price = Number(formData.asking_price_eur) || 0
    const revenue = Number(formData.monthly_revenue_eur) || 0
    if (price > 0 && revenue > 0) {
      return ((revenue * 12) / price * 100).toFixed(1)
    }
    return "N/A"
  }

  const handleNext = () => {
    setError("")
    setFieldErrors({})
    const errors: Record<string, string> = {}

    if (step === 0 && isAdmin) {
      if (!formData.agent_id) {
        errors.agent_id = "Please select an agent"
      }
    }

    if (step === 1) {
      if (!formData.real_business_name) errors.real_business_name = "Business name is required"
      if (!formData.category) errors.category = "Category is required"
      if (!formData.real_location_address) errors.real_location_address = "Address is required"
    }

    if (step === 2) {
      if (!formData.public_title_en) errors.public_title_en = "Title is required"
      if (!formData.public_description_en) errors.public_description_en = "Description is required"
      if (!formData.public_location_area) errors.public_location_area = "Area is required"
      if (!formData.public_location_city_en) errors.public_location_city_en = "City is required"
      if (!formData.category) errors.category = "Category is required"
      if (formData.images.length === 0 && imageFiles.length === 0) {
        errors.images = "Please upload at least one image"
      }
    }

    if (step === 3) {
      if (!formData.asking_price_eur) errors.asking_price_eur = "Asking price (EUR) is required"
    }

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
    if (!formData.is_physically_verified) {
      setError("Please confirm that you have physically inspected this business")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      let uploadedUrls: string[] = []
      if (imageFiles.length > 0) {
        uploadedUrls = await uploadMultiple(imageFiles, 'listing')
        if (uploadedUrls.length === 0) {
          throw new Error("Upload failed")
        }
      }

      const finalImages = [...formData.images, ...uploadedUrls]

      const payload = {
        ...formData,
        images: finalImages.map((url, index) => ({ url, order: index })),
        asking_price_eur: Number(formData.asking_price_eur),
        monthly_revenue_eur: Number(formData.monthly_revenue_eur) || undefined,
        employee_count: Number(formData.employee_count) || undefined,
        years_in_operation: Number(formData.years_in_operation) || undefined,
      }

      if (mode === "create") {
        const result = await createListing.mutateAsync(payload)
          .then(() => ({ success: true, error: "" }))
          .catch((e: unknown) => ({ success: false, error: e instanceof Error ? e.message : "An unexpected error occurred" }))
        if (result.error) {
          setError(result.error)
          setIsSubmitting(false)
          return
        }
        toast({ title: "Success", description: "Listing created details" })
      } else {
        if (!listing) return
        const result = await updateListing.mutateAsync({ id: listing.id, data: payload })
          .then(() => ({ success: true, error: "" }))
          .catch((e: unknown) => ({ success: false, error: e instanceof Error ? e.message : "An unexpected error occurred" }))
        if (result.error) {
          setError(result.error)
          setIsSubmitting(false)
          return
        }
        toast({ title: "Updated", description: "Listing updated" })
      }

      if (onSuccess) {
        onSuccess()
        return
      }

      router.push(mode === "create" ? "/profile?success=true" : "/profile")
    } catch {
      setError("An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
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
  }
}
