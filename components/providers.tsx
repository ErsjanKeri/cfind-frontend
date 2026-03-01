"use client"

import type React from "react"
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
