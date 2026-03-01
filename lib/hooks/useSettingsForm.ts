"use client"

import { useState, useEffect } from "react"
import { useFileUpload } from "@/lib/hooks/useFileUpload"
import { useUpdateProfile } from "@/lib/hooks/useUser"
import { useInvalidateUser } from "@/lib/hooks/queries/useUserQuery"
import { api } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import type { UserWithProfile } from "@/lib/api/types"

// ============================================================================
// TYPES
// ============================================================================

export interface ProfileState {
  name: string
  email: string
  phone: string
  company: string
  website: string
  whatsapp: string
  licenseNumber: string
  bioEn: string
  licenseDocumentUrl: string
  companyDocumentUrl: string
  idDocumentUrl: string
  verificationStatus: "pending" | "approved" | "rejected"
  rejectionReason: string | null
}

type DocType = "license" | "company" | "id"

interface DocumentState {
  file: File | null
  error: string | null
}

export interface DocumentsState {
  license: DocumentState
  company: DocumentState
  id: DocumentState
}

// ============================================================================
// HOOK
// ============================================================================

export function useSettingsForm(user: UserWithProfile | undefined, isAgent: boolean) {
  const { uploadFile } = useFileUpload()
  const updateProfile = useUpdateProfile()
  const invalidateUser = useInvalidateUser()

  // Profile state
  const [profile, setProfile] = useState<ProfileState>({
    name: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    whatsapp: "",
    licenseNumber: "",
    bioEn: "",
    licenseDocumentUrl: "",
    companyDocumentUrl: "",
    idDocumentUrl: "",
    verificationStatus: "pending",
    rejectionReason: null,
  })

  const [originalProfile, setOriginalProfile] = useState<ProfileState>(profile)

  // Document state (grouped)
  const [documents, setDocuments] = useState<DocumentsState>({
    license: { file: null, error: null },
    company: { file: null, error: null },
    id: { file: null, error: null },
  })

  // UI state
  const [saving, setSaving] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [showWarningModal, setShowWarningModal] = useState(false)

  // Sync profile from user data
  useEffect(() => {
    if (user) {
      const data: ProfileState = {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone_number || "",
        company: user.company_name || "",
        website: user.website || "",
        whatsapp: user.agent_profile?.whatsapp_number || "",
        licenseNumber: user.agent_profile?.license_number || "",
        bioEn: user.agent_profile?.bio_en || "",
        licenseDocumentUrl: user.agent_profile?.license_document_url || "",
        companyDocumentUrl: user.agent_profile?.company_document_url || "",
        idDocumentUrl: user.agent_profile?.id_document_url || "",
        verificationStatus: user.agent_profile?.verification_status || "pending",
        rejectionReason: user.agent_profile?.rejection_reason || null,
      }
      setProfile(data)
      setOriginalProfile(data)
      setFetching(false)
    }
  }, [user])

  // ---------------------------------------------------------------------------
  // Document file change handler
  // ---------------------------------------------------------------------------
  const handleDocumentFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    docType: DocType
  ) => {
    const file = e.target.files?.[0]

    // Clear previous error and file for this doc type
    setDocuments(prev => ({
      ...prev,
      [docType]: { file: null, error: null },
    }))

    if (!file) return

    const MAX_FILE_SIZE = 50 * 1024 * 1024
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
    const docTypeName = docType === "license" ? "License" : docType === "company" ? "Company" : "ID"

    const allowedTypes = [".pdf", ".jpg", ".jpeg", ".png"]
    const fileExt = "." + file.name.split(".").pop()?.toLowerCase()
    const allowedMimeTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"]

    if (!allowedTypes.includes(fileExt) && !allowedMimeTypes.includes(file.type)) {
      const errorMsg = "Invalid file type. Please upload PDF, JPG, or PNG files only."
      setDocuments(prev => ({ ...prev, [docType]: { file: null, error: errorMsg } }))
      toast({ title: "Invalid File Type", description: errorMsg, variant: "destructive" })
      e.target.value = ""
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      const errorMsg = `${docTypeName} document is ${fileSizeMB}MB. Maximum size is 50MB. Please compress the file.`
      setDocuments(prev => ({ ...prev, [docType]: { file: null, error: errorMsg } }))
      toast({ title: "File Too Large", description: errorMsg, variant: "destructive" })
      e.target.value = ""
      return
    }

    setDocuments(prev => ({ ...prev, [docType]: { file, error: null } }))
    toast({ title: "File Selected", description: `${file.name} (${fileSizeMB}MB) - ready to upload` })
  }

  // ---------------------------------------------------------------------------
  // Photo upload handler
  // ---------------------------------------------------------------------------
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return
    const file = e.target.files[0]

    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedImageTypes.includes(file.type)) {
      toast({ title: "Invalid File Type", description: "Please select an image file (JPG, PNG, or WebP).", variant: "destructive" })
      e.target.value = ""
      return
    }

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      toast({ title: "File Too Large", description: `Please select an image smaller than 10MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`, variant: "destructive" })
      e.target.value = ""
      return
    }

    toast({ title: "Uploading...", description: "Please wait" })

    try {
      const imageUrl = await uploadFile(file, "avatar")
      if (imageUrl) {
        await updateProfile.mutateAsync({ image: imageUrl })
        invalidateUser()
        toast({ title: "Success", description: "Profile photo updated successfully!" })
      } else {
        toast({ title: "Error", description: "Upload failed", variant: "destructive" })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (errorMessage.includes("MB limit") || errorMessage.includes("Body exceeded") || errorMessage.includes("bodySizeLimit")) {
        toast({ title: "File Too Large", description: "Please select an image smaller than 10MB. Try compressing your image.", variant: "destructive" })
      } else {
        toast({ title: "Upload Failed", description: errorMessage || "An error occurred while uploading. Please try again.", variant: "destructive" })
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Save logic
  // ---------------------------------------------------------------------------
  const checkCriticalFieldsChanged = () => {
    if (!isAgent) return false
    return (
      profile.licenseNumber !== originalProfile.licenseNumber ||
      documents.license.file !== null ||
      documents.company.file !== null ||
      documents.id.file !== null
    )
  }

  const handleSaveClick = () => {
    if (checkCriticalFieldsChanged()) {
      setShowWarningModal(true)
    } else {
      handleSave()
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setShowWarningModal(false)

    try {
      await updateProfile.mutateAsync({
        name: profile.name,
        phone_number: profile.phone,
        company_name: profile.company,
        website: profile.website,
      })

      if (isAgent) {
        await api.user.updateAgentProfile({
          license_number: profile.licenseNumber,
          whatsapp_number: profile.whatsapp,
          bio_en: profile.bioEn,
          license_document: documents.license.file,
          company_document: documents.company.file,
          id_document: documents.id.file,
        })
      }

      invalidateUser()
      setDocuments({
        license: { file: null, error: null },
        company: { file: null, error: null },
        id: { file: null, error: null },
      })

      toast({ title: "Success", description: "Settings saved successfully" })
    } catch {
      toast({ title: "Error", description: "An unexpected error occurred", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  return {
    profile,
    setProfile,
    originalProfile,
    documents,
    saving,
    fetching,
    showWarningModal,
    setShowWarningModal,
    handleDocumentFileChange,
    handlePhotoUpload,
    handleSaveClick,
    handleSave,
  }
}
