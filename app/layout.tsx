import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/providers"
import { CookieConsent } from "@/components/cookie-consent"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

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
        <Providers>
          {children}
          <CookieConsent />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
