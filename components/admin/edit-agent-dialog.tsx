"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUpdateProfile } from "@/lib/hooks/useUser"
import type { UserWithProfile } from "@/lib/api/types"

interface EditAgentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    agent: UserWithProfile | null
}

export function EditAgentDialog({ open, onOpenChange, agent }: EditAgentDialogProps) {
    const router = useRouter()
    const [data, setData] = useState<UserWithProfile | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (agent) {
            setData(agent)
        }
    }, [agent])

    const handleSubmit = async () => {
        if (!data) return
        setLoading(true)

        // TODO: Implement admin updateAgent API endpoint
        // For now, agents can update their own profiles in Settings
        toast({
            title: "Feature Coming Soon",
            description: "Admin editing of agent profiles will be available soon. Agents can update their profiles in Settings.",
        })

        setLoading(false)
        onOpenChange(false)
    }

    if (!data) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Agent</DialogTitle>
                    <DialogDescription>
                        Update agent details.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-name" className="text-right">Name</Label>
                        <Input
                            id="edit-name"
                            value={data.name || ""}
                            disabled
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-email" className="text-right">Email</Label>
                        <Input
                            id="edit-email"
                            value={data.email || ""}
                            disabled
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-agency" className="text-right">Agency</Label>
                        <Input
                            id="edit-agency"
                            value={data.company_name || ""}
                            disabled
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-license" className="text-right">License</Label>
                        <Input
                            id="edit-license"
                            value={data.agent_profile?.license_number || ""}
                            disabled
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-whatsapp" className="text-right">WhatsApp</Label>
                        <Input
                            id="edit-whatsapp"
                            value={data.agent_profile?.whatsapp_number || ""}
                            disabled
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
