"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"
import { SearchInput } from "@/components/shared/search-input"
import { AdminAgentCard } from "@/components/admin/agent-card"
import type { UserWithProfile } from "@/lib/api/types"

interface AdminAgentListProps {
    agents: UserWithProfile[]
    onView: (agent: UserWithProfile) => void
    onVerify: (agent: UserWithProfile) => void
    onReject: (agent: UserWithProfile) => void
    onDelete: (agent: UserWithProfile) => void
    onToggleEmail: (agent: UserWithProfile) => void
    onCreateAgent: () => void
}

export function AdminAgentList({
    agents,
    onView,
    onVerify,
    onReject,
    onDelete,
    onToggleEmail,
    onCreateAgent,
}: AdminAgentListProps) {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredAgents = agents.filter(
        (a) =>
            searchQuery === "" ||
            (a.name && a.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            a.email.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return (
        <>
            <div className="mb-4 flex items-center justify-between">
                <SearchInput
                    placeholder="Search agents..."
                    wrapperClassName="max-w-md flex-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button onClick={onCreateAgent} className="ml-4">
                    <Users className="h-4 w-4 mr-2" />
                    Add Agent
                </Button>
            </div>

            <div className="space-y-4">
                {filteredAgents.map((agent) => (
                    <AdminAgentCard
                        key={agent.id}
                        agent={agent}
                        onView={onView}
                        onVerify={onVerify}
                        onReject={onReject}
                        onDelete={onDelete}
                        onToggleEmail={onToggleEmail}
                    />
                ))}
            </div>
        </>
    )
}
