import { ReactNode } from "react"
import { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    icon?: LucideIcon
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  }
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: {
    container: "py-8",
    iconWrapper: "w-12 h-12 mb-3",
    icon: "h-6 w-6",
    title: "text-base font-medium",
    description: "text-sm",
  },
  md: {
    container: "py-12",
    iconWrapper: "w-14 h-14 mb-4",
    icon: "h-7 w-7",
    title: "text-lg font-medium",
    description: "text-sm",
  },
  lg: {
    container: "py-16",
    iconWrapper: "w-16 h-16 mb-4",
    icon: "h-8 w-8",
    title: "text-lg font-medium",
    description: "text-sm",
  },
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  size = "md",
}: EmptyStateProps) {
  const classes = sizeClasses[size]
  const ActionIcon = action?.icon

  return (
    <div className={`text-center ${classes.container}`}>
      <div className={`inline-flex items-center justify-center rounded-full bg-muted/50 ${classes.iconWrapper}`}>
        <Icon className={`text-muted-foreground/60 ${classes.icon}`} />
      </div>
      <h3 className={`text-foreground mb-1 ${classes.title}`}>{title}</h3>
      <p className={`text-muted-foreground mb-4 ${classes.description}`}>{description}</p>
      {action && (
        <Button
          variant={action.variant || "outline"}
          onClick={action.onClick}
        >
          {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
          {action.label}
        </Button>
      )}
    </div>
  )
}
