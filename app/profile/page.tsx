'use client';

/**
 * Profile Page - With Role-Based Dashboards
 *
 * Shows different views based on user role:
 * - Admin: AdminView dashboard
 * - Agent: AgentView dashboard
 * - Buyer: BuyerView dashboard
 */
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth, useUser } from "@/lib/hooks/useAuth"
import { useUpdateProfile } from "@/lib/hooks/useUser"
import { useRole } from "@/lib/hooks/useRole"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Settings } from "lucide-react"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { AdminView } from "@/components/dashboard/admin-view"
import { AgentView } from "@/components/dashboard/agent-view"
import { BuyerView } from "@/components/dashboard/buyer-view"
import { ImageUpload } from "@/components/shared/image-upload"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { getInitials, getErrorMessage } from "@/lib/utils"
import { toast } from "sonner"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading } = useUser() // Simple: fetch user via JWT cookie
  const { isAdmin, isAgent, isBuyer } = useRole()
  const updateProfile = useUpdateProfile()
  const [showImageUpload, setShowImageUpload] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    )
  }

  // If no user after loading, wait for redirect
  if (!user) {
    return null
  }

  const handleImageUpdate = async (urls: string[]) => {
    if (urls.length > 0) {
      try {
        await updateProfile.mutateAsync({ image: urls[0] })
        toast.success("Profile photo updated successfully!")
        setShowImageUpload(false)
      } catch (error: unknown) {
        toast.error(getErrorMessage(error))
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header - Common for everyone */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.image || "/placeholder.svg"} alt={user?.name || "User"} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {getInitials(user?.name || user?.email)}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="secondary"
                size="sm"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                onClick={() => setShowImageUpload(true)}
              >
                📷
              </Button>
            </div>

            {/* Image Upload Dialog */}
            <Dialog open={showImageUpload} onOpenChange={setShowImageUpload}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Profile Photo</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <ImageUpload
                    value={[]}
                    onChange={handleImageUpdate}
                    maxImages={1}
                    crop={true}
                    aspect={1}
                  />
                </div>
              </DialogContent>
            </Dialog>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">{user?.name || 'User'}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
              <Badge className="mt-2 bg-primary/10 text-primary">
                {isAdmin ? "Admin" : isAgent ? "Agent" : "Buyer"}
              </Badge>
            </div>
            <Button variant="outline" asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>

          {/* Role-Specific Dashboard Views */}
          <div className="mt-8">
            {isAdmin && <AdminView />}
            {isAgent && <AgentView />}
            {isBuyer && <BuyerView />}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
