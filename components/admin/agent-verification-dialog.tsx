"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AvatarWithInitials } from "@/components/shared/avatar-with-initials"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DocumentViewer } from "@/components/admin/document-viewer"
import { Building2, FileText, CheckCircle } from "lucide-react"
import type { UserWithProfile } from "@/lib/api/types"

interface AgentVerificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agent: UserWithProfile | null
  onVerify: (agent: UserWithProfile) => void
}

export function AgentVerificationDialog({
  open,
  onOpenChange,
  agent,
  onVerify,
}: AgentVerificationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify Agent</DialogTitle>
          <DialogDescription>Review the agent&apos;s credentials before approving their account.</DialogDescription>
        </DialogHeader>
        {agent && (
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center gap-4">
              <AvatarWithInitials
                name={agent.name}
                src={agent.image}
                className="h-16 w-16"
                fallbackClassName="bg-primary/10 text-primary text-xl"
              />
              <div>
                <h3 className="font-semibold text-lg">{agent.name}</h3>
                <p className="text-muted-foreground">{agent.email}</p>
              </div>
            </div>

            {/* Agency & License */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground uppercase">Agency</p>
                <p className="font-medium">{agent.company_name || "N/A"}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground uppercase">License</p>
                <p className="font-medium">{agent.agent_profile?.license_number || "N/A"}</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground uppercase">Phone</p>
                <p className="font-medium">{agent.phone_number || "N/A"}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground uppercase">WhatsApp</p>
                <p className="font-medium">{agent.agent_profile?.whatsapp_number || "N/A"}</p>
              </div>
            </div>

            {/* Verification Documents */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Verification Documents</p>
                {agent.agent_profile?.license_document_url && agent.agent_profile?.company_document_url && agent.agent_profile?.id_document_url && (
                  <Badge variant="outline" className="text-green-600 border-green-300">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    All Uploaded
                  </Badge>
                )}
              </div>

              <div className="space-y-3">
                <DocumentViewer
                  label="License Document"
                  description="Professional licensing document"
                  url={agent.agent_profile?.license_document_url}
                  icon={FileText}
                />
                <DocumentViewer
                  label="Company Document"
                  description="Company registration document"
                  url={agent.agent_profile?.company_document_url}
                  icon={Building2}
                />
                <DocumentViewer
                  label="ID / Passport Document"
                  description="Government-issued identification"
                  url={agent.agent_profile?.id_document_url}
                  icon={FileText}
                />

                {(!agent.agent_profile?.license_document_url || !agent.agent_profile?.company_document_url || !agent.agent_profile?.id_document_url) && (
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <p className="text-xs text-amber-800">
                      Agent has not uploaded all required documents yet (License, Company, and ID/Passport). Verification cannot be completed until all documents are provided.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            {agent.agent_profile?.bio_en && (
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground uppercase">Bio</p>
                <p className="text-sm mt-1">{agent.agent_profile.bio_en}</p>
              </div>
            )}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {agent && (
            <Button onClick={() => onVerify(agent)}>
              Verify Agent
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
