"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"
import { SearchInput } from "@/components/shared/search-input"
import { AdminBuyerCard } from "@/components/admin/buyer-card"
import type { UserWithProfile } from "@/lib/api/types"

interface AdminBuyerListProps {
    buyers: UserWithProfile[]
    onDelete: (buyer: UserWithProfile) => void
    onToggleEmail: (buyer: UserWithProfile) => void
    onCreateBuyer: () => void
}

export function AdminBuyerList({ buyers, onDelete, onToggleEmail, onCreateBuyer }: AdminBuyerListProps) {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredBuyers = buyers.filter(
        (b) =>
            searchQuery === "" ||
            (b.name && b.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            b.email.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return (
        <>
            <div className="mb-4 flex items-center justify-between">
                <SearchInput
                    placeholder="Search buyers..."
                    wrapperClassName="max-w-md flex-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button onClick={onCreateBuyer} className="ml-4">
                    <Building2 className="h-4 w-4 mr-2" />
                    Add Buyer
                </Button>
            </div>

            <div className="space-y-4">
                {filteredBuyers.map((buyer) => (
                    <AdminBuyerCard
                        key={buyer.id}
                        buyer={buyer}
                        onToggleEmail={onToggleEmail}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </>
    )
}
