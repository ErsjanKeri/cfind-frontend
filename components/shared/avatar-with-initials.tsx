import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface AvatarWithInitialsProps {
  name: string | null | undefined
  src?: string | null
  className?: string
  fallbackClassName?: string
}

export function AvatarWithInitials({
  name,
  src,
  className = "h-10 w-10",
  fallbackClassName = "bg-primary/10 text-primary",
}: AvatarWithInitialsProps) {
  return (
    <Avatar className={className}>
      <AvatarImage src={src || "/placeholder.svg"} />
      <AvatarFallback className={fallbackClassName}>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  )
}
