"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/hooks/useAuth"
import { useAgentListings } from "@/lib/hooks/useListings"
import { useAgentLeads } from "@/lib/hooks/useLeads"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatCurrency, type Currency } from "@/lib/currency"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/ui/stat-card"
import { EmptyState } from "@/components/ui/empty-state"
import { Building2, Plus, Eye, TrendingUp, MessageSquare, Phone, Mail, Edit, Loader2, AlertCircle, Trash2, XCircle, Sparkles } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { ListingDialog } from "@/components/listing-dialog"
import { CreditBalanceWidget } from "@/components/credit-balance-widget"
import { PromoteListingDialog } from "@/components/promote-listing-dialog"
import { PromotionBadge } from "@/components/promotion-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
export function AgentView() {
    const router = useRouter()
    const { user } = useUser() // Fetch user via JWT cookie
    const [currency, setCurrency] = useState<Currency>("EUR")
    const [showListingDialog, setShowListingDialog] = useState(false)
    const [editingListing, setEditingListing] = useState<any | null>(null)
    const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")
    const [showPromoteDialog, setShowPromoteDialog] = useState(false)
    const [promotingListing, setPromotingListing] = useState<any | null>(null)

    // React Query hooks - automatically fetch and cache data
    const { data: listings = [], isLoading: isLoadingListings, refetch: refetchListings } = useAgentListings(user?.id || '')
    const { data: leads = [], isLoading: isLoadingLeads } = useAgentLeads(user?.id)

    // Get agent profile from user (already in React Query cache)
    const agentProfile = user?.agent_profile

    const isLoading = isLoadingListings || isLoadingLeads

    useEffect(() => {
        const saved = localStorage.getItem("currency") as Currency
        if (saved) setCurrency(saved)
    }, [])

    if (!user || user.role !== "agent") {
        return null
    }

    const agent = user

    // Stats
    const activeListings = listings.filter((l) => l.status === "active")
    const totalViews = listings.reduce((acc, l) => acc + (l.view_count || 0), 0)
    const totalValue = listings.reduce((acc, l) => acc + (l.asking_price_eur || 0), 0)

    // Determine contact icon based on lead type or contact method
    const getContactIcon = (method: string | undefined) => {
        if (!method) return <MessageSquare className="h-4 w-4" />
        const norm = method.toLowerCase()
        if (norm.includes("whatsapp")) return <MessageSquare className="h-4 w-4 text-green-600" />
        if (norm.includes("phone")) return <Phone className="h-4 w-4 text-blue-600" />
        if (norm.includes("email")) return <Mail className="h-4 w-4 text-amber-600" />
        return <MessageSquare className="h-4 w-4" />
    }

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
                    <p className="text-muted-foreground">
                        Welcome back, {agent.name?.split(" ")[0]}
                    </p>
                </div>
            </div>

            {/* Rejection Banner */}
            {agentProfile?.verification_status === "rejected" && (
                <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-300">
                    <XCircle className="h-5 w-5" />
                    <AlertTitle className="text-lg font-semibold">Your verification application was rejected</AlertTitle>
                    <AlertDescription>
                        <div className="space-y-3 mt-2">
                            <div className="bg-red-100 border border-red-200 rounded-md p-3">
                                <p className="text-sm font-medium mb-1">Rejection Reason:</p>
                                <p className="text-sm">{agentProfile.rejection_reason}</p>
                            </div>
                            <p className="text-sm">
                                Please address the issues mentioned above and update your profile in Settings, then contact support for re-verification.
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => router.push('/settings')}
                                >
                                    Go to Settings
                                </Button>
                            </div>
                        </div>
                    </AlertDescription>
                </Alert>
            )}

            {/* Missing Documents Alert */}
            {agentProfile && (!agentProfile.license_document_url || !agentProfile.company_document_url || !agentProfile.id_document_url) && agentProfile.verification_status !== "approved" && agentProfile.verification_status !== "rejected" && (
                <Alert className="bg-blue-50 text-blue-900 border-blue-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Complete Your Profile</AlertTitle>
                    <AlertDescription className="flex items-center justify-between">
                        <span>
                            Please upload your required documents to complete your profile:
                            {!agentProfile.license_document_url && " License document,"}
                            {!agentProfile.company_document_url && " Company/Agency document,"}
                            {!agentProfile.id_document_url && " ID/Passport document"}
                        </span>
                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => router.push('/settings')}
                            className="ml-4 flex-shrink-0"
                        >
                            Upload Documents
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            {/* Verification Pending Warning */}
            {agentProfile && agentProfile.verification_status === "pending" && agentProfile.license_document_url && agentProfile.company_document_url && agentProfile.id_document_url && (
                <Alert variant="destructive" className="bg-amber-50 text-amber-900 border-amber-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Account Pending Verification</AlertTitle>
                    <AlertDescription>
                        Your account is currently being reviewed by our team. You cannot create new listings until your account is verified.
                    </AlertDescription>
                </Alert>
            )}

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
                        <StatCard
                            icon={Building2}
                            label="Active Listings"
                            value={activeListings.length}
                            variant="blue"
                        />

                        <StatCard
                            icon={MessageSquare}
                            label="Total Contacts"
                            value={leads.length}
                            variant="green"
                        />

                        <StatCard
                            icon={Eye}
                            label="Total Views"
                            value={totalViews.toLocaleString()}
                            variant="indigo"
                        />

                        <StatCard
                            icon={TrendingUp}
                            label="Portfolio Value"
                            value={formatCurrency(totalValue, currency)}
                            variant="blue"
                        />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Credit Balance Widget */}
                        <CreditBalanceWidget />

                        {/* Recent Contacts */}
                        <Card className="col-span-1 border-border/60 shadow-sm">
                            <CardHeader>
                                <CardTitle>Recent Contacts</CardTitle>
                                <CardDescription>View and manage recent buyer inquiries</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {leads.length > 0 ? (
                                    <div className="space-y-4">
                                        {leads.slice(0, 5).map((lead) => (
                                            <div
                                                key={lead.id}
                                                className="flex items-center gap-4 p-3 rounded-lg border border-border/60 hover:bg-muted/30 transition-colors"
                                            >
                                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                                    {getContactIcon(lead.interaction_type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-foreground truncate">
                                                        Contact from buyer
                                                    </p>
                                                    <p className="text-sm text-muted-foreground truncate">
                                                        {lead.listing?.public_title_en || "Listing"}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant="secondary" className="capitalize font-normal">
                                                        {lead.interaction_type?.replace('_', ' ')}
                                                    </Badge>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {new Date(lead.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState
                                        icon={MessageSquare}
                                        title="No contact history yet"
                                        description=""
                                        size="sm"
                                    />
                                )}
                            </CardContent>
                        </Card>

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
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="w-[280px] pl-0">Title</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Promotion</TableHead>
                                            <TableHead>Views</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead className="text-right pr-0">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {listings.map((listing) => (
                                            <TableRow key={listing.id} className="cursor-pointer hover:bg-muted/30 border-b border-border/50">
                                                <TableCell className="font-medium text-base pl-0">
                                                    {listing.public_title_en}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={listing.status === "active" ? "default" : "secondary"}
                                                        className={cn(
                                                            "font-normal",
                                                            listing.status === "active" ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200" : ""
                                                        )}
                                                    >
                                                        {listing.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {listing.promotion_tier !== "standard" ? (
                                                        <PromotionBadge tier={listing.promotion_tier} />
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">Standard</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">{listing.view_count}</TableCell>
                                                <TableCell className="font-medium">
                                                    {formatCurrency(currency === "EUR" ? listing.asking_price_eur : listing.asking_price_lek, currency)}
                                                </TableCell>
                                                <TableCell className="text-right pr-0">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {listing.status === "active" && listing.promotion_tier !== "premium" && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="hover:bg-amber-50"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    setPromotingListing(listing)
                                                                    setShowPromoteDialog(true)
                                                                }}
                                                            >
                                                                <Sparkles className="h-4 w-4 text-amber-500" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="hover:bg-muted"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setDialogMode("edit")
                                                                setEditingListing(listing)
                                                                setShowListingDialog(true)
                                                            }}
                                                        >
                                                            <Edit className="h-4 w-4 text-muted-foreground" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
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
                    if (!open) refetchListings() // Refresh listings on close
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
                    listingTitle={promotingListing.publicTitle || promotingListing.publicTitleEn || ""}
                    currentTier={promotingListing.promotionTier}
                    onSuccess={() => refetchListings()}
                />
            )}
        </div>
    )
}
