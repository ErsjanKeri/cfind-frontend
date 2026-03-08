"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/shared/loading-button"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/utils"
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
import { useCreateBuyer } from "@/lib/hooks/useAdmin"

interface CreateBuyerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateBuyerDialog({ open, onOpenChange }: CreateBuyerDialogProps) {
    const createBuyer = useCreateBuyer()
    const [data, setData] = useState({
        name: "",
        email: "",
        company_name: "",
        password: "",
    })

    const handleSubmit = async () => {
        try {
            await createBuyer.mutateAsync(data)
            toast.success("Buyer created successfully")
            onOpenChange(false)
            setData({ name: "", email: "", company_name: "", password: "" })
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to create buyer"))
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
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
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
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
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="buyer-company" className="text-right">
                            Company
                        </Label>
                        <Input
                            id="buyer-company"
                            value={data.company_name}
                            onChange={(e) => setData({ ...data, company_name: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <LoadingButton onClick={handleSubmit} isLoading={createBuyer.isPending} loadingText="Creating...">
                        Create Buyer
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
