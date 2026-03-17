import type React from "react"
import type { Metadata, Viewport } from "next"
import { QueryProvider } from "@/lib/providers/query-provider"
import { CookieConsent } from "@/components/shared/cookie-consent"
import "./globals.css"

// Updated metadata for Cfind
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://www.cfind.ai"),
  title: "Cfind - Business Acquisition Marketplace in Albania",
  description:
    "The secure, agent-driven marketplace for business acquisitions. Verified agents, vetted buyers, confidential listings.",
  keywords: ["business for sale", "albania", "acquisition", "investment", "restaurant", "hotel"],
  icons: {
    icon: "/cfind.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Cfind - Business Acquisition Marketplace",
    description: "The secure, agent-driven marketplace for business acquisitions. Verified agents, vetted buyers, confidential listings.",
    images: ["/cfind-text.png"],
    siteName: "Cfind",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cfind - Business Acquisition Marketplace",
    description: "The secure, agent-driven marketplace for business acquisitions. Verified agents, vetted buyers, confidential listings.",
    images: ["/cfind-text.png"],
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
