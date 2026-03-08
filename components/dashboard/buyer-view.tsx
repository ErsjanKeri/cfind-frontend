"use client"

import { useState } from "react"
import Link from "next/link"
import { useUser } from "@/lib/hooks/useAuth"
import { useBuyerLeads, useSavedListings } from "@/lib/hooks/useLeads"
import { useBuyerDemands, useUpdateDemandStatus, useDeleteDemand } from "@/lib/hooks/useDemands"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/shared/empty-state"
import { MessageCircle, Heart, ArrowRight, Phone, Mail, Plus, Tag, Calendar } from "lucide-react"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { DemandCard } from "@/components/demands/demand-card"
import { DemandDialog } from "@/components/demands/demand-dialog"
import { StatCard } from "@/components/shared/stat-card"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/utils"
import { getDemandStatusBadge } from "@/lib/badge-utils"
import { getCountryOrDefault } from "@/lib/country"

export function BuyerView() {
    const { user } = useUser() // Fetch user via JWT cookie
    const country = getCountryOrDefault()
    const [showDemandDialog, setShowDemandDialog] = useState(false)

    // React Query hooks - automatically fetch and cache data
    const { data: savedData, isLoading: isLoadingSaved } = useSavedListings()
    const { data: contactsData, isLoading: isLoadingContacts } = useBuyerLeads(user?.id)
    const { data: demandsData, isLoading: isLoadingDemands, refetch: refetchDemands } = useBuyerDemands(user?.id)

    const savedListings = savedData?.listings ?? []
    const contactHistory = contactsData?.leads ?? []
    const demands = demandsData?.demands ?? []

    // Mutation hooks for demand operations
    const updateDemandStatus = useUpdateDemandStatus()
    const deleteDemand = useDeleteDemand()

    // Combined loading state
    const isLoading = isLoadingSaved || isLoadingContacts || isLoadingDemands

    const handleMarkFulfilled = async (demandId: string) => {
        try {
            await updateDemandStatus.mutateAsync({ id: demandId, status: "fulfilled" })
            toast.success("Demand marked as fulfilled")
        } catch (error: unknown) {
            toast.error(getErrorMessage(error))
        }
    }

    const handleCloseDemand = async (demandId: string) => {
        try {
            await updateDemandStatus.mutateAsync({ id: demandId, status: "closed" })
            toast.success("Demand closed")
        } catch (error: unknown) {
            toast.error(getErrorMessage(error))
        }
    }

    const handleDeleteDemand = async (demandId: string) => {
        try {
            await deleteDemand.mutateAsync(demandId)
            toast.success("Demand deleted")
        } catch (error: unknown) {
            toast.error(getErrorMessage(error))
        }
    }

    // Calculate demand stats
    const activeDemands = demands.filter(d => d.status === "active").length
    const assignedDemands = demands.filter(d => d.status === "assigned").length
    const fulfilledDemands = demands.filter(d => d.status === "fulfilled").length

    if (isLoading) {
        return (
            <div className="h-40 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard
                    icon={Heart}
                    label="Saved Listings"
                    value={savedData?.total ?? savedListings.length}
                    variant="purple"
                />
                <StatCard
                    icon={MessageCircle}
                    label="Contacts Made"
                    value={contactsData?.total ?? contactHistory.length}
                    variant="blue"
                />
                <StatCard
                    icon={Tag}
                    label="My Demands"
                    value={demandsData?.total ?? demands.length}
                    variant="green"
                />
                <StatCard
                    icon={Calendar}
                    label="Member Since"
                    value={user?.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "N/A"}
                    variant="amber"
                />
            </div>

            {/* Main Actions */}
            <div className="grid gap-6 sm:grid-cols-2">
                <Link href="/profile/saved">
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                        <CardContent className="p-6">
                            <Heart className="h-8 w-8 text-primary mb-3" />
                            <h3 className="font-semibold text-foreground">Saved Listings</h3>
                            <p className="text-sm text-muted-foreground mt-1">View and manage your saved business listings</p>
                            <div className="mt-4 flex items-center text-sm text-primary">
                                {savedData?.total ?? savedListings.length} saved
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/profile/contacts">
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                        <CardContent className="p-6">
                            <MessageCircle className="h-8 w-8 text-primary mb-3" />
                            <h3 className="font-semibold text-foreground">Contact History</h3>
                            <p className="text-sm text-muted-foreground mt-1">Review agents you've contacted</p>
                            <div className="mt-4 flex items-center text-sm text-primary">
                                {contactsData?.total ?? contactHistory.length} contacts
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* My Demands Section */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Tag className="h-5 w-5" />
                            My Demands
                        </CardTitle>
                        <CardDescription>Manage your business demands and see which agents have claimed them</CardDescription>
                    </div>
                    <Button onClick={() => setShowDemandDialog(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Post New Demand
                    </Button>
                </CardHeader>
                <CardContent>
                    {demands.length > 0 ? (
                        <div className="space-y-6">
                            {/* Demand Stats */}
                            <div className="flex gap-4 text-sm">
                                <span className={`px-3 py-1 rounded-full ${getDemandStatusBadge("active").className}`}>
                                    {activeDemands} {getDemandStatusBadge("active").label}
                                </span>
                                <span className={`px-3 py-1 rounded-full ${getDemandStatusBadge("assigned").className}`}>
                                    {assignedDemands} {getDemandStatusBadge("assigned").label}
                                </span>
                                <span className={`px-3 py-1 rounded-full ${getDemandStatusBadge("fulfilled").className}`}>
                                    {fulfilledDemands} {getDemandStatusBadge("fulfilled").label}
                                </span>
                            </div>

                            {/* Demands Grid */}
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {demands.map((demand) => (
                                    <DemandCard
                                        key={demand.id}
                                        demand={demand}
                                        variant="buyer"
                                        onMarkFulfilled={() => handleMarkFulfilled(demand.id)}
                                        onClose={() => handleCloseDemand(demand.id)}
                                        onDelete={() => handleDeleteDemand(demand.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <EmptyState
                            icon={Tag}
                            title="No demands posted yet"
                            description="Post a demand to let agents know what you're looking for"
                            size="sm"
                            action={{
                                label: "Post New Demand",
                                onClick: () => setShowDemandDialog(true),
                                variant: "default"
                            }}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Demand Dialog */}
            <DemandDialog
                open={showDemandDialog}
                onOpenChange={setShowDemandDialog}
                onSuccess={() => refetchDemands()}
            />

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Contacts</CardTitle>
                    <CardDescription>Your recent agent communications</CardDescription>
                </CardHeader>
                <CardContent>
                    {contactHistory.length > 0 ? (
                        <div className="space-y-4">
                            {contactHistory.slice(0, 5).map((contact) => (
                                <div key={contact.id} className="flex items-center justify-between p-4 rounded-lg bg-muted">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            {contact.interaction_type === "whatsapp" && <MessageCircle className="h-5 w-5 text-[#25D366]" />}
                                            {contact.interaction_type === "phone" && <Phone className="h-5 w-5 text-primary" />}
                                            {contact.interaction_type === "email" && <Mail className="h-5 w-5 text-primary" />}
                                        </div>
                                        <div>
                                            <p className="font-medium">{contact.listing_title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Contacted via {contact.interaction_type}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-muted-foreground">{new Date(contact.created_at).toLocaleDateString()}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={MessageCircle}
                            title="No contact history yet"
                            description=""
                            size="sm"
                            action={{
                                label: "Browse Listings",
                                onClick: () => window.location.href = `/${country}/listings`,
                                variant: "default"
                            }}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
