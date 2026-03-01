/**
 * Centralized Form Error Display Component
 *
 * Provides uniform error display across all forms with:
 * - Automatic multi-line formatting for validation errors
 * - Consistent styling
 * - Optional custom titles
 * - Auto-hides when no error
 *
 * Usage:
 * ```tsx
 * const [error, setError] = useState<string | null>(null);
 *
 * <FormError error={error} title="Registration Failed" />
 *
 * // In catch block:
 * catch (err: any) {
 *   setError(err.message);
 * }
 * ```
 */

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, XCircle, AlertTriangle } from "lucide-react";

interface FormErrorProps {
  error: string | Error | null | undefined;
  title?: string;
  variant?: "destructive" | "default";
  className?: string;
}

export function FormError({
  error,
  title = "Error",
  variant = "destructive",
  className = ""
}: FormErrorProps) {
  // Don't render if no error
  if (!error) return null;

  // Convert Error object to string
  const errorMessage = error instanceof Error ? error.message : error;

  const Icon = AlertCircle;

  return (
    <Alert variant={variant} className={className}>
      <Icon className="h-4 w-4" />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription className="whitespace-pre-line">
        {errorMessage}
      </AlertDescription>
    </Alert>
  );
}
