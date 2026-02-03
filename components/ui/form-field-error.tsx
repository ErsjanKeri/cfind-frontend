import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormFieldErrorProps {
  error?: string | null
  className?: string
}

/**
 * Reusable error message component for form fields
 * Shows error text with icon in red color
 */
export function FormFieldError({ error, className }: FormFieldErrorProps) {
  if (!error) return null

  return (
    <div className={cn("flex items-center gap-1 text-sm text-red-600 mt-1", className)}>
      <AlertCircle className="h-3 w-3 flex-shrink-0" />
      <span>{error}</span>
    </div>
  )
}
