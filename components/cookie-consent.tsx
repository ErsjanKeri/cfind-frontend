"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Cookie, Shield, Settings, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false,
  })

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    }
    localStorage.setItem("cookie-consent", JSON.stringify(allAccepted))
    localStorage.setItem("cookie-consent-date", new Date().toISOString())
    setIsVisible(false)
  }

  const handleAcceptSelected = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences))
    localStorage.setItem("cookie-consent-date", new Date().toISOString())
    setIsVisible(false)
  }

  const handleRejectNonEssential = () => {
    const essentialOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    }
    localStorage.setItem("cookie-consent", JSON.stringify(essentialOnly))
    localStorage.setItem("cookie-consent-date", new Date().toISOString())
    setIsVisible(false)
  }

  if (!isVisible) return null

  const content = {
    title: "We value your privacy",
    description:
      'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.',
    learnMore: "Learn more about how we use cookies in our",
    cookiePolicy: "Cookie Policy",
    acceptAll: "Accept All",
    rejectNonEssential: "Essential Only",
    savePreferences: "Save Preferences",
    customize: "Customize",
    hideDetails: "Hide Details",
    necessary: {
      title: "Essential Cookies",
      description: "Required for the website to function. Cannot be disabled.",
    },
    analytics: {
      title: "Analytics Cookies",
      description: "Help us understand how visitors interact with our website.",
    },
    marketing: {
      title: "Marketing Cookies",
      description: "Used to deliver relevant advertisements and track campaigns.",
    },
    preferences: {
      title: "Preference Cookies",
      description: "Remember your settings and preferences for a better experience.",
    },
  }

  const t = content

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <Card className="mx-auto max-w-2xl shadow-xl border-border/50 bg-card/95 backdrop-blur-sm">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Cookie className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-lg">{t.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{t.description}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {t.learnMore}{" "}
                <Link href="/cookies" className="text-primary hover:underline">
                  {t.cookiePolicy}
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Expandable Details */}
          {showDetails && (
            <div className="mb-4 space-y-3 pt-4 border-t">
              {/* Necessary */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-verified" />
                  <div>
                    <Label className="font-medium text-sm">{t.necessary.title}</Label>
                    <p className="text-xs text-muted-foreground">{t.necessary.description}</p>
                  </div>
                </div>
                <Switch checked={true} disabled className="opacity-50" />
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <Label className="font-medium text-sm">{t.analytics.title}</Label>
                  <p className="text-xs text-muted-foreground">{t.analytics.description}</p>
                </div>
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, analytics: checked }))}
                />
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <Label className="font-medium text-sm">{t.marketing.title}</Label>
                  <p className="text-xs text-muted-foreground">{t.marketing.description}</p>
                </div>
                <Switch
                  checked={preferences.marketing}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, marketing: checked }))}
                />
              </div>

              {/* Preferences */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <Label className="font-medium text-sm">{t.preferences.title}</Label>
                  <p className="text-xs text-muted-foreground">{t.preferences.description}</p>
                </div>
                <Switch
                  checked={preferences.preferences}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, preferences: checked }))}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" size="sm" onClick={() => setShowDetails(!showDetails)} className="gap-2">
              <Settings className="h-4 w-4" />
              {showDetails ? t.hideDetails : t.customize}
              {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
            <div className="flex-1" />
            <Button variant="outline" size="sm" onClick={handleRejectNonEssential}>
              {t.rejectNonEssential}
            </Button>
            {showDetails ? (
              <Button size="sm" onClick={handleAcceptSelected}>
                {t.savePreferences}
              </Button>
            ) : (
              <Button size="sm" onClick={handleAcceptAll}>
                {t.acceptAll}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
