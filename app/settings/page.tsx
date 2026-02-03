"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/lib/hooks/useAuth"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Trash2,
  Save,
  Camera,
  Mail,
  Phone,
  Building2,
  Globe,
  Lock,
  MessageSquare,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loader2,
} from "lucide-react"
import { useFileUpload } from "@/lib/hooks/useFileUpload"
import { toast } from "@/components/ui/use-toast"
import { useUpdateProfile } from "@/lib/hooks/useUser"
import { useInvalidateUser } from "@/lib/hooks/queries/useUserQuery"
import { api } from "@/lib/api"

export default function SettingsPage() {
  const { user, isLoading } = useUser() // Fetch user via JWT cookie
  const { uploadFile } = useFileUpload()
  const updateProfile = useUpdateProfile()
  const invalidateUser = useInvalidateUser()
  const [saving, setSaving] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [showWarningModal, setShowWarningModal] = useState(false)

  // Profile form state
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    // Agent-specific fields
    whatsapp: "",
    licenseNumber: "",
    bioEn: "",
    licenseDocumentUrl: "",
    companyDocumentUrl: "",
    idDocumentUrl: "",
    // verificationStatus is the single source of truth for agent verification
    verificationStatus: "pending" as "pending" | "approved" | "rejected",
    rejectionReason: null as string | null,
  })

  // Original values for change detection
  const [originalProfile, setOriginalProfile] = useState(profile)

  // File uploads
  const [licenseDocumentFile, setLicenseDocumentFile] = useState<File | null>(null)
  const [companyDocumentFile, setCompanyDocumentFile] = useState<File | null>(null)
  const [idDocumentFile, setIdDocumentFile] = useState<File | null>(null)

  // File upload errors
  const [licenseDocumentError, setLicenseDocumentError] = useState<string | null>(null)
  const [companyDocumentError, setCompanyDocumentError] = useState<string | null>(null)
  const [idDocumentError, setIdDocumentError] = useState<string | null>(null)

  // Resubmission state
  const [resubmitting, setResubmitting] = useState(false)

  // Initialize settings from user data (already in React Query cache)
  useEffect(() => {
    if (user) {
      const data = {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone_number || "",
        company: user.company_name || "", // For agents: agency name, for buyers: company name
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

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailLeads: true,
    emailUpdates: true,
    emailMarketing: false,
    pushLeads: true,
    pushMessages: true,
  })

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Handle document file selection with validation (50MB limit per file)
  const handleDocumentFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    docType: "license" | "company" | "id"
  ) => {
    const file = e.target.files?.[0]

    // Clear previous errors
    if (docType === "license") {
      setLicenseDocumentError(null)
      setLicenseDocumentFile(null)
    } else if (docType === "company") {
      setCompanyDocumentError(null)
      setCompanyDocumentFile(null)
    } else {
      setIdDocumentError(null)
      setIdDocumentFile(null)
    }

    if (!file) {
      return
    }

    const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
    const docTypeName = docType === "license" ? "License" : docType === "company" ? "Company" : "ID"

    // Validate file type
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png']
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase()
    const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']

    if (!allowedTypes.includes(fileExt) && !allowedMimeTypes.includes(file.type)) {
      const errorMsg = `Invalid file type. Please upload PDF, JPG, or PNG files only.`
      if (docType === "license") {
        setLicenseDocumentError(errorMsg)
      } else if (docType === "company") {
        setCompanyDocumentError(errorMsg)
      } else {
        setIdDocumentError(errorMsg)
      }
      toast({
        title: "Invalid File Type",
        description: errorMsg,
        variant: "destructive",
      })
      e.target.value = "" // Reset input
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const errorMsg = `${docTypeName} document is ${fileSizeMB}MB. Maximum size is 50MB. Please compress the file.`
      if (docType === "license") {
        setLicenseDocumentError(errorMsg)
      } else if (docType === "company") {
        setCompanyDocumentError(errorMsg)
      } else {
        setIdDocumentError(errorMsg)
      }
      toast({
        title: "File Too Large",
        description: errorMsg,
        variant: "destructive",
      })
      e.target.value = "" // Reset input
      return
    }

    // File is valid - set it
    if (docType === "license") {
      setLicenseDocumentFile(file)
    } else if (docType === "company") {
      setCompanyDocumentFile(file)
    } else {
      setIdDocumentFile(file)
    }

    toast({
      title: "File Selected",
      description: `${file.name} (${fileSizeMB}MB) - ready to upload`,
    })
  }

  // Check if critical agent fields changed
  const checkCriticalFieldsChanged = () => {
    if (user?.role !== "agent") return false

    return (
      profile.licenseNumber !== originalProfile.licenseNumber ||
      licenseDocumentFile !== null ||
      companyDocumentFile !== null ||
      idDocumentFile !== null
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
      // Update basic user fields (for all users)
      const basicFields = {
        name: profile.name,
        phone_number: profile.phone,
        company_name: profile.company,
        website: profile.website,
      }
      await updateProfile.mutateAsync(basicFields)

      // Update agent-specific fields (only for agents)
      if (user?.role === "agent") {
        const agentFields = {
          license_number: profile.licenseNumber,
          whatsapp_number: profile.whatsapp,
          bio_en: profile.bioEn,
          license_document: licenseDocumentFile,
          company_document: companyDocumentFile,
          id_document: idDocumentFile,
        }
        await api.user.updateAgentProfile(agentFields)
      }

      // Refresh user data from backend
      invalidateUser()

      // Clear file inputs after successful save
      setLicenseDocumentFile(null)
      setCompanyDocumentFile(null)
      setIdDocumentFile(null)

      toast({
        title: "Success",
        description: "Settings saved successfully",
      })
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  // Handle Photo Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return
    const file = e.target.files[0]

    // Validate file type (images only)
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedImageTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (JPG, PNG, or WebP).",
        variant: "destructive"
      })
      e.target.value = '' // Reset file input
      return
    }

    // Client-side file size validation (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: `Please select an image smaller than 10MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
        variant: "destructive"
      })
      e.target.value = '' // Reset file input
      return
    }

    toast({ title: "Uploading...", description: "Please wait" })

    try {
      // Upload using new backend API
      const imageUrl = await uploadFile(file, 'avatar')

      if (imageUrl) {
        await updateProfile.mutateAsync({ image: imageUrl })
        invalidateUser() // ✅ Refresh user data from backend (doesn't log out)
        toast({ title: "Success", description: "Profile photo updated successfully!" })
      } else {
        toast({ title: "Error", description: "Upload failed", variant: "destructive" })
      }
    } catch (error) {
      console.error("Upload error", error)

      // Check if it's a file size error
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (errorMessage.includes('MB limit') || errorMessage.includes('Body exceeded') || errorMessage.includes('bodySizeLimit')) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 10MB. Try compressing your image.",
          variant: "destructive"
        })
      } else {
        toast({
          title: "Upload Failed",
          description: errorMessage || "An error occurred while uploading. Please try again.",
          variant: "destructive"
        })
      }
    }
  }

  // Show loading state while fetching auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    )
  }

  // Redirect if not logged in (after loading completes)
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-20">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h1 className="text-2xl font-bold">Please sign in to access settings</h1>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const isAgent = user.role === "agent"

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account preferences and settings</p>
          </div>

          {/* Rejection Card for Agents */}
          {isAgent && profile.verificationStatus === "rejected" && (
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
                    <p className="text-sm">{profile.rejectionReason}</p>
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
                    <li>Click "Resubmit for Verification"</li>
                  </ol>
                </div>

                <Button
                  onClick={async () => {
                    setResubmitting(true)
                    try {
                      // Resubmission happens by updating profile with new documents
                      // The backend automatically sets verification_status to "pending"
                      invalidateUser() // Refresh user data
                      setProfile(prev => ({ ...prev, verificationStatus: "pending", rejectionReason: null }))
                      toast({
                        title: "Success",
                        description: "Successfully resubmitted for verification!"
                      })
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Failed to resubmit for verification",
                        variant: "destructive"
                      })
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
          )}

          {/* Verification Status Alert for Agents */}
          {isAgent && profile.verificationStatus === "pending" && (
            <Alert className="mb-6 bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-900">
                Your account is pending verification by an admin. You cannot create listings until verified.
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              {user?.role === "agent" && (
                <TabsTrigger value="documents" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Documents
                </TabsTrigger>
              )}
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="billing" className="gap-2">
                <CreditCard className="h-4 w-4" />
                Billing
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>Update your personal information and public profile</CardDescription>
                    </div>
                    {isAgent && profile.verificationStatus === "approved" && (
                      <Badge className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Verified Agent
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user.image || user.image || "/placeholder.svg"} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xl">
                        {getInitials(user.name || "User")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="relative">
                        <input
                          type="file"
                          id="avatar-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-transparent"
                          onClick={() => document.getElementById("avatar-upload")?.click()}
                        >
                          <Camera className="h-4 w-4" />
                          Change Photo
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB.</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Form Fields */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="pl-10"
                          disabled={fetching}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          disabled={true}
                          className="pl-10 bg-muted cursor-not-allowed"
                          readOnly
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed. Contact support if you need to update your email address.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="pl-10"
                          placeholder="+383 44 123 456"
                          disabled={fetching}
                        />
                      </div>
                    </div>

                    {/* Agent-specific: WhatsApp */}
                    {isAgent && (
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp">WhatsApp Number</Label>
                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="whatsapp"
                            value={profile.whatsapp}
                            onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                            className="pl-10"
                            placeholder="+383 44 123 456"
                            disabled={fetching}
                          />
                        </div>
                      </div>
                    )}

                    {/* Company/Agency Name - for all users */}
                    <div className="space-y-2">
                      <Label htmlFor="company">
                        {isAgent ? "Agency Name" : "Company Name"}
                      </Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="company"
                          value={profile.company}
                          onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                          placeholder={isAgent ? "Your agency name" : "Optional"}
                          className="pl-10"
                          disabled={fetching}
                        />
                      </div>
                    </div>

                    {/* Website - for all users */}
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="website">Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="website"
                          value={profile.website}
                          onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                          placeholder="https://example.com"
                          className="pl-10"
                          disabled={fetching}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Agent-specific Section */}
                  {isAgent && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold">Professional Information</h3>
                          <Badge variant="outline" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Changes require re-verification
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="licenseNumber">License Number *</Label>
                            <Input
                              id="licenseNumber"
                              value={profile.licenseNumber}
                              onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })}
                              disabled={fetching}
                            />
                          </div>
                        </div>

                        {/* Document Uploads */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-sm text-muted-foreground uppercase">Verification Documents</h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* License Document */}
                            <div className="space-y-3">
                              <Label htmlFor="licenseDocument">
                                <FileText className="inline h-4 w-4 mr-1" />
                                License Document
                              </Label>

                              {profile.licenseDocumentUrl && !licenseDocumentFile && (
                                <Card className="border-green-200 bg-green-50/50">
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                          <FileText className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium text-foreground truncate">
                                            License Document
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            Uploaded {profile.licenseDocumentUrl.includes('s3') ? '• Verified' : ''}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => window.open(profile.licenseDocumentUrl, '_blank')}
                                          className="h-8 px-3"
                                        >
                                          <FileText className="h-3 w-3 mr-1" />
                                          View
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              )}

                              <Input
                                id="licenseDocument"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleDocumentFileChange(e, "license")}
                                className={licenseDocumentError ? "cursor-pointer border-red-500" : "cursor-pointer"}
                              />
                              {!licenseDocumentError && (
                                <p className="text-xs text-muted-foreground">PDF, JPG, PNG - Max 50MB per file</p>
                              )}
                              {licenseDocumentError && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  {licenseDocumentError}
                                </p>
                              )}
                              {licenseDocumentFile && !licenseDocumentError && (
                                <p className="text-xs text-green-600 flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  New file selected: {licenseDocumentFile.name} ({(licenseDocumentFile.size / (1024 * 1024)).toFixed(2)}MB)
                                </p>
                              )}
                              {!profile.licenseDocumentUrl && !licenseDocumentFile && !licenseDocumentError && (
                                <p className="text-xs text-amber-600">No document uploaded yet</p>
                              )}
                            </div>

                            {/* Company Document */}
                            <div className="space-y-3">
                              <Label htmlFor="companyDocument">
                                <FileText className="inline h-4 w-4 mr-1" />
                                Company Document
                              </Label>

                              {profile.companyDocumentUrl && !companyDocumentFile && (
                                <Card className="border-green-200 bg-green-50/50">
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                          <Building2 className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium text-foreground truncate">
                                            Company Document
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            Uploaded {profile.companyDocumentUrl.includes('s3') ? '• Verified' : ''}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => window.open(profile.companyDocumentUrl, '_blank')}
                                          className="h-8 px-3"
                                        >
                                          <FileText className="h-3 w-3 mr-1" />
                                          View
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              )}

                              <Input
                                id="companyDocument"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleDocumentFileChange(e, "company")}
                                className={companyDocumentError ? "cursor-pointer border-red-500" : "cursor-pointer"}
                              />
                              {!companyDocumentError && (
                                <p className="text-xs text-muted-foreground">PDF, JPG, PNG - Max 50MB per file</p>
                              )}
                              {companyDocumentError && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  {companyDocumentError}
                                </p>
                              )}
                              {companyDocumentFile && !companyDocumentError && (
                                <p className="text-xs text-green-600 flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  New file selected: {companyDocumentFile.name} ({(companyDocumentFile.size / (1024 * 1024)).toFixed(2)}MB)
                                </p>
                              )}
                              {!profile.companyDocumentUrl && !companyDocumentFile && !companyDocumentError && (
                                <p className="text-xs text-amber-600">No document uploaded yet</p>
                              )}
                            </div>

                            {/* ID Document */}
                            <div className="space-y-3">
                              <Label htmlFor="idDocument">
                                <FileText className="inline h-4 w-4 mr-1" />
                                Government ID / Passport <span className="text-red-500">*</span>
                              </Label>

                              {profile.idDocumentUrl && !idDocumentFile && (
                                <Card className="border-green-200 bg-green-50/50">
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex items-start gap-3 flex-1">
                                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                          <p className="text-sm font-medium text-green-900">
                                            ID Document
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            Uploaded {profile.idDocumentUrl.includes('s3') ? '• Verified' : ''}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex gap-2 flex-shrink-0">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => window.open(profile.idDocumentUrl, '_blank')}
                                          className="h-8 px-3"
                                        >
                                          <FileText className="h-3 w-3 mr-1" />
                                          View
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              )}

                              <Input
                                id="idDocument"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleDocumentFileChange(e, "id")}
                                className={idDocumentError ? "cursor-pointer border-red-500" : "cursor-pointer"}
                              />
                              {!idDocumentError && (
                                <p className="text-xs text-muted-foreground">PDF, JPG, PNG - Max 50MB per file</p>
                              )}
                              {idDocumentError && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  {idDocumentError}
                                </p>
                              )}
                              {idDocumentFile && !idDocumentError && (
                                <p className="text-xs text-green-600 flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  New file selected: {idDocumentFile.name} ({(idDocumentFile.size / (1024 * 1024)).toFixed(2)}MB)
                                </p>
                              )}
                              {!profile.idDocumentUrl && !idDocumentFile && !idDocumentError && (
                                <p className="text-xs text-amber-600">No document uploaded yet • Required for verification</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Bio */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">Professional Bio</h3>

                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            rows={4}
                            value={profile.bioEn}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                bioEn: e.target.value,
                              })
                            }
                            placeholder="Tell buyers about your experience and expertise..."
                            disabled={fetching}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSaveClick} disabled={saving || fetching} className="gap-2">
                      <Save className="h-4 w-4" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab - Agents Only */}
            {user?.role === "agent" && (
              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Verification Documents</CardTitle>
                        <CardDescription>View and manage your uploaded verification documents</CardDescription>
                      </div>
                      {profile.verificationStatus === "approved" && (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Document Upload Warning */}
                    {!profile.licenseDocumentUrl || !profile.companyDocumentUrl || !profile.idDocumentUrl ? (
                      <Alert className="border-amber-300 bg-amber-50">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-amber-800">
                          Please upload all 3 required documents (License, Company, and ID/Passport) to complete your verification process.
                        </AlertDescription>
                      </Alert>
                    ) : null}

                    {/* License Document */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-foreground">License Document</h3>
                        {profile.licenseDocumentUrl && (
                          <Badge variant="outline" className="text-green-600 border-green-300">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Uploaded
                          </Badge>
                        )}
                      </div>

                      {profile.licenseDocumentUrl ? (
                        <Card className="border-green-200 bg-green-50/30">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="h-16 w-16 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                <FileText className="h-8 w-8 text-green-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground mb-1">Professional License</p>
                                <p className="text-sm text-muted-foreground mb-3">
                                  Your professional licensing document has been uploaded.
                                </p>
                                <div className="flex gap-2">
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => window.open(profile.licenseDocumentUrl, '_blank')}
                                  >
                                    <FileText className="h-4 w-4 mr-2" />
                                    View Document
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const a = document.createElement('a')
                                      a.href = profile.licenseDocumentUrl
                                      a.download = 'license-document'
                                      a.click()
                                    }}
                                  >
                                    Download
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            No license document uploaded. Please upload your document in the Profile tab.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <Separator />

                    {/* Company Document */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-foreground">Company Document</h3>
                        {profile.companyDocumentUrl && (
                          <Badge variant="outline" className="text-green-600 border-green-300">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Uploaded
                          </Badge>
                        )}
                      </div>

                      {profile.companyDocumentUrl ? (
                        <Card className="border-green-200 bg-green-50/30">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="h-16 w-16 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                <Building2 className="h-8 w-8 text-green-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground mb-1">Company Registration</p>
                                <p className="text-sm text-muted-foreground mb-3">
                                  Your company registration document has been uploaded.
                                </p>
                                <div className="flex gap-2">
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => window.open(profile.companyDocumentUrl, '_blank')}
                                  >
                                    <Building2 className="h-4 w-4 mr-2" />
                                    View Document
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const a = document.createElement('a')
                                      a.href = profile.companyDocumentUrl
                                      a.download = 'company-document'
                                      a.click()
                                    }}
                                  >
                                    Download
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            No company document uploaded. Please upload your document in the Profile tab.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <Separator />

                    {/* ID Document */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-foreground">Government ID / Passport <span className="text-red-500">*</span></h3>
                        {profile.idDocumentUrl && (
                          <Badge variant="outline" className="text-green-600 border-green-300">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Uploaded
                          </Badge>
                        )}
                      </div>

                      {profile.idDocumentUrl ? (
                        <Card className="border-green-200 bg-green-50/30">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="h-16 w-16 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                <FileText className="h-8 w-8 text-green-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground mb-1">Government ID / Passport</p>
                                <p className="text-sm text-muted-foreground mb-3">
                                  Your ID document has been uploaded. This is only visible to admins for security.
                                </p>
                                <div className="flex gap-2">
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => window.open(profile.idDocumentUrl, '_blank')}
                                  >
                                    <FileText className="h-4 w-4 mr-2" />
                                    View Document
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const a = document.createElement('a')
                                      a.href = profile.idDocumentUrl
                                      a.download = 'id-document'
                                      a.click()
                                    }}
                                  >
                                    Download
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            No ID document uploaded. Please upload your government-issued ID or passport in the Profile tab. <strong>Required for verification.</strong>
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* Info Box */}
                    <Alert className="border-blue-200 bg-blue-50/50">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        <strong>Need to update documents?</strong> Go to the Profile tab to upload new documents.
                        Uploading new documents will require re-verification by an admin.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how and when you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-foreground">Email Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-leads" className="font-normal">
                            New Leads
                          </Label>
                          <p className="text-sm text-muted-foreground">Get notified when you receive new leads</p>
                        </div>
                        <Switch
                          id="email-leads"
                          checked={notifications.emailLeads}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, emailLeads: checked })}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-updates" className="font-normal">
                            Product Updates
                          </Label>
                          <p className="text-sm text-muted-foreground">News about product features and improvements</p>
                        </div>
                        <Switch
                          id="email-updates"
                          checked={notifications.emailUpdates}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, emailUpdates: checked })}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-marketing" className="font-normal">
                            Marketing Emails
                          </Label>
                          <p className="text-sm text-muted-foreground">Tips, trends, and market insights</p>
                        </div>
                        <Switch
                          id="email-marketing"
                          checked={notifications.emailMarketing}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, emailMarketing: checked })}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-foreground">Push Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="push-leads" className="font-normal">
                            Lead Alerts
                          </Label>
                          <p className="text-sm text-muted-foreground">Instant alerts for new leads</p>
                        </div>
                        <Switch
                          id="push-leads"
                          checked={notifications.pushLeads}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, pushLeads: checked })}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="push-messages" className="font-normal">
                            Chat Messages
                          </Label>
                          <p className="text-sm text-muted-foreground">Get notified of new chat messages</p>
                        </div>
                        <Switch
                          id="push-messages"
                          checked={notifications.pushMessages}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, pushMessages: checked })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSave} disabled={saving} className="gap-2">
                      <Save className="h-4 w-4" />
                      {saving ? "Saving..." : "Save Preferences"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password to keep your account secure</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="current-password" type="password" className="pl-10" />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button>Update Password</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-destructive/50">
                  <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Irreversible and destructive actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Delete Account</p>
                        <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                      </div>
                      <Button variant="destructive" className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing">
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
                    <p className="text-sm text-muted-foreground mb-4">You are currently on the free plan</p>
                    <Button>Upgrade to Pro</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Warning Modal for Critical Field Changes */}
      <Dialog open={showWarningModal} onOpenChange={setShowWarningModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Re-Verification Required
            </DialogTitle>
            <div className="pt-4 text-muted-foreground text-sm">
              <p>You are about to change critical information that requires admin re-verification:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {profile.licenseNumber !== originalProfile.licenseNumber && <li>License Number</li>}
                {licenseDocumentFile && <li>License Document</li>}
                {companyDocumentFile && <li>Company Document</li>}
                {idDocumentFile && <li>ID Document</li>}
              </ul>
              <p className="mt-4 font-semibold">
                Your verification status will be reset and you won't be able to create new listings until an admin
                re-verifies your account.
              </p>
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWarningModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Continue & Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
