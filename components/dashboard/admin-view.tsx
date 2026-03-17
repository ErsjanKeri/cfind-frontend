"use client"

import { useState } from "react"
import {
    useAdminStats,
    useAllUsers,
    useVerifyAgent,
    useDeleteUser,
    useToggleEmailVerification,
    usePendingListings,
    useApproveListing,
    useRejectListing,
} from "@/lib/hooks/useAdmin"
import { useDemands, useDeleteDemand } from "@/lib/hooks/useDemands"
import { CreateAgentDialog } from "@/components/admin/create-agent-dialog"
import { CreateBuyerDialog } from "@/components/admin/create-buyer-dialog"
import { RejectAgentDialog } from "@/components/admin/reject-agent-dialog"
import { AgentVerificationDialog } from "@/components/admin/agent-verification-dialog"
import { AdminAgentList } from "@/components/admin/admin-agent-list"
import { AdminBuyerList } from "@/components/admin/admin-buyer-list"
import { ListingDialog } from "@/components/listings/listing-dialog"
import { DemandCard } from "@/components/demands/demand-card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/shared/stat-card"
import { EmptyState } from "@/components/shared/empty-state"
import { AvatarWithInitials } from "@/components/shared/avatar-with-initials"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, FileText, AlertTriangle, Plus, Tag, MapPin, Pencil, Check, X } from "lucide-react"
import { getErrorMessage } from "@/lib/utils"
import { getCountryOrDefault } from "@/lib/country"
import { businessCategories, type CountryCode } from "@/lib/constants"
import { Input } from "@/components/ui/input"
import {
    useCities, useNeighbourhoods,
    useAdminCreateCity, useAdminUpdateCity,
    useAdminCreateNeighbourhood,
} from "@/lib/hooks/useGeography"
import { getDemandStatusBadge } from "@/lib/badge-utils"
import type { UserWithProfile, DemandFilters } from "@/lib/api/types"
import { getVerificationStatusBadge } from "@/lib/badge-utils"

