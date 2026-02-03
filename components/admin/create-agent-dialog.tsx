"use client"

import { useState } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { useCreateAgent } from "@/lib/hooks/useAdmin"

interface CreateAgentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateAgentDialog({ open, onOpenChange }: CreateAgentDialogProps) {
    const router = useRouter()
    const createAgent = useCreateAgent()
    const [data, setData] = useState({
        name: "",
        email: "",
        agency: "",
        license: "",
        whatsapp: "",
        phone: "",
        password: "",
    })
    const [preApproved, setPreApproved] = useState(true)

    const handleSubmit = async () => {
        try {
            await createAgent.mutateAsync({
                ...data,
                verification_status: preApproved ? "approved" : "pending",
                email_verified: preApproved
            })
            onOpenChange(false)
            toast({
                title: "Success",
                description: "Agent created successfully"
            })
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to create agent",
                variant: "destructive",
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Agent</DialogTitle>
                    <DialogDescription>
                        Add a new real estate agent to the platform.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Min. 6 characters"
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="agency" className="text-right">
                            Agency
                        </Label>
                        <Input
                            id="agency"
                            value={data.agency}
                            onChange={(e) => setData({ ...data, agency: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="license" className="text-right">
                            License
                        </Label>
                        <Input
                            id="license"
                            value={data.license}
                            onChange={(e) => setData({ ...data, license: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                            Phone
                        </Label>
                        <Input
                            id="phone"
                            value={data.phone || ""}
                            onChange={(e) => setData({ ...data, phone: e.target.value })}
                            className="col-span-3"
                            placeholder="+355..."
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="whatsapp" className="text-right">
                            WhatsApp
                        </Label>
                        <Input
                            id="whatsapp"
                            value={data.whatsapp}
                            onChange={(e) => setData({ ...data, whatsapp: e.target.value })}
                            className="col-span-3"
                            placeholder="+355..."
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <div className="col-span-1"></div>
                        <div className="col-span-3 flex items-center space-x-2">
                            <Checkbox
                                id="preApproved"
                                checked={preApproved}
                                onCheckedChange={(checked) => setPreApproved(checked as boolean)}
                            />
                            <Label
                                htmlFor="preApproved"
                                className="text-sm font-normal cursor-pointer"
                            >
                                Pre-approve verification (admin-created agents are typically pre-approved)
                            </Label>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={createAgent.isPending}>
                        {createAgent.isPending ? "Creating..." : "Create Agent"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
