"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ListingForm } from "@/components/listing-form"
import type { Listing } from "@/lib/api/types"

interface ListingDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    listing?: Listing | null
    mode: "create" | "edit"
}

export function ListingDialog({ open, onOpenChange, listing, mode }: ListingDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{mode === "create" ? "Create New Listing" : "Edit Listing"}</DialogTitle>
                    <DialogDescription>
                        {mode === "create"
                            ? "Fill in the details below to create a new business listing."
                            : "Update the details of your business listing."}
                    </DialogDescription>
                </DialogHeader>
                <ListingForm
                    mode={mode}
                    listing={listing || undefined}
                    onSuccess={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    )
}