export function AdminView() {
    const [activeTab, setActiveTab] = useState("overview")
    const country = getCountryOrDefault()
    const [demandCategoryFilter, setDemandCategoryFilter] = useState<string>("all")
    const [demandStatusFilter, setDemandStatusFilter] = useState<string>("all")

    const { data: stats } = useAdminStats()
    const { data: allUsers } = useAllUsers()

    const demandFilters: DemandFilters = {
        country_code: country,
        ...(demandStatusFilter !== "all" && { status: demandStatusFilter as DemandFilters["status"] }),
        ...(demandCategoryFilter !== "all" && { category: demandCategoryFilter as DemandFilters["category"] }),
    }
    const { data: demandsData, isLoading: isLoadingDemands } = useDemands(demandFilters)
    const deleteDemand = useDeleteDemand()

    const demands = demandsData?.demands ?? []

    const verifyAgent = useVerifyAgent()
    const deleteUser = useDeleteUser()
    const toggleEmailVerification = useToggleEmailVerification()
    const { data: pendingListingsData } = usePendingListings()
    const approveListing = useApproveListing()
    const rejectListing = useRejectListing()
    const pendingListings = pendingListingsData?.listings ?? []
    const [rejectListingDialog, setRejectListingDialog] = useState<{ open: boolean; listingId: string; title: string }>({ open: false, listingId: "", title: "" })
    const [rejectListingReason, setRejectListingReason] = useState("")

    const agents = allUsers?.filter(u => u.role === 'agent') || []
    const buyers = allUsers?.filter(u => u.role === 'buyer') || []

    const [selectedAgent, setSelectedAgent] = useState<UserWithProfile | null>(null)
    const [showAgentDialog, setShowAgentDialog] = useState(false)

    const [showCreateAgentDialog, setShowCreateAgentDialog] = useState(false)
    const [showCreateBuyerDialog, setShowCreateBuyerDialog] = useState(false)
    const [showListingDialog, setShowListingDialog] = useState(false)

    const [rejectAgentDialog, setRejectAgentDialog] = useState<{
        open: boolean
        agentId: string
        agentName: string
    }>({ open: false, agentId: "", agentName: "" })

    // Geography management state
    const [geoCountry, setGeoCountry] = useState<CountryCode>("al")
    const [selectedCityId, setSelectedCityId] = useState<number | null>(null)
    const [newCityName, setNewCityName] = useState("")
    const [newNeighbourhoodName, setNewNeighbourhoodName] = useState("")
    const [editingCityId, setEditingCityId] = useState<number | null>(null)
    const [editCityName, setEditCityName] = useState("")

    const { data: geoCitiesData } = useCities(geoCountry)
    const geoCities = geoCitiesData?.cities ?? []
    const { data: geoNeighbourhoodsData } = useNeighbourhoods(selectedCityId ?? undefined)
    const geoNeighbourhoods = geoNeighbourhoodsData?.neighbourhoods ?? []
    const selectedCity = geoCities.find((c) => c.id === selectedCityId)

    const createCity = useAdminCreateCity(geoCountry)
    const updateCity = useAdminUpdateCity(geoCountry)
    const createNeighbourhood = useAdminCreateNeighbourhood(selectedCityId ?? 0)

    const handleCreateCity = async () => {
        const name = newCityName.trim()
        if (!name) return
        try {
            await createCity.mutateAsync(name)
            setNewCityName("")
            toast.success(`City "${name}" added`)
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to add city"))
        }
    }

    const handleUpdateCity = async (cityId: number) => {
        const name = editCityName.trim()
        if (!name) return
        try {
            await updateCity.mutateAsync({ cityId, name })
            setEditingCityId(null)
            toast.success(`City renamed to "${name}"`)
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to rename city"))
        }
    }

    const handleCreateNeighbourhood = async () => {
        const name = newNeighbourhoodName.trim()
        if (!name || !selectedCityId) return
        try {
            await createNeighbourhood.mutateAsync(name)
            setNewNeighbourhoodName("")
            toast.success(`Neighbourhood "${name}" added`)
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to add neighbourhood"))
        }
    }

    const verifiedAgents = agents.filter((a) => a.verification_status === "approved")
    const pendingAgents = agents.filter((a) => a.verification_status === "pending")

    const handleVerifyAgent = async (agent: UserWithProfile) => {
        setShowAgentDialog(false)
        setSelectedAgent(null)

        try {
            await verifyAgent.mutateAsync(agent.id)
            toast.success("Agent verified successfully")
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to verify agent"))
        }
    }

    const handleDeleteUser = async (user: UserWithProfile) => {
        setShowAgentDialog(false)
        setSelectedAgent(null)

        try {
            await deleteUser.mutateAsync(user.id)
            toast.success(`${user.role === "agent" ? "Agent" : "Buyer"} deleted successfully`)
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, `Failed to delete ${user.role}`))
        }
    }

    const handleToggleEmailVerification = async (user: UserWithProfile) => {
        const newVerifiedStatus = !user.email_verified
        try {
            await toggleEmailVerification.mutateAsync({
                userId: user.id,
                emailVerified: newVerifiedStatus
            })
            toast.success(newVerifiedStatus ? "Email marked as verified" : "Email marked as unverified")
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to update email verification"))
        }
    }

    const handleDeleteDemand = async (demandId: string) => {
        try {
            await deleteDemand.mutateAsync(demandId)
            toast.success("Demand deleted")
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to delete demand"))
        }
    }

    const openVerifyDialog = (agent: UserWithProfile) => {
        setSelectedAgent(agent)
        setShowAgentDialog(true)
    }

    const openRejectDialog = (agent: UserWithProfile) => {
        setRejectAgentDialog({
            open: true,
            agentId: agent.id,
            agentName: agent.name || agent.email,
        })
    }

    return (
        <div className="space-y-6">
            {/* Page Title & Stats */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
                    <p className="text-muted-foreground">Manage agents, buyers, and platform operations</p>
                </div>
                <Button onClick={() => setShowListingDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Listing
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    icon={Users}
                    label="Total Agents"
                    value={stats?.total_agents || 0}
                    footer={`${verifiedAgents.length} verified, ${pendingAgents.length} pending`}
                    variant="blue"
                />
                <StatCard
                    icon={Users}
                    label="Total Buyers"
                    value={stats?.total_buyers || 0}
                    footer="Registered buyers on platform"
                    variant="green"
                />
                <StatCard
                    icon={FileText}
                    label="Active Listings"
                    value={stats?.active_listings || 0}
                    footer="Total listings on platform"
                    variant="purple"
                />
                <StatCard
                    icon={FileText}
                    label="Total Demands"
                    value={stats?.total_demands || 0}
                    footer={`${stats?.active_demands || 0} active, ${stats?.assigned_demands || 0} assigned`}
                    variant="amber"
                />
            </div>

            {/* Pending Verifications Alert */}
            {pendingAgents.length > 0 && (
                <Card className="border-amber-300 bg-amber-50/50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                            <div>
                                <p className="font-medium text-amber-800">Verifications Pending</p>
                                <p className="text-sm text-amber-700">
                                    {pendingAgents.length} agent(s) awaiting your review
                                </p>
                            </div>
                            <div className="ml-auto flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => setActiveTab("agents")}>
                                    Review Agents
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-muted/60 p-1 h-auto mb-6">
                    <TabsTrigger value="overview" className="px-6 py-2">Overview</TabsTrigger>
                    <TabsTrigger value="agents" className="px-6 py-2 gap-2">
                        Agents
                        {pendingAgents.length > 0 && (
                            <Badge variant="secondary" className="h-5 min-w-5 text-xs">
                                {pendingAgents.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="buyers" className="px-6 py-2">Buyers</TabsTrigger>
                    <TabsTrigger value="demands" className="px-6 py-2 gap-2">
                        Demands
                        {(stats?.total_demands ?? 0) > 0 && (
                            <Badge variant="secondary" className="h-5 min-w-5 text-xs">
                                {stats?.total_demands}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="listings" className="px-6 py-2 gap-2">
                        Listings
                        {pendingListings.length > 0 && (
                            <Badge variant="secondary" className="h-5 min-w-5 text-xs">
                                {pendingListings.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="geography" className="px-6 py-2">Geography</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Recent Agents</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {agents.slice(0, 5).map((agent) => {
                                        const vBadge = getVerificationStatusBadge(agent.verification_status || "pending")
                                        return (
                                            <div key={agent.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                                                <AvatarWithInitials
                                                    name={agent.name}
                                                    src={agent.image}
                                                    className="h-10 w-10"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">{agent.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{agent.company_name}</p>
                                                </div>
                                                <Badge className={vBadge.className}>{vBadge.label}</Badge>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="agents">
                    <AdminAgentList
                        agents={agents}
                        onView={openVerifyDialog}
                        onVerify={openVerifyDialog}
                        onReject={openRejectDialog}
                        onDelete={handleDeleteUser}
                        onToggleEmail={handleToggleEmailVerification}
                        onCreateAgent={() => setShowCreateAgentDialog(true)}
                    />
                </TabsContent>

                <TabsContent value="buyers">
                    <AdminBuyerList
                        buyers={buyers}
                        onDelete={handleDeleteUser}
                        onToggleEmail={handleToggleEmailVerification}
                        onCreateBuyer={() => setShowCreateBuyerDialog(true)}
                    />
                </TabsContent>

                <TabsContent value="demands" className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h3 className="text-xl font-semibold tracking-tight">All Demands</h3>
                            <p className="text-sm text-muted-foreground mt-1">View and manage buyer demands across the platform</p>
                        </div>
                        <div className="flex gap-3">
                            <Select value={demandStatusFilter} onValueChange={setDemandStatusFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="assigned">Assigned</SelectItem>
                                    <SelectItem value="fulfilled">Fulfilled</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={demandCategoryFilter} onValueChange={setDemandCategoryFilter}>
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
                        </div>
                    </div>

                    {/* Status Summary Pills */}
                    {(stats?.total_demands ?? 0) > 0 && (
                        <div className="flex flex-wrap gap-3 text-sm">
                            <span className={`px-3 py-1 rounded-full ${getDemandStatusBadge("active").className}`}>
                                {stats?.active_demands || 0} {getDemandStatusBadge("active").label}
                            </span>
                            <span className={`px-3 py-1 rounded-full ${getDemandStatusBadge("assigned").className}`}>
                                {stats?.assigned_demands || 0} {getDemandStatusBadge("assigned").label}
                            </span>
                            <span className={`px-3 py-1 rounded-full ${getDemandStatusBadge("fulfilled").className}`}>
                                {stats?.fulfilled_demands || 0} {getDemandStatusBadge("fulfilled").label}
                            </span>
                        </div>
                    )}

                    <Card className="border-border/60 shadow-sm">
                        <CardContent className="p-6">
                            {isLoadingDemands ? (
                                <div className="flex items-center justify-center py-8">
                                    <LoadingSpinner />
                                </div>
                            ) : demands.length > 0 ? (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {demands.map((demand) => (
                                        <DemandCard
                                            key={demand.id}
                                            demand={demand}
                                            variant="buyer"
                                            onDelete={() => handleDeleteDemand(demand.id)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={Tag}
                                    title="No demands found"
                                    description="No demands match the selected filters"
                                    size="lg"
                                />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Listings Tab */}
                <TabsContent value="listings" className="space-y-4">
                    {pendingListings.length === 0 ? (
                        <EmptyState
                            icon={FileText}
                            title="No pending listings"
                            description="All listings have been reviewed"
                        />
                    ) : (
                        pendingListings.map((listing) => (
                            <Card key={listing.id}>
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-foreground">{listing.public_title_en}</p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {listing.category} &middot; {listing.public_location_city_en}
                                                {listing.public_location_area && `, ${listing.public_location_area}`}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Agent: {listing.agent_name} {listing.agent_agency_name && `(${listing.agent_agency_name})`}
                                            </p>
                                            <p className="text-sm font-medium mt-1">
                                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(listing.asking_price_eur)}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 flex-shrink-0">
                                            <Button
                                                size="sm"
                                                onClick={async () => {
                                                    try {
                                                        await approveListing.mutateAsync(listing.id)
                                                        toast.success("Listing approved")
                                                    } catch (error: unknown) {
                                                        toast.error(getErrorMessage(error, "Failed to approve"))
                                                    }
                                                }}
                                                disabled={approveListing.isPending}
                                            >
                                                <Check className="h-4 w-4 mr-1" />
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => setRejectListingDialog({ open: true, listingId: listing.id, title: listing.public_title_en })}
                                            >
                                                <X className="h-4 w-4 mr-1" />
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}

                    {rejectListingDialog.open && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                            <Card className="w-full max-w-md mx-4">
                                <CardHeader>
                                    <CardTitle>Reject Listing</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        Rejecting: <strong>{rejectListingDialog.title}</strong>
                                    </p>
                                    <Input
                                        placeholder="Reason for rejection..."
                                        value={rejectListingReason}
                                        onChange={(e) => setRejectListingReason(e.target.value)}
                                    />
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => { setRejectListingDialog({ open: false, listingId: "", title: "" }); setRejectListingReason("") }}>
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            disabled={!rejectListingReason.trim() || rejectListing.isPending}
                                            onClick={async () => {
                                                try {
                                                    await rejectListing.mutateAsync({ listingId: rejectListingDialog.listingId, reason: rejectListingReason.trim() })
                                                    toast.success("Listing rejected")
                                                    setRejectListingDialog({ open: false, listingId: "", title: "" })
                                                    setRejectListingReason("")
                                                } catch (error: unknown) {
                                                    toast.error(getErrorMessage(error, "Failed to reject"))
                                                }
                                            }}
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="geography" className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold tracking-tight">Geography</h3>
                        <p className="text-sm text-muted-foreground mt-1">Manage cities and neighbourhoods per country</p>
                    </div>

                    {/* Country selector */}
                    <Select value={geoCountry} onValueChange={(v) => { setGeoCountry(v as CountryCode); setSelectedCityId(null); setEditingCityId(null); setNewCityName(""); setNewNeighbourhoodName("") }}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="al">Albania</SelectItem>
                            <SelectItem value="ae">UAE</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Cities panel */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Cities
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {geoCities.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No cities yet.</p>
                                ) : (
                                    <div className="space-y-1">
                                        {geoCities.map((city) => (
                                            <div key={city.id}>
                                                {editingCityId === city.id ? (
                                                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-muted/60">
                                                        <Input
                                                            autoFocus
                                                            value={editCityName}
                                                            onChange={(e) => setEditCityName(e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") handleUpdateCity(city.id)
                                                                if (e.key === "Escape") setEditingCityId(null)
                                                            }}
                                                            className="h-7 text-sm"
                                                        />
                                                        <button
                                                            onClick={() => handleUpdateCity(city.id)}
                                                            disabled={!editCityName.trim() || updateCity.isPending}
                                                            className="text-muted-foreground hover:text-primary transition-colors p-1"
                                                            aria-label="Confirm rename"
                                                        >
                                                            <Check className="h-3.5 w-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingCityId(null)}
                                                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                                                            aria-label="Cancel rename"
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div
                                                        onClick={() => setSelectedCityId(city.id === selectedCityId ? null : city.id)}
                                                        className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors ${
                                                            city.id === selectedCityId
                                                                ? "bg-primary/10 text-primary"
                                                                : "hover:bg-muted/60"
                                                        }`}
                                                    >
                                                        <span className="text-sm font-medium">{city.name}</span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setEditingCityId(city.id)
                                                                setEditCityName(city.name)
                                                            }}
                                                            className="text-muted-foreground hover:text-foreground transition-colors p-1"
                                                            aria-label={`Rename ${city.name}`}
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Add city */}
                                <div className="flex gap-2 pt-2 border-t">
                                    <Input
                                        placeholder="City name"
                                        value={newCityName}
                                        onChange={(e) => setNewCityName(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleCreateCity()}
                                        className="h-8 text-sm"
                                    />
                                    <Button
                                        size="sm"
                                        aria-label="Add city"
                                        onClick={handleCreateCity}
                                        disabled={!newCityName.trim() || createCity.isPending}
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Neighbourhoods panel */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">
                                    {selectedCity ? `Neighbourhoods — ${selectedCity.name}` : "Neighbourhoods"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {!selectedCity ? (
                                    <p className="text-sm text-muted-foreground">Select a city to manage its neighbourhoods.</p>
                                ) : geoNeighbourhoods.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No neighbourhoods yet.</p>
                                ) : (
                                    <div className="space-y-1">
                                        {geoNeighbourhoods.map((n) => (
                                            <div key={n.id} className="px-3 py-2 rounded-md hover:bg-muted/60">
                                                <span className="text-sm">{n.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {selectedCity && (
                                    <div className="flex gap-2 pt-2 border-t">
                                        <Input
                                            placeholder="Neighbourhood name"
                                            value={newNeighbourhoodName}
                                            onChange={(e) => setNewNeighbourhoodName(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleCreateNeighbourhood()}
                                            className="h-8 text-sm"
                                        />
                                        <Button
                                            size="sm"
                                            aria-label="Add neighbourhood"
                                            onClick={handleCreateNeighbourhood}
                                            disabled={!newNeighbourhoodName.trim() || createNeighbourhood.isPending}
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Dialogs */}
            <AgentVerificationDialog
                open={showAgentDialog}
                onOpenChange={setShowAgentDialog}
                agent={selectedAgent}
                onVerify={handleVerifyAgent}
            />

            <CreateAgentDialog
                open={showCreateAgentDialog}
                onOpenChange={setShowCreateAgentDialog}
            />

            <CreateBuyerDialog
                open={showCreateBuyerDialog}
                onOpenChange={setShowCreateBuyerDialog}
            />

            <RejectAgentDialog
                open={rejectAgentDialog.open}
                onOpenChange={(open) =>
                    setRejectAgentDialog({ ...rejectAgentDialog, open })
                }
                agentId={rejectAgentDialog.agentId}
                agentName={rejectAgentDialog.agentName}
            />

            <ListingDialog
                open={showListingDialog}
                onOpenChange={setShowListingDialog}
                mode="create"
            />
        </div>
    )
}
