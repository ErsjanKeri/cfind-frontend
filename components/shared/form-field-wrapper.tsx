import { ReactNode } from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormFieldWrapperProps {
  label: string
  htmlFor: string
  error?: string | null
  required?: boolean
  children: ReactNode
  className?: string
  description?: string
}

/**
 * Wrapper component for form fields that provides:
 * - Label with optional required indicator
 * - Child input element
 * - Error message display
 * - Optional description text
 * - Red border on input when error exists
 */
export function FormFieldWrapper({
  label,
  htmlFor,
  error,
  required,
  children,
  className,
  description
}: FormFieldWrapperProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {/* Add error class to child input if error exists */}
      <div className={cn(error && "has-error")}>
        {children}
      </div>

      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
