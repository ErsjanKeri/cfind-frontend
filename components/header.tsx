"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth, useUser } from "@/lib/hooks/useAuth"
import { useRole } from "@/lib/hooks/useRole"
import { Button } from "@/components/ui/button"
import { Building2, Menu, X, Plus, Sparkles } from "lucide-react"
import { DemandDialog } from "@/components/demands/demand-dialog"
import { CountryPicker } from "@/components/header/country-picker"
import { UserMenu } from "@/components/header/user-menu"
import { isValidCountryCode, type CountryCode } from "@/lib/constants"
import { setCountryCookie, getCountryOrDefault } from "@/lib/country"
import { api } from "@/lib/api"

export function Header() {
  const { logout } = useAuth() // Auth actions only
  const { user, isLoading } = useUser() // User data via JWT cookie
  const { isBuyer, isAgent, isAdmin, isRejectedAgent, isVerifiedAgent, isPendingAgent } = useRole()
  const isAuthenticated = !!user // Derived from user data
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showDemandDialog, setShowDemandDialog] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Extract country from URL (e.g. /al/listings → "al"), fall back to cookie
  const pathSegments = pathname?.split("/").filter(Boolean) || []
  const urlCountry = pathSegments[0] && isValidCountryCode(pathSegments[0]) ? pathSegments[0] : null
  const currentCountry: CountryCode = urlCountry || getCountryOrDefault()

  const handleCountrySwitch = (code: CountryCode) => {
    setCountryCookie(code)

    // Persist to backend if logged in (fire-and-forget)
    if (isAuthenticated) {
      api.user.updateProfile({ country_preference: code }).catch(() => {})
    }

    if (urlCountry) {
      // Replace country prefix in current path: /al/listings → /ae/listings
      const rest = pathSegments.slice(1).join("/")
      router.push(`/${code}${rest ? `/${rest}` : ""}`)
    } else {
      router.push(`/${code}`)
    }
  }

  const getRoleBadge = () => {
    if (!user) return null

    if (isAdmin) {
      return <span className="text-xs text-primary font-medium">Admin</span>
    }

    if (isAgent) {
      if (isRejectedAgent) {
        return <span className="text-xs text-red-600 font-medium">Verification Rejected</span>
      }
      if (isVerifiedAgent) {
        return <span className="text-xs text-emerald-600 font-medium">Licensed Agent</span>
      }
      return <span className="text-xs text-amber-600 font-medium">Pending Approval</span>
    }

    if (isBuyer) {
      return <span className="text-xs text-muted-foreground">Buyer</span>
    }

    return null
  }

  const isActive = (path: string) => {
    if (path.endsWith("/listings")) return pathname?.includes("/listings")
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
              href={`/${currentCountry}/listings`}
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive(`/${currentCountry}/listings`) ? "text-primary" : "text-muted-foreground"
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
            {/* Buyer Actions */}
            {isAuthenticated && isBuyer && (
              <>
                <Link
                  href={`/${currentCountry}/ai-recommendations`}
                  className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${isActive(`/${currentCountry}/ai-recommendations`) ? "text-primary" : "text-muted-foreground"}`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Recs
                </Link>
                <Button
                  size="sm"
                  onClick={() => setShowDemandDialog(true)}
                  className="ml-2"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Post New Demand
                </Button>
              </>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1">
            <CountryPicker currentCountry={currentCountry} onCountrySwitch={handleCountrySwitch} />

            {isLoading ? (
              // Show skeleton while loading auth state
              <div className="h-9 w-24 bg-muted animate-pulse rounded-md" />
            ) : isAuthenticated && user ? (
              <UserMenu
                userName={user.name}
                userEmail={user.email}
                userImage={user.image}
                isBuyer={isBuyer}
                country={currentCountry}
                roleBadge={getRoleBadge()}
                onLogout={logout}
              />
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
              <Link href={`/${currentCountry}/listings`} onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                  Browse Listings
                </Button>
              </Link>
              <Link href="/how-it-works" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                  How It Works
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                    Sign In
                  </Button>
                </Link>
              )}
              {/* Mobile Buyer Actions */}
              {isAuthenticated && isBuyer && (
                <>
                  <Link href={`/${currentCountry}/ai-recommendations`} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI Recommendations
                    </Button>
                  </Link>
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
                </>
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
