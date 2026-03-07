"use client"

import { useState } from "react"
import {
    useAdminStats,
    useAllUsers,
    useVerifyAgent,
    useDeleteUser,
    useToggleEmailVerification,
} from "@/lib/hooks/useAdmin"
import { CreateAgentDialog } from "@/components/admin/create-agent-dialog"
import { CreateBuyerDialog } from "@/components/admin/create-buyer-dialog"
import { RejectAgentDialog } from "@/components/admin/reject-agent-dialog"
import { AgentVerificationDialog } from "@/components/admin/agent-verification-dialog"
import { AdminAgentCard } from "@/components/admin/agent-card"
import { AdminBuyerCard } from "@/components/admin/buyer-card"
import { ListingDialog } from "@/components/listings/listing-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/shared/stat-card"
import { AvatarWithInitials } from "@/components/shared/avatar-with-initials"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
    Building2,
    Users,
    FileText,
    Search,
    AlertTriangle,
    Plus,
} from "lucide-react"
import type { UserWithProfile } from "@/lib/api/types"
import { getVerificationStatusBadge } from "@/lib/badge-utils"

export function AdminView() {
    const [activeTab, setActiveTab] = useState("overview")
    const [agentSearchQuery, setAgentSearchQuery] = useState("")
    const [buyerSearchQuery, setBuyerSearchQuery] = useState("")

    const { data: stats } = useAdminStats()
    const { data: allUsers } = useAllUsers()

    const verifyAgent = useVerifyAgent()
    const deleteUser = useDeleteUser()
    const toggleEmailVerification = useToggleEmailVerification()

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

    const verifiedAgents = agents.filter((a) => a.verification_status === "approved")
    const pendingAgents = agents.filter((a) => a.verification_status === "pending")

    const handleVerifyAgent = async (agent: UserWithProfile) => {
        setShowAgentDialog(false)
        setSelectedAgent(null)

        try {
            await verifyAgent.mutateAsync(agent.id)
            toast.success("Agent verified successfully")
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Failed to verify agent")
        }
    }

    const handleDeleteUser = async (user: UserWithProfile) => {
        setShowAgentDialog(false)
        setSelectedAgent(null)

        try {
            await deleteUser.mutateAsync(user.id)
            toast.success(`${user.role === "agent" ? "Agent" : "Buyer"} deleted successfully`)
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : `Failed to delete ${user.role}`)
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
            toast.error(error instanceof Error ? error.message : "Failed to update email verification")
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

    const filteredAgents = agents.filter(
        (a) =>
            agentSearchQuery === "" ||
            (a.name && a.name.toLowerCase().includes(agentSearchQuery.toLowerCase())) ||
            a.email.toLowerCase().includes(agentSearchQuery.toLowerCase()),
    )

    const filteredBuyers = buyers.filter(
        (b) =>
            buyerSearchQuery === "" ||
            (b.name && b.name.toLowerCase().includes(buyerSearchQuery.toLowerCase())) ||
            b.email.toLowerCase().includes(buyerSearchQuery.toLowerCase()),
    )

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
                <TabsList className="mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="agents" className="gap-2">
                        Agents
                        {pendingAgents.length > 0 && (
                            <Badge variant="secondary" className="h-5 min-w-5 text-xs">
                                {pendingAgents.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="buyers">Buyers</TabsTrigger>
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

                {/* Agents Tab */}
                <TabsContent value="agents">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="relative max-w-md flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search agents..."
                                className="pl-10"
                                value={agentSearchQuery}
                                onChange={(e) => setAgentSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button onClick={() => setShowCreateAgentDialog(true)} className="ml-4">
                            <Users className="h-4 w-4 mr-2" />
                            Add Agent
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {filteredAgents.map((agent) => (
                            <AdminAgentCard
                                key={agent.id}
                                agent={agent}
                                onView={openVerifyDialog}
                                onVerify={openVerifyDialog}
                                onReject={openRejectDialog}
                                onDelete={handleDeleteUser}
                                onToggleEmail={handleToggleEmailVerification}
                            />
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
                                value={buyerSearchQuery}
                                onChange={(e) => setBuyerSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button onClick={() => setShowCreateBuyerDialog(true)} className="ml-4">
                            <Building2 className="h-4 w-4 mr-2" />
                            Add Buyer
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {filteredBuyers.map((buyer) => (
                            <AdminBuyerCard
                                key={buyer.id}
                                buyer={buyer}
                                onToggleEmail={handleToggleEmailVerification}
                                onDelete={handleDeleteUser}
                            />
                        ))}
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
