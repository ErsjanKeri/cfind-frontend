"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCountryCookie, setCountryCookie, detectCountryFromBrowser } from "@/lib/country"

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    const saved = getCountryCookie()
    if (saved) {
      router.replace(`/${saved}`)
      return
    }

    const detected = detectCountryFromBrowser()
    setCountryCookie(detected)
    router.replace(`/${detected}`)
  }, [router])

  return null
}
