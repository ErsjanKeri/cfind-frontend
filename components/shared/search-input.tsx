import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchInputProps extends React.ComponentProps<"input"> {
    wrapperClassName?: string
}

export function SearchInput({ wrapperClassName, className, ...props }: SearchInputProps) {
    return (
        <div className={cn("relative", wrapperClassName)}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className={cn("pl-9", className)} {...props} />
        </div>
    )
}
