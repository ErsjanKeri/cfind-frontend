import { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

type ColorVariant = "blue" | "green" | "purple" | "amber" | "red" | "indigo"

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  footer?: string
  variant?: ColorVariant
}

const colorClasses: Record<ColorVariant, { bg: string; iconColor: string }> = {
  blue: { bg: "bg-blue-100", iconColor: "text-blue-600" },
  green: { bg: "bg-green-100", iconColor: "text-green-600" },
  purple: { bg: "bg-purple-100", iconColor: "text-purple-600" },
  amber: { bg: "bg-amber-100", iconColor: "text-amber-600" },
  red: { bg: "bg-red-100", iconColor: "text-red-600" },
  indigo: { bg: "bg-indigo-100", iconColor: "text-indigo-600" },
}

export function StatCard({
  icon: Icon,
  label,
  value,
  footer,
  variant = "blue",
}: StatCardProps) {
  const colors = colorClasses[variant]

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors.bg}`}>
            <Icon className={`h-5 w-5 ${colors.iconColor}`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
        {footer && (
          <div className="mt-2 text-xs text-muted-foreground">
            {footer}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
