"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { countries, type CountryCode, VALID_COUNTRY_CODES } from "@/lib/constants"
import { getCountryCookie, setCountryCookie } from "@/lib/country"

export default function SplashPage() {
  const router = useRouter()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const saved = getCountryCookie()
    if (saved) {
      router.replace(`/${saved}`)
    } else {
      setShow(true)
    }
  }, [router])

  const handleSelect = (code: CountryCode) => {
    setCountryCookie(code)
    router.replace(`/${code}`)
  }

  if (!show) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <div className="w-full max-w-lg space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Cfind</h1>
          <p className="text-muted-foreground">Where are you looking to buy or sell a business?</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {VALID_COUNTRY_CODES.map((code) => {
            const c = countries[code]
            return (
              <button
                key={code}
                onClick={() => handleSelect(code)}
                className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border bg-card hover:border-primary hover:shadow-md transition-all cursor-pointer"
              >
                <span className="text-5xl">{c.flag}</span>
                <span className="font-semibold text-lg">{c.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
