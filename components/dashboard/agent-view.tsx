"use client"

import { useState } from "react"
import { useUser } from "@/lib/hooks/useAuth"
import { useAgentListings } from "@/lib/hooks/useListings"
import { useAgentLeads } from "@/lib/hooks/useLeads"
import { useDemands, useAgentDemands, useClaimDemand } from "@/lib/hooks/useDemands"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/currency"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { StatCard } from "@/components/shared/stat-card"
import { EmptyState } from "@/components/shared/empty-state"
import { Building2, Plus, Eye, TrendingUp, MessageSquare, Tag, HandHelping } from "lucide-react"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { ListingDialog } from "@/components/listings/listing-dialog"
import { CreditBalanceWidget } from "@/components/dashboard/credit-balance-widget"
import { PromoteListingDialog } from "@/components/listings/promote-listing-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AgentAlerts } from "@/components/dashboard/agent-alerts"
import { AgentListingsTable } from "@/components/dashboard/agent-listings-table"
import { RecentContactsCard } from "@/components/dashboard/recent-contacts-card"
import { DemandCard } from "@/components/demands/demand-card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/utils"
import { getCountryOrDefault } from "@/lib/country"
import { businessCategories } from "@/lib/constants"
import type { Listing, DemandFilters } from "@/lib/api/types"

export function AgentView() {
    const { user } = useUser()
    const country = getCountryOrDefault()
    const [showListingDialog, setShowListingDialog] = useState(false)
    const [editingListing, setEditingListing] = useState<Listing | null>(null)
    const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")
    const [showPromoteDialog, setShowPromoteDialog] = useState(false)
    const [promotingListing, setPromotingListing] = useState<Listing | null>(null)
    const [categoryFilter, setCategoryFilter] = useState<string>("all")

    const { data: listingsData, isLoading: isLoadingListings, refetch: refetchListings } = useAgentListings(user?.id || '')
    const { data: leadsData, isLoading: isLoadingLeads } = useAgentLeads(user?.id)

    const demandFilters: DemandFilters = {
        country_code: country,
        status: "active",
        ...(categoryFilter !== "all" && { category: categoryFilter as DemandFilters["category"] }),
    }
    const { data: availableDemandsData, isLoading: isLoadingDemands } = useDemands(demandFilters)
    const { data: claimedDemandsData, isLoading: isLoadingClaimed } = useAgentDemands(user?.id)
    const claimDemand = useClaimDemand()

    const listings = listingsData?.listings ?? []
    const leads = leadsData?.leads ?? []
    const availableDemands = availableDemandsData?.demands ?? []
    const claimedDemands = claimedDemandsData?.demands ?? []

    const agentProfile = user?.agent_profile
    const isLoading = isLoadingListings || isLoadingLeads

    if (!user || user.role !== "agent") {
        return null
    }

    const activeListings = listings.filter((l) => l.status === "active")
    const totalViews = listings.reduce((acc, l) => acc + (l.view_count || 0), 0)
    const totalValue = listings.reduce((acc, l) => acc + (l.asking_price_eur || 0), 0)

    const handleClaimDemand = async (demandId: string) => {
        try {
            await claimDemand.mutateAsync(demandId)
            toast.success("Demand claimed successfully")
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to claim demand"))
        }
    }

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
                        <TabsTrigger value="demands" className="px-6 py-2 gap-2">
                            Demands
                            {availableDemandsData?.total ? (
                                <Badge variant="secondary" className="h-5 min-w-5 text-xs">
                                    {availableDemandsData.total}
                                </Badge>
                            ) : null}
                        </TabsTrigger>
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

                <TabsContent value="demands" className="space-y-6">
                    {/* Available Demands */}
                    <Card className="border-border/60 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Tag className="h-5 w-5" />
                                    Available Demands
                                </CardTitle>
                                <CardDescription>Browse active buyer demands and claim ones you can fulfill</CardDescription>
                            </div>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {businessCategories.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent>
                            {isLoadingDemands ? (
                                <div className="flex items-center justify-center py-8">
                                    <LoadingSpinner />
                                </div>
                            ) : availableDemands.length > 0 ? (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {availableDemands.map((demand) => (
                                        <DemandCard
                                            key={demand.id}
                                            demand={demand}
                                            variant="agent"
                                            onClaim={() => handleClaimDemand(demand.id)}
                                            isClaimLoading={claimDemand.isPending}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={Tag}
                                    title="No available demands"
                                    description="There are no active buyer demands in this category right now"
                                    size="sm"
                                />
                            )}
                        </CardContent>
                    </Card>

                    {/* My Claimed Demands */}
                    <Card className="border-border/60 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <HandHelping className="h-5 w-5" />
                                My Claimed Demands
                            </CardTitle>
                            <CardDescription>Demands you have claimed from buyers</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoadingClaimed ? (
                                <div className="flex items-center justify-center py-8">
                                    <LoadingSpinner />
                                </div>
                            ) : claimedDemands.length > 0 ? (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {claimedDemands.map((demand) => (
                                        <DemandCard
                                            key={demand.id}
                                            demand={demand}
                                            variant="agent-claimed"
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={HandHelping}
                                    title="No claimed demands yet"
                                    description="Claim a buyer demand above to get started"
                                    size="sm"
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
