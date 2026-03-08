"use client"

import { useRejectAgent } from "@/lib/hooks/useAdmin"
import { getErrorMessage } from "@/lib/utils"
import { BaseRejectDialog } from "./base-reject-dialog"

interface RejectAgentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agentId: string
  agentName: string
}

export function RejectAgentDialog({
  open,
  onOpenChange,
  agentId,
  agentName,
}: RejectAgentDialogProps) {
  const rejectAgent = useRejectAgent()

  const handleReject = async (rejectionReason: string) => {
    try {
      await rejectAgent.mutateAsync({ agentId, reason: rejectionReason })
      return { success: true }
    } catch (error: unknown) {
      return { success: false, error: getErrorMessage(error) }
    }
  }

  return (
    <BaseRejectDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Reject Agent Verification"
      entityName={`Agent: ${agentName}`}
      warningMessage="The agent will receive an email notification with the rejection reason and can resubmit after addressing the issues."
      placeholder="Explain why the verification was rejected and what the agent needs to fix..."
      submitButtonText="Reject Verification"
      onReject={handleReject}
    />
  )
}
