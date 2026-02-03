"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useAuth, useUser } from "@/lib/hooks/useAuth"
import type { Currency } from "@/lib/currency"
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
import { Building2, LogOut, Menu, X, LayoutDashboard, Settings, Globe, Coins, Heart, Plus } from "lucide-react"
import type { AgentProfile } from "@/lib/api/types"
import { DemandDialog } from "@/components/demand-dialog"

export function Header() {
  const { logout } = useAuth() // Auth actions only
  const { user, isLoading } = useUser() // User data via JWT cookie
  const isAuthenticated = !!user // Derived from user data
  const [currency, setCurrency] = useState<Currency>("EUR")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showDemandDialog, setShowDemandDialog] = useState(false)
  const pathname = usePathname()

  // Load currency preference and persist changes
  useEffect(() => {
    const saved = localStorage.getItem("currency") as Currency
    if (saved) setCurrency(saved)
  }, [])

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency)
    localStorage.setItem("currency", newCurrency)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleBadge = () => {
    if (!user) return null

    if (user.role === "admin") {
      return <span className="text-xs text-primary font-medium">Admin</span>
    }

    if (user.role === "agent" && user.agent_profile) {
      const agentProfile = user.agent_profile
      // verificationStatus is the single source of truth: "pending" | "approved" | "rejected"
      if (agentProfile.verification_status === "rejected") {
        return <span className="text-xs text-red-600 font-medium">Verification Rejected</span>
      }
      if (agentProfile.verification_status === "approved") {
        return <span className="text-xs text-emerald-600 font-medium">Licensed Agent</span>
      }
      return <span className="text-xs text-amber-600 font-medium">Pending Approval</span>
    }

    if (user.role === "buyer") {
      return <span className="text-xs text-muted-foreground">Buyer</span>
    }

    return null
  }

  const getDashboardLink = () => {
    if (!user) return "/login"
    // Unified profile route for all roles
    return "/profile"
  }

  const isActive = (path: string) => {
    if (path === "/listings") return pathname?.startsWith("/listings")
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              Company<span className="text-primary">Finder</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/listings"
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/listings") ? "text-primary" : "text-muted-foreground"
                }`}
            >
              Browse Listings
            </Link>
            <Link
              href="/how-it-works"
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/how-it-works") ? "text-primary" : "text-muted-foreground"
                }`}
            >
              How It Works
            </Link>
            <Link
              href="/agents"
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/agents") ? "text-primary" : "text-muted-foreground"
                }`}
            >
              Our Agents
            </Link>
            {/* Buyer CTA - Post Demand */}
            {isAuthenticated && user?.role === "buyer" && (
              <Button
                size="sm"
                onClick={() => setShowDemandDialog(true)}
                className="ml-2"
              >
                <Plus className="h-4 w-4 mr-1" />
                Post New Demand
              </Button>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 px-2 gap-1 text-muted-foreground">
                  <Coins className="h-4 w-4" />
                  <span className="text-xs font-medium" suppressHydrationWarning>{currency}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuLabel className="text-xs">Currency</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleCurrencyChange("EUR")} className={currency === "EUR" ? "bg-muted" : ""}>
                  <span className="mr-2">€</span> EUR
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCurrencyChange("ALL")} className={currency === "ALL" ? "bg-muted" : ""}>
                  <span className="mr-2">L</span> ALL
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isLoading ? (
              // Show skeleton while loading auth state
              <div className="h-9 w-24 bg-muted animate-pulse rounded-md" />
            ) : isAuthenticated && user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-2 h-9">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name || "User"} />
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
                          {getInitials(user.name || user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden lg:flex flex-col items-start">
                        <span className="text-sm font-medium leading-none">{user.name}</span>
                        {getRoleBadge()}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardLink()} className="flex items-center cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {user.role === "buyer" ? "My Profile" : "Dashboard"}
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "buyer" && (
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
                    <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col gap-1">
              <Link href="/listings" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                  Browse Listings
                </Button>
              </Link>
              <Link href="/how-it-works" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                  How It Works
                </Button>
              </Link>
              <Link href="/agents" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                  Our Agents
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                    Sign In
                  </Button>
                </Link>
              )}
              {/* Mobile Buyer CTA */}
              {isAuthenticated && user?.role === "buyer" && (
                <Button
                  className="w-full mt-2"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setShowDemandDialog(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Demand
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Demand Dialog for Buyers */}
      <DemandDialog
        open={showDemandDialog}
        onOpenChange={setShowDemandDialog}
      />
    </header>
  )
}
