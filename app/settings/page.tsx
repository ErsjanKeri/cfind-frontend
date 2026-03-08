"use client"

import { useUser } from "@/lib/hooks/useAuth"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  User,
  CreditCard,
  FileText,
  AlertTriangle,
} from "lucide-react"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { useRole } from "@/lib/hooks/useRole"
import { useSettingsForm } from "@/lib/hooks/useSettingsForm"
import { VerificationBanner } from "@/components/settings/verification-banner"
import { ProfileTab } from "@/components/settings/profile-tab"
import { DocumentsTab } from "@/components/settings/documents-tab"
import { BillingTab } from "@/components/settings/billing-tab"
import { LoadingButton } from "@/components/shared/loading-button"
import { useInvalidateUser } from "@/lib/hooks/useAuth"

export default function SettingsPage() {
  const { user, isLoading } = useUser()
  const { isAgent } = useRole()
  const invalidateUser = useInvalidateUser()
  const form = useSettingsForm(user ?? undefined, isAgent)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-20 flex items-center justify-center">
          <LoadingSpinner />
        </main>
        <Footer />
      </div>
    )
  }

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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account preferences and settings</p>
          </div>

          {isAgent && (
            <VerificationBanner
              verificationStatus={form.profile.verificationStatus}
              rejectionReason={form.profile.rejectionReason}
              onResubmit={() => {
                invalidateUser()
                form.setProfile(prev => ({ ...prev, verificationStatus: "pending", rejectionReason: null }))
              }}
            />
          )}

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              {isAgent && (
                <TabsTrigger value="documents" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Documents
                </TabsTrigger>
              )}
              <TabsTrigger value="billing" className="gap-2">
                <CreditCard className="h-4 w-4" />
                Billing
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileTab
                user={user}
                profile={form.profile}
                setProfile={form.setProfile}
                isAgent={isAgent}
                fetching={form.fetching}
                saving={form.saving}
                documents={form.documents}
                onDocumentFileChange={form.handleDocumentFileChange}
                onPhotoUpload={form.handlePhotoUpload}
                onSave={form.handleSaveClick}
              />
            </TabsContent>

            {isAgent && (
              <TabsContent value="documents">
                <DocumentsTab
                  licenseDocumentUrl={form.profile.licenseDocumentUrl}
                  companyDocumentUrl={form.profile.companyDocumentUrl}
                  idDocumentUrl={form.profile.idDocumentUrl}
                  verificationStatus={form.profile.verificationStatus}
                />
              </TabsContent>
            )}

            <TabsContent value="billing">
              <BillingTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Dialog open={form.showWarningModal} onOpenChange={form.setShowWarningModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Re-Verification Required
            </DialogTitle>
            <div className="pt-4 text-muted-foreground text-sm">
              <p>You are about to change critical information that requires admin re-verification:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {form.profile.licenseNumber !== form.originalProfile.licenseNumber && <li>License Number</li>}
                {form.documents.license.file && <li>License Document</li>}
                {form.documents.company.file && <li>Company Document</li>}
                {form.documents.id.file && <li>ID Document</li>}
              </ul>
              <p className="mt-4 font-semibold">
                Your verification status will be reset and you won&apos;t be able to create new listings until an admin
                re-verifies your account.
              </p>
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => form.setShowWarningModal(false)} disabled={form.saving}>
              Cancel
            </Button>
            <LoadingButton isLoading={form.saving} loadingText="Saving..." onClick={form.handleSave}>
              Continue &amp; Save
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
