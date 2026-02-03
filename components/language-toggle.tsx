"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LanguageToggleProps {
  activeLanguage: "en" | "sq"
  onLanguageChange: (language: "en" | "sq") => void
  className?: string
}

export function LanguageToggle({ activeLanguage, onLanguageChange, className }: LanguageToggleProps) {
  return (
    <div className={cn("inline-flex rounded-lg border border-border/60 p-1 bg-muted/30", className)}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onLanguageChange("en")}
        className={cn(
          "px-4 py-1.5 text-sm font-medium transition-all",
          activeLanguage === "en"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-transparent"
        )}
      >
        🇬🇧 English
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onLanguageChange("sq")}
        className={cn(
          "px-4 py-1.5 text-sm font-medium transition-all",
          activeLanguage === "sq"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-transparent"
        )}
      >
        🇦🇱 Shqip
      </Button>
    </div>
  )
}
