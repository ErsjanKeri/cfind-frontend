import type React from "react"
import type { Metadata, Viewport } from "next"
import { QueryProvider } from "@/lib/providers/query-provider"
import { CookieConsent } from "@/components/shared/cookie-consent"
import "./globals.css"

// Updated metadata for Company Finder
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://companyfinder.al"),
  title: "CompanyFinder - Business Acquisition Marketplace in Albania",
  description:
    "The secure, agent-driven marketplace for business acquisitions. Verified agents, vetted buyers, confidential listings.",
  generator: "v0.app",
  keywords: ["business for sale", "albania", "acquisition", "investment", "restaurant", "hotel"],
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#3b5998",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <QueryProvider>
          {children}
          <CookieConsent />
        </QueryProvider>
      </body>
    </html>
  )
}
