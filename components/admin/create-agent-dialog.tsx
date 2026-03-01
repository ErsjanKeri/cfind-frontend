"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/shared/loading-button"
import { FormFieldWrapper } from "@/components/shared/form-field-wrapper"
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
import { RegisterAgentFields, type AgentFieldsData } from "@/components/auth/register-agent-fields"
import { useCreateAgent } from "@/lib/hooks/useAdmin"

interface CreateAgentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateAgentDialog({ open, onOpenChange }: CreateAgentDialogProps) {
    const createAgent = useCreateAgent()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [preApproved, setPreApproved] = useState(true)

    const [agentFields, setAgentFields] = useState<AgentFieldsData>({
        company_name: "",
        license_number: "",
        phone: "",
        whatsapp_number: "",
    })

    const handleAgentFieldChange = (field: keyof AgentFieldsData, value: string | File | null) => {
        setAgentFields((prev) => ({ ...prev, [field]: value as string }))
    }

    const handleSubmit = async () => {
        try {
            await createAgent.mutateAsync({
                name,
                email,
                password,
                ...agentFields,
                verification_status: preApproved ? "approved" : "pending",
                email_verified: preApproved
            })
            onOpenChange(false)
            toast({
                title: "Success",
                description: "Agent created successfully"
            })
        } catch (error: unknown) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An unexpected error occurred",
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
                <div className="space-y-4 py-4">
                    <FormFieldWrapper label="Name" htmlFor="name" required>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </FormFieldWrapper>

                    <FormFieldWrapper label="Email" htmlFor="email" required>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </FormFieldWrapper>

                    <FormFieldWrapper label="Password" htmlFor="password" required>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Min. 8 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                    </FormFieldWrapper>

                    <RegisterAgentFields
                        data={agentFields}
                        onChange={handleAgentFieldChange}
                        disabled={createAgent.isPending}
                        showDocuments={false}
                    />

                    <div className="flex items-center space-x-2 pt-2 border-t border-border">
                        <Checkbox
                            id="preApproved"
                            checked={preApproved}
                            onCheckedChange={(checked) => setPreApproved(checked as boolean)}
                        />
                        <Label htmlFor="preApproved" className="text-sm font-normal cursor-pointer">
                            Pre-approve verification (admin-created agents skip document review)
                        </Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <LoadingButton onClick={handleSubmit} isLoading={createAgent.isPending} loadingText="Creating...">
                        Create Agent
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
