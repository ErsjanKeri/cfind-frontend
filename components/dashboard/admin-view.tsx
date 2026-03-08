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
import { AdminAgentList } from "@/components/admin/admin-agent-list"
import { AdminBuyerList } from "@/components/admin/admin-buyer-list"
import { ListingDialog } from "@/components/listings/listing-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/shared/stat-card"
import { AvatarWithInitials } from "@/components/shared/avatar-with-initials"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, FileText, AlertTriangle, Plus } from "lucide-react"
import { getErrorMessage } from "@/lib/utils"
import type { UserWithProfile } from "@/lib/api/types"
import { getVerificationStatusBadge } from "@/lib/badge-utils"

export function AdminView() {
    const [activeTab, setActiveTab] = useState("overview")

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
