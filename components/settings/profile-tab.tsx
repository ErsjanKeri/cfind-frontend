"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Save,
  Camera,
  Mail,
  Phone,
  Building2,
  Globe,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import { getInitials } from "@/lib/utils"
import { DocumentUploadField } from "@/components/settings/document-upload-field"
import type { UserWithProfile } from "@/lib/api/types"
import type { ProfileState, DocumentsState } from "@/lib/hooks/useSettingsForm"

interface ProfileTabProps {
  user: UserWithProfile
  profile: ProfileState
  setProfile: React.Dispatch<React.SetStateAction<ProfileState>>
  isAgent: boolean
  fetching: boolean
  saving: boolean
  documents: DocumentsState
  onDocumentFileChange: (e: React.ChangeEvent<HTMLInputElement>, docType: "license" | "company" | "id") => void
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSave: () => void
}

export function ProfileTab({
  user,
  profile,
  setProfile,
  isAgent,
  fetching,
  saving,
  documents,
  onDocumentFileChange,
  onPhotoUpload,
  onSave,
}: ProfileTabProps) {
  return (
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
            <AvatarImage src={user.image || "/placeholder.svg"} />
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
                onChange={onPhotoUpload}
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
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
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
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                className="pl-10"
                placeholder="+383 44 123 456"
                disabled={fetching}
              />
            </div>
          </div>

          {isAgent && (
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="whatsapp"
                  value={profile.whatsapp}
                  onChange={(e) => setProfile(prev => ({ ...prev, whatsapp: e.target.value }))}
                  className="pl-10"
                  placeholder="+383 44 123 456"
                  disabled={fetching}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="company">
              {isAgent ? "Agency Name" : "Company Name"}
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="company"
                value={profile.company}
                onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                placeholder={isAgent ? "Your agency name" : "Optional"}
                className="pl-10"
                disabled={fetching}
              />
            </div>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="website">Website</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="website"
                value={profile.website}
                onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
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
                    onChange={(e) => setProfile(prev => ({ ...prev, licenseNumber: e.target.value }))}
                    disabled={fetching}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase">Verification Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DocumentUploadField
                    id="licenseDocument"
                    label="License Document"
                    existingUrl={profile.licenseDocumentUrl}
                    file={documents.license.file}
                    error={documents.license.error}
                    onChange={(e) => onDocumentFileChange(e, "license")}
                  />
                  <DocumentUploadField
                    id="companyDocument"
                    label="Company Document"
                    icon="building"
                    existingUrl={profile.companyDocumentUrl}
                    file={documents.company.file}
                    error={documents.company.error}
                    onChange={(e) => onDocumentFileChange(e, "company")}
                  />
                  <DocumentUploadField
                    id="idDocument"
                    label="Government ID / Passport"
                    existingUrl={profile.idDocumentUrl}
                    file={documents.id.file}
                    error={documents.id.error}
                    onChange={(e) => onDocumentFileChange(e, "id")}
                    required
                    noUploadMessage="No document uploaded yet • Required for verification"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold">Professional Bio</h3>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  value={profile.bioEn}
                  onChange={(e) => setProfile(prev => ({ ...prev, bioEn: e.target.value }))}
                  placeholder="Tell buyers about your experience and expertise..."
                  disabled={fetching}
                />
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end pt-4">
          <Button onClick={onSave} disabled={saving || fetching} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
