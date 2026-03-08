"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Lock, CheckCircle } from "lucide-react"
import { getInitials } from "@/lib/utils"

interface LoginPromptDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    redirectPath: string
    agentName?: string | null
    agentAgencyName?: string | null
}

export function LoginPromptDialog({
    open,
    onOpenChange,
    redirectPath,
    agentName,
    agentAgencyName,
}: LoginPromptDialogProps) {
    const encodedRedirect = encodeURIComponent(redirectPath)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-primary" />
                        Create Account to Contact
                    </DialogTitle>
                    <DialogDescription>Create a free account to view agent contact information</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {agentName && (
                        <div className="p-4 rounded-lg bg-muted">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback>{getInitials(agentName)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{agentName}</p>
                                    {agentAgencyName && (
                                        <p className="text-sm text-muted-foreground">{agentAgencyName}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-verified" />
                            View agent contact details
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-verified" />
                            Save favorite listings
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-verified" />
                            Get instant responses
                        </li>
                    </ul>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                        Maybe Later
                    </Button>
                    <Button asChild className="flex-1">
                        <Link href={`/register?redirect=${encodedRedirect}`}>
                            Create Free Account
                        </Link>
                    </Button>
                </DialogFooter>
                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        href={`/login?redirect=${encodedRedirect}`}
                        className="text-primary hover:underline"
                    >
                        Sign In
                    </Link>
                </div>
            </DialogContent>
        </Dialog>
    )
}
