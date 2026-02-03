"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, XCircle } from "lucide-react"

interface BaseRejectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  entityName: string
  warningMessage: string
  placeholder: string
  submitButtonText: string
  onReject: (reason: string) => Promise<{ error?: string }>
  entityNameClassName?: string
}

export function BaseRejectDialog({
  open,
  onOpenChange,
  title,
  entityName,
  warningMessage,
  placeholder,
  submitButtonText,
  onReject,
  entityNameClassName = "",
}: BaseRejectDialogProps) {
  const [rejectionReason, setRejectionReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleReject = async () => {
    setError("")

    if (rejectionReason.trim().length < 10) {
      setError("Rejection reason must be at least 10 characters")
      return
    }

    setLoading(true)
    const result = await onReject(rejectionReason)
    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      // Success - close dialog and reset
      setRejectionReason("")
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    setRejectionReason("")
    setError("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription className={entityNameClassName}>
                {entityName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 text-sm">
              {warningMessage}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="rejectionReason">
              Rejection Reason <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="rejectionReason"
              placeholder={placeholder}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={6}
              className={error && rejectionReason.length < 10 ? "border-red-500" : ""}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              {rejectionReason.length}/10 characters minimum
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleReject}
            disabled={loading || rejectionReason.trim().length < 10}
          >
            {loading ? "Rejecting..." : submitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
