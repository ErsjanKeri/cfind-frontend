"use client"

import { useState } from "react"
import { useUser } from "@/lib/hooks/useAuth"
import { useAgentListings } from "@/lib/hooks/useListings"
import { useAgentLeads } from "@/lib/hooks/useLeads"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/currency"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/shared/stat-card"
import { EmptyState } from "@/components/shared/empty-state"
import { Building2, Plus, Eye, TrendingUp, MessageSquare } from "lucide-react"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { ListingDialog } from "@/components/listings/listing-dialog"
import { CreditBalanceWidget } from "@/components/dashboard/credit-balance-widget"
import { PromoteListingDialog } from "@/components/listings/promote-listing-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AgentAlerts } from "@/components/dashboard/agent-alerts"
import { AgentListingsTable } from "@/components/dashboard/agent-listings-table"
import { RecentContactsCard } from "@/components/dashboard/recent-contacts-card"
import type { Listing } from "@/lib/api/types"

export function AgentView() {
    const { user } = useUser()
    const [showListingDialog, setShowListingDialog] = useState(false)
    const [editingListing, setEditingListing] = useState<Listing | null>(null)
    const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")
    const [showPromoteDialog, setShowPromoteDialog] = useState(false)
    const [promotingListing, setPromotingListing] = useState<Listing | null>(null)

    const { data: listings = [], isLoading: isLoadingListings, refetch: refetchListings } = useAgentListings(user?.id || '')
    const { data: leads = [], isLoading: isLoadingLeads } = useAgentLeads(user?.id)

    const agentProfile = user?.agent_profile
    const isLoading = isLoadingListings || isLoadingLeads

    if (!user || user.role !== "agent") {
        return null
    }

    const activeListings = listings.filter((l) => l.status === "active")
    const totalViews = listings.reduce((acc, l) => acc + (l.view_count || 0), 0)
    const totalValue = listings.reduce((acc, l) => acc + (l.asking_price_eur || 0), 0)

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
                    <p className="text-muted-foreground">
                        Welcome back, {user.name?.split(" ")[0]}
                    </p>
                </div>
            </div>

            <AgentAlerts agentProfile={agentProfile} />

            <Tabs defaultValue="overview" className="space-y-6">
                <div className="flex items-center">
                    <TabsList className="bg-muted/60 p-1 h-auto">
                        <TabsTrigger value="overview" className="px-6 py-2">Overview</TabsTrigger>
                        <TabsTrigger value="listings" className="px-6 py-2">Listings</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="overview" className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard icon={Building2} label="Active Listings" value={activeListings.length} variant="blue" />
                        <StatCard icon={MessageSquare} label="Total Contacts" value={leads.length} variant="green" />
                        <StatCard icon={Eye} label="Total Views" value={totalViews.toLocaleString()} variant="indigo" />
                        <StatCard icon={TrendingUp} label="Portfolio Value" value={formatCurrency(totalValue, "EUR")} variant="blue" />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        <CreditBalanceWidget />
                        <RecentContactsCard leads={leads} />

                        {/* Performance Tips */}
                        <Card className="col-span-1 border-border/60 shadow-sm">
                            <CardHeader>
                                <CardTitle>Performance Tips</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-muted/40 border border-border/50">
                                        <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            Update Listings Regularly
                                        </h4>
                                        <p className="text-sm text-muted-foreground pl-3.5 border-l-2 border-primary/20">Keep your listings fresh with updated photos and descriptions to attract more buyers</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-muted/40 border border-border/50">
                                        <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                            Respond Quickly
                                        </h4>
                                        <p className="text-sm text-muted-foreground pl-3.5 border-l-2 border-green-500/20">Fast response times lead to higher conversion rates and better buyer satisfaction</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="listings" className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h3 className="text-xl font-semibold tracking-tight">Your Listings</h3>
                            <p className="text-sm text-muted-foreground mt-1">Manage and edit your business listings</p>
                        </div>
                        {agentProfile?.verification_status === "approved" && (
                            <Button
                                onClick={() => {
                                    setDialogMode("create")
                                    setEditingListing(null)
                                    setShowListingDialog(true)
                                }}
                                className="shadow-sm"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Create Listing
                            </Button>
                        )}
                    </div>

                    <Card className="border-border/60 shadow-sm overflow-hidden">
                        <CardContent className="p-6">
                            {listings.length > 0 ? (
                                <AgentListingsTable
                                    listings={listings}
                                    onEdit={(listing) => {
                                        setDialogMode("edit")
                                        setEditingListing(listing)
                                        setShowListingDialog(true)
                                    }}
                                    onPromote={(listing) => {
                                        setPromotingListing(listing)
                                        setShowPromoteDialog(true)
                                    }}
                                />
                            ) : (
                                <EmptyState
                                    icon={Building2}
                                    title="No listings yet"
                                    description="Create your first listing to get started"
                                    size="lg"
                                    action={agentProfile?.verification_status === "approved" ? {
                                        label: "Create Listing",
                                        onClick: () => {
                                            setDialogMode("create")
                                            setEditingListing(null)
                                            setShowListingDialog(true)
                                        },
                                        icon: Plus,
                                        variant: "outline"
                                    } : undefined}
                                />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <ListingDialog
                open={showListingDialog}
                onOpenChange={(open) => {
                    setShowListingDialog(open)
                    if (!open) refetchListings()
                }}
                mode={dialogMode}
                listing={editingListing}
            />

            {promotingListing && (
                <PromoteListingDialog
                    open={showPromoteDialog}
                    onOpenChange={(open) => {
                        setShowPromoteDialog(open)
                        if (!open) setPromotingListing(null)
                    }}
                    listingId={promotingListing.id}
                    listingTitle={promotingListing.public_title_en || ""}
                    currentTier={promotingListing.promotion_tier}
                    onSuccess={() => refetchListings()}
                />
            )}
        </div>
    )
}
