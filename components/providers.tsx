"use client"

import type React from "react"
// Phase 4: New auth context with FastAPI JWT backend (NextAuth removed!)
import { AuthProvider } from "@/lib/contexts/auth-context"
import { QueryProvider } from "@/lib/providers/query-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryProvider>
  )
}
