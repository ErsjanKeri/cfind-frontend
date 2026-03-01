import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ComponentProps } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/components/ui/button';

interface LoadingButtonProps
  extends ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  isLoading: boolean;
  loadingText?: string;
}

/**
 * Drop-in replacement for Button when you need loading state.
 * Renders a spinner + optional loading label, disables while pending.
 *
 * @example
 * <LoadingButton isLoading={mutation.isPending} loadingText="Saving...">
 *   Save Changes
 * </LoadingButton>
 */
export function LoadingButton({
  isLoading,
  loadingText,
  children,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={isLoading || disabled} {...props}>
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {isLoading && loadingText ? loadingText : children}
    </Button>
  );
}
