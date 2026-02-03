"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/hooks/useAuth"
import {
    useAdminStats,
    useAllUsers,
    useVerifyAgent,
    useRejectAgent,
    useDeleteUser,
    useToggleEmailVerification,
    useCreateBuyer
} from "@/lib/hooks/useAdmin"
import { useDeleteListing } from "@/lib/hooks/useListings"
import { formatCurrency, type Currency } from "@/lib/currency"
// Import specific dialogs
import { CreateAgentDialog } from "@/components/admin/create-agent-dialog"
import { EditAgentDialog } from "@/components/admin/edit-agent-dialog"
import { RejectAgentDialog } from "@/components/admin/reject-agent-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { ListingForm } from "@/components/listing-form"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/ui/stat-card"
import { AvatarWithInitials } from "@/components/ui/avatar-with-initials"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Building2,
    Users,
    FileText,
    ShieldCheck,
    Search,
    MoreVertical,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    Ban,
    DollarSign,
    AlertTriangle,
    Trash2,
} from "lucide-react"
import { getListingStatusBadge } from "@/lib/badge-utils"
// Types now imported from API types - using UserWithProfile instead

export function AdminView() {
    const router = useRouter()
    const [currency, setCurrency] = useState<Currency>("EUR")
    const [activeTab, setActiveTab] = useState("overview")
    const [searchQuery, setSearchQuery] = useState("")

    // Phase 5: Use React Query hooks to fetch from backend API
    const { data: stats, isLoading: statsLoading } = useAdminStats()
    const { data: allUsers, isLoading: usersLoading } = useAllUsers()

    // Mutation hooks for admin operations
    const verifyAgent = useVerifyAgent()
    const rejectAgent = useRejectAgent()
    const deleteUser = useDeleteUser()
    const toggleEmailVerification = useToggleEmailVerification()
    const deleteListing = useDeleteListing()
    const createBuyer = useCreateBuyer()

    // Separate users by role
    const agents = allUsers?.filter(u => u.role === 'agent') || []
    const buyers = allUsers?.filter(u => u.role === 'buyer') || []

    // For now, listings are empty (will migrate listing pages separately)
    const [listings, setListings] = useState<any[]>([])
    const loading = statsLoading || usersLoading

    const [selectedAgent, setSelectedAgent] = useState<any | null>(null)
    const [showAgentDialog, setShowAgentDialog] = useState(false)

    const [showCreateAgentDialog, setShowCreateAgentDialog] = useState(false)
    const [showCreateBuyerDialog, setShowCreateBuyerDialog] = useState(false)
    const [createBuyerData, setCreateBuyerData] = useState({
        name: "",
        email: "",
        companyName: "",
        password: "temp1234(default)"
    })

    const [showCreateListingDialog, setShowCreateListingDialog] = useState(false)
    const [showEditListingDialog, setShowEditListingDialog] = useState(false)
    const [editListingData, setEditListingData] = useState<any | null>(null)

    const [showEditAgentDialog, setShowEditAgentDialog] = useState(false)
    const [editAgentData, setEditAgentData] = useState<any | null>(null)

    const [rejectAgentDialog, setRejectAgentDialog] = useState<{
        open: boolean
        agentId: string
        agentName: string
    }>({ open: false, agentId: "", agentName: "" })

    const [deleteListingDialog, setDeleteListingDialog] = useState<{
        open: boolean
        listingId: string
        listingTitle: string
    }>({ open: false, listingId: "", listingTitle: "" })
    const [isDeleting, setIsDeleting] = useState(false)

    // Phase 5: Removed old data fetching - now using React Query hooks above
    // Data automatically loads and updates via useAdminStats() and useAllUsers()

    useEffect(() => {
        const saved = localStorage.getItem("currency") as Currency
        if (saved) setCurrency(saved)
    }, [])

    // Filter agents by verification status (from backend data)
    const verifiedAgents = agents.filter((a) => a.agent_profile?.verification_status === "approved")
    const pendingAgents = agents.filter((a) => a.agent_profile?.verification_status === "pending")
    const rejectedAgents = agents.filter((a) => a.agent_profile?.verification_status === "rejected")
    const unverifiedAgents = pendingAgents // For backward compatibility with existing code
    const activeListings = listings.filter((l) => l.status === "active")
    const totalPortfolioValue = activeListings.reduce((sum, l) => sum + l.askingPrice, 0)

    const handleVerifyAgent = async (agent: any) => {
        setShowAgentDialog(false)
        setSelectedAgent(null)

        try {
            await verifyAgent.mutateAsync(agent.id)
            toast({
                title: "Success",
                description: "Agent verified successfully",
            })
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to verify agent",
                variant: "destructive",
            })
        }
    }

    const handleDeleteAgent = async (agent: any) => {
        setShowAgentDialog(false)
        setSelectedAgent(null)

        try {
            await deleteUser.mutateAsync(agent.id)
            toast({
                title: "Success",
                description: "Agent deleted successfully",
            })
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete agent",
                variant: "destructive",
            })
        }
    }

    const handleDeleteListing = async () => {
        setIsDeleting(true)
        try {
            await deleteListing.mutateAsync(deleteListingDialog.listingId)
            toast({
                title: "Success",
                description: "Listing deleted successfully",
            })
            setDeleteListingDialog({ open: false, listingId: "", listingTitle: "" })
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete listing",
                variant: "destructive",
            })
        } finally {
            setIsDeleting(false)
        }
    }


    return (
        <div className="space-y-6">
            {/* Page Title & Stats */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
                <p className="text-muted-foreground">Manage agents, buyers, and platform operations</p>
            </div>

            {/* Stats Overview - Using Backend API Data */}
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
                    footer={`Total listings on platform`}
                    variant="purple"
                />

                <StatCard
                    icon={DollarSign}
                    label="Portfolio Value"
                    value={`€${stats?.total_revenue_eur || 0}`}
                    footer="Total platform value"
                    variant="amber"
                />
            </div>

            {/* Pending Verifications Alert */}
            {unverifiedAgents.length > 0 && (
                <Card className="border-amber-300 bg-amber-50/50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                            <div>
                                <p className="font-medium text-amber-800">Verifications Pending</p>
                                <p className="text-sm text-amber-700">
                                    {unverifiedAgents.length} agent(s) awaiting your review
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
                <TabsList className="mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="agents" className="gap-2">
                        Agents
                        {unverifiedAgents.length > 0 && (
                            <Badge variant="secondary" className="h-5 min-w-5 text-xs">
                                {unverifiedAgents.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="buyers">
                        Buyers
                    </TabsTrigger>
                    <TabsTrigger value="listings">Listings</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview">
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Recent Agents */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Recent Agents</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {agents.slice(0, 5).map((agent) => (
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
                                            {agent.agent_profile?.verification_status === "approved" && (
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Verified</Badge>
                                            )}
                                            {agent.agent_profile?.verification_status === "pending" && (
                                                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pending</Badge>
                                            )}
                                            {agent.agent_profile?.verification_status === "rejected" && (
                                                <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Listings */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Recent Listings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {listings.slice(0, 5).map((listing) => (
                                        <div key={listing.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                                            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                                <FileText className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{listing.public_title_en}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatCurrency(currency === "EUR" ? listing.asking_price_eur : listing.asking_price_lek, currency)}
                                                </p>
                                            </div>
                                            <Badge
                                                className={
                                                    listing.status === "active"
                                                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                                                        : "bg-muted text-muted-foreground hover:bg-muted"
                                                }
                                            >
                                                {listing.status}
                                            </Badge>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setEditListingData(listing)
                                                        setShowEditListingDialog(true)
                                                    }}
                                                >
                                                    <FileText className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setDeleteListingDialog({
                                                            open: true,
                                                            listingId: listing.id,
                                                            listingTitle: listing.public_title_en
                                                        })
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Agents Tab */}
                <TabsContent value="agents">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="relative max-w-md flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search agents..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button onClick={() => setShowCreateAgentDialog(true)} className="ml-4">
                            <Users className="h-4 w-4 mr-2" />
                            Add Agent
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {agents
                            .filter(
                                (a) =>
                                    searchQuery === "" ||
                                    (a.name && a.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                    a.email.toLowerCase().includes(searchQuery.toLowerCase()),
                            )
                            .map((agent) => (
                                <Card key={agent.id} className={
                                    agent.agent_profile?.verification_status === "rejected"
                                        ? "border-red-300 bg-red-50/30"
                                        : agent.agent_profile?.verification_status === "pending"
                                        ? "border-amber-300 bg-amber-50/30"
                                        : ""
                                }>
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            <AvatarWithInitials
                                                name={agent.name}
                                                src={agent.image}
                                                className="h-12 w-12"
                                            />

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold">{agent.name}</h3>
                                                    {agent.agent_profile?.verification_status === "approved" && (
                                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                                                            <ShieldCheck className="h-3 w-3" />
                                                            Verified
                                                        </Badge>
                                                    )}
                                                    {agent.agent_profile?.verification_status === "pending" && (
                                                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            Pending Verification
                                                        </Badge>
                                                    )}
                                                    {agent.agent_profile?.verification_status === "rejected" && (
                                                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 gap-1">
                                                            <XCircle className="h-3 w-3" />
                                                            Rejected
                                                        </Badge>
                                                    )}
                                                    {agent.email_verified ? (
                                                        <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                                                            Email Verified
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
                                                            Email Unverified
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">{agent.email}</p>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                                    <span>{agent.company_name}</span>
                                                    <span>License: {agent.agent_profile?.license_number || "N/A"}</span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    {agent.agent_profile?.license_document_url ? (
                                                        <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                                                            <FileText className="h-3 w-3 mr-1" />
                                                            License
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                                                            <XCircle className="h-3 w-3 mr-1" />
                                                            No License
                                                        </Badge>
                                                    )}
                                                    {agent.agent_profile?.company_document_url ? (
                                                        <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                                                            <Building2 className="h-3 w-3 mr-1" />
                                                            Company
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                                                            <XCircle className="h-3 w-3 mr-1" />
                                                            No Company
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {agent.agent_profile?.verification_status === "pending" && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedAgent(agent)
                                                                setShowAgentDialog(true)
                                                            }}
                                                        >
                                                            <CheckCircle className="h-4 w-4 mr-1" />
                                                            Verify
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => setRejectAgentDialog({
                                                                open: true,
                                                                agentId: agent.id,
                                                                agentName: agent.name || agent.email
                                                            })}
                                                        >
                                                            <XCircle className="h-4 w-4 mr-1" />
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}
                                                {agent.agent_profile?.verification_status === "rejected" && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedAgent(agent)
                                                            setShowAgentDialog(true)
                                                        }}
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                        Approve
                                                    </Button>
                                                )}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => {
                                                            setSelectedAgent(agent)
                                                            setShowAgentDialog(true)
                                                        }}>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Profile
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => {
                                                            setSelectedAgent(agent)
                                                            setShowAgentDialog(true)
                                                        }}>
                                                            <FileText className="h-4 w-4 mr-2" />
                                                            View Documents
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => {
                                                            setEditAgentData(agent)
                                                            setShowEditAgentDialog(true)
                                                        }}>
                                                            <Building2 className="h-4 w-4 mr-2" />
                                                            Edit Agent
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={async () => {
                                                            const newVerifiedStatus = !agent.email_verified
                                                            try {
                                                                await toggleEmailVerification.mutateAsync({
                                                                    userId: agent.id,
                                                                    emailVerified: newVerifiedStatus
                                                                })
                                                                toast({
                                                                    title: "Success",
                                                                    description: newVerifiedStatus ? "Email marked as verified" : "Email marked as unverified",
                                                                })
                                                            } catch (error: any) {
                                                                toast({
                                                                    title: "Error",
                                                                    description: error.message || "Failed to update email verification",
                                                                    variant: "destructive",
                                                                })
                                                            }
                                                        }}>
                                                            <CheckCircle className="h-4 w-4 mr-2" />
                                                            {agent.email_verified ? "Mark Email Unverified" : "Mark Email Verified"}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteAgent(agent)}>
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete Agent
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                    </div>
                </TabsContent>

                {/* Buyers Tab */}
                <TabsContent value="buyers">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="relative max-w-md flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search buyers..."
                                className="pl-10 mr-4"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button onClick={() => setShowCreateBuyerDialog(true)} className="ml-4">
                            <Building2 className="h-4 w-4 mr-2" />
                            Add Buyer
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {buyers
                            .filter(
                                (b) =>
                                    searchQuery === "" ||
                                    (b.name && b.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                    b.email.toLowerCase().includes(searchQuery.toLowerCase()),
                            )
                            .map((buyer) => (
                                <Card key={buyer.id}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            <AvatarWithInitials
                                                name={buyer.name}
                                                src={buyer.image}
                                                className="h-12 w-12"
                                            />

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold">{buyer.name}</h3>
                                                    {buyer.email_verified ? (
                                                        <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                                                            Email Verified
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
                                                            Email Unverified
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">{buyer.email}</p>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                                    {buyer.company_name && <span>{buyer.company_name}</span>}
                                                    {buyer.phone_number && <span>{buyer.phone_number}</span>}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={async () => {
                                                            const newVerifiedStatus = !buyer.email_verified
                                                            try {
                                                                await toggleEmailVerification.mutateAsync({
                                                                    userId: buyer.id,
                                                                    emailVerified: newVerifiedStatus
                                                                })
                                                                toast({
                                                                    title: "Success",
                                                                    description: newVerifiedStatus ? "Email marked as verified" : "Email marked as unverified",
                                                                })
                                                            } catch (error: any) {
                                                                toast({
                                                                    title: "Error",
                                                                    description: error.message || "Failed to update email verification",
                                                                    variant: "destructive",
                                                                })
                                                            }
                                                        }}>
                                                            <CheckCircle className="h-4 w-4 mr-2" />
                                                            {buyer.email_verified ? "Mark Email Unverified" : "Mark Email Verified"}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive">
                                                            <Ban className="h-4 w-4 mr-2" />
                                                            Suspend Buyer
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                    </div>
                </TabsContent>

                {/* Listings Tab */}
                <TabsContent value="listings">
                    <div className="mb-4">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search listings..." className="pl-10" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {listings.map((listing) => (
                            <Card key={listing.id}>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-24 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                                            <img
                                                src={listing.images[0]?.url || "/placeholder.svg"}
                                                alt={listing.public_title_en}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold truncate">{listing.public_title_en}</h3>
                                                <Badge className={getListingStatusBadge(listing.status as any).className}>
                                                    {getListingStatusBadge(listing.status as any).label}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {listing.public_location_area && `${listing.public_location_area}, `}{listing.public_location_city_en}
                                            </p>
                                            <div className="flex items-center gap-4 mt-1 text-sm">
                                                <span className="font-medium">
                                                    {formatCurrency(currency === "EUR" ? listing.asking_price_eur : listing.asking_price_lek, currency)}
                                                </span>
                                                <span className="text-muted-foreground">by {listing.agent_name}</span>
                                                <span className="text-muted-foreground">{listing.view_count} views</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/listings/${listing.id}`}>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Listing
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => {
                                                            setDeleteListingDialog({
                                                                open: true,
                                                                listingId: listing.id,
                                                                listingTitle: listing.public_title_en
                                                            })
                                                        }}
                                                    >
                                                        <Ban className="h-4 w-4 mr-2" />
                                                        Delete Listing
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Agent Verification Dialog */}
            <Dialog open={showAgentDialog} onOpenChange={setShowAgentDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Verify Agent</DialogTitle>
                        <DialogDescription>Review the agent's credentials before approving their account.</DialogDescription>
                    </DialogHeader>
                    {selectedAgent && (
                        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
                            <div className="flex items-center gap-4">
                                <AvatarWithInitials
                                    name={selectedAgent.name}
                                    src={selectedAgent.avatar}
                                    className="h-16 w-16"
                                    fallbackClassName="bg-primary/10 text-primary text-xl"
                                />
                                <div>
                                    <h3 className="font-semibold text-lg">{selectedAgent.name}</h3>
                                    <p className="text-muted-foreground">{selectedAgent.email}</p>
                                </div>
                            </div>

                            {/* Agency & License */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg bg-muted/50">
                                    <p className="text-xs text-muted-foreground uppercase">Agency</p>
                                    <p className="font-medium">{selectedAgent.agency || selectedAgent.agencyName || "N/A"}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/50">
                                    <p className="text-xs text-muted-foreground uppercase">License</p>
                                    <p className="font-medium">{selectedAgent.licenseNumber || "N/A"}</p>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg bg-muted/50">
                                    <p className="text-xs text-muted-foreground uppercase">Phone</p>
                                    <p className="font-medium">{selectedAgent.phone || "N/A"}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/50">
                                    <p className="text-xs text-muted-foreground uppercase">WhatsApp</p>
                                    <p className="font-medium">{selectedAgent.whatsapp || "N/A"}</p>
                                </div>
                            </div>

                            {/* Verification Documents */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold">Verification Documents</p>
                                    {selectedAgent.licenseDocumentUrl && selectedAgent.companyDocumentUrl && selectedAgent.idDocumentUrl && (
                                        <Badge variant="outline" className="text-green-600 border-green-300">
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            All Uploaded
                                        </Badge>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    {/* License Document */}
                                    <div className={`p-4 rounded-lg border ${selectedAgent.licenseDocumentUrl ? 'border-green-200 bg-green-50/30' : 'border-amber-200 bg-amber-50/30'}`}>
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3 flex-1">
                                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedAgent.licenseDocumentUrl ? 'bg-green-100' : 'bg-amber-100'}`}>
                                                    <FileText className={`h-5 w-5 ${selectedAgent.licenseDocumentUrl ? 'text-green-600' : 'text-amber-600'}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-foreground">License Document</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {selectedAgent.licenseDocumentUrl ? 'Professional licensing document' : 'Not uploaded yet'}
                                                    </p>
                                                </div>
                                            </div>
                                            {selectedAgent.licenseDocumentUrl && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => window.open(selectedAgent.licenseDocumentUrl, '_blank')}
                                                    className="h-8 px-3 flex-shrink-0"
                                                >
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    View
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Company Document */}
                                    <div className={`p-4 rounded-lg border ${selectedAgent.companyDocumentUrl ? 'border-green-200 bg-green-50/30' : 'border-amber-200 bg-amber-50/30'}`}>
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3 flex-1">
                                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedAgent.companyDocumentUrl ? 'bg-green-100' : 'bg-amber-100'}`}>
                                                    <Building2 className={`h-5 w-5 ${selectedAgent.companyDocumentUrl ? 'text-green-600' : 'text-amber-600'}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-foreground">Company Document</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {selectedAgent.companyDocumentUrl ? 'Company registration document' : 'Not uploaded yet'}
                                                    </p>
                                                </div>
                                            </div>
                                            {selectedAgent.companyDocumentUrl && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => window.open(selectedAgent.companyDocumentUrl, '_blank')}
                                                    className="h-8 px-3 flex-shrink-0"
                                                >
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    View
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* ID/Passport Document */}
                                    <div className={`p-4 rounded-lg border ${selectedAgent.idDocumentUrl ? 'border-green-200 bg-green-50/30' : 'border-amber-200 bg-amber-50/30'}`}>
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3 flex-1">
                                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedAgent.idDocumentUrl ? 'bg-green-100' : 'bg-amber-100'}`}>
                                                    <FileText className={`h-5 w-5 ${selectedAgent.idDocumentUrl ? 'text-green-600' : 'text-amber-600'}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-foreground">ID / Passport Document</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {selectedAgent.idDocumentUrl ? 'Government-issued identification' : 'Not uploaded yet'}
                                                    </p>
                                                </div>
                                            </div>
                                            {selectedAgent.idDocumentUrl && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => window.open(selectedAgent.idDocumentUrl, '_blank')}
                                                    className="h-8 px-3 flex-shrink-0"
                                                >
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    View
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Missing Documents Warning */}
                                    {(!selectedAgent.licenseDocumentUrl || !selectedAgent.companyDocumentUrl || !selectedAgent.idDocumentUrl) && (
                                        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                                            <p className="text-xs text-amber-800">
                                                ⚠️ Agent has not uploaded all required documents yet (License, Company, and ID/Passport). Verification cannot be completed until all documents are provided.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bio */}
                            {(selectedAgent.bioEn || selectedAgent.bio) && (
                                <div className="p-3 rounded-lg bg-muted/50">
                                    <p className="text-xs text-muted-foreground uppercase">Bio</p>
                                    <p className="text-sm mt-1">{selectedAgent.bioEn || selectedAgent.bio}</p>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAgentDialog(false)}>
                            Cancel
                        </Button>
                        {selectedAgent && <Button onClick={() => handleVerifyAgent(selectedAgent)}>
                            Verify Agent
                        </Button>}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Agent and Buyer Dialogs */}
            <CreateAgentDialog
                open={showCreateAgentDialog}
                onOpenChange={setShowCreateAgentDialog}
            />

            <Dialog open={showCreateBuyerDialog} onOpenChange={setShowCreateBuyerDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create New Buyer</DialogTitle>
                        <DialogDescription>
                            Add a new buyer account manually.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="buyer-name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="buyer-name"
                                value={createBuyerData.name}
                                onChange={(e) => setCreateBuyerData({ ...createBuyerData, name: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="buyer-email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="buyer-email"
                                type="email"
                                value={createBuyerData.email}
                                onChange={(e) => setCreateBuyerData({ ...createBuyerData, email: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="buyer-password" className="text-right">
                                Password
                            </Label>
                            <Input
                                id="buyer-password"
                                placeholder="Default: temp1234"
                                value={createBuyerData.password}
                                onChange={(e) => setCreateBuyerData({ ...createBuyerData, password: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="buyer-company" className="text-right">
                                Company
                            </Label>
                            <Input
                                id="buyer-company"
                                value={createBuyerData.companyName}
                                onChange={(e) => setCreateBuyerData({ ...createBuyerData, companyName: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateBuyerDialog(false)}>Cancel</Button>
                        <Button onClick={async () => {
                            try {
                                await createBuyer.mutateAsync(createBuyerData)
                                toast({
                                    title: "Success",
                                    description: "Buyer created successfully",
                                })
                                setShowCreateBuyerDialog(false)
                            } catch (error: any) {
                                toast({
                                    title: "Error",
                                    description: error.message || "Failed to create buyer",
                                    variant: "destructive",
                                })
                            }
                        }}>Create Buyer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <EditAgentDialog
                open={showEditAgentDialog}
                onOpenChange={setShowEditAgentDialog}
                agent={editAgentData}
            />

            {/* Create Listing Dialog */}
            <Dialog open={showCreateListingDialog} onOpenChange={setShowCreateListingDialog}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Listing</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <ListingForm
                            mode="create"
                            agents={agents.map(a => ({ id: a.id, name: a.name }))}
                            onSuccess={() => router.refresh()}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Listing Dialog */}
            <Dialog open={showEditListingDialog} onOpenChange={setShowEditListingDialog}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Listing</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        {editListingData && (
                            <ListingForm
                                mode="edit"
                                listing={editListingData}
                                agents={agents.map(a => ({ id: a.id, name: a.name }))}
                                onSuccess={() => router.refresh()}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Rejection Dialogs */}
            <RejectAgentDialog
                open={rejectAgentDialog.open}
                onOpenChange={(open) =>
                    setRejectAgentDialog({ ...rejectAgentDialog, open })
                }
                agentId={rejectAgentDialog.agentId}
                agentName={rejectAgentDialog.agentName}
            />

            {/* Delete Listing Confirmation Dialog */}
            <AlertDialog open={deleteListingDialog.open} onOpenChange={(open) => setDeleteListingDialog({ ...deleteListingDialog, open })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete "{deleteListingDialog.listingTitle}" and remove it from the platform.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault()
                                handleDeleteListing()
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete Listing"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    )
}
