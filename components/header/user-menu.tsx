import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, LayoutDashboard, Settings, Heart } from "lucide-react"
import { getInitials } from "@/lib/utils"
import type { ReactNode } from "react"

interface UserMenuProps {
    userName: string | null
    userEmail: string
    userImage?: string | null
    isBuyer: boolean
    roleBadge: ReactNode
    onLogout: () => void
}

export function UserMenu({ userName, userEmail, userImage, isBuyer, roleBadge, onLogout }: UserMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2 h-9">
                    <Avatar className="h-7 w-7">
                        <AvatarImage src={userImage || "/placeholder.svg"} alt={userName || "User"} />
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
                            {getInitials(userName || userEmail)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:flex flex-col items-start">
                        <span className="text-sm font-medium leading-none">{userName}</span>
                        {roleBadge}
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium leading-none">{userName}</p>
                        <p className="text-xs text-muted-foreground">{userEmail}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {isBuyer ? "My Profile" : "Dashboard"}
                    </Link>
                </DropdownMenuItem>
                {isBuyer && (
                    <DropdownMenuItem asChild>
                        <Link href="/profile/saved" className="flex items-center cursor-pointer">
                            <Heart className="mr-2 h-4 w-4" />
                            Saved Listings
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
