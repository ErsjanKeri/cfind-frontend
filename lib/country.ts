import { isValidCountryCode, DEFAULT_COUNTRY, type CountryCode } from "@/lib/constants"

const COOKIE_NAME = "country"
const MAX_AGE = 60 * 60 * 24 * 365 // 1 year

/**
 * Read country from cookie (client-side only)
 */
export function getCountryCookie(): CountryCode | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]+)`))
  const value = match?.[1]
  if (value && isValidCountryCode(value)) return value
  return null
}

/**
 * Set country cookie (client-side)
 */
export function setCountryCookie(code: CountryCode): void {
  document.cookie = `${COOKIE_NAME}=${code};path=/;max-age=${MAX_AGE};samesite=lax`
}

/**
 * Get country from cookie or fall back to default.
 * Useful when you need a guaranteed value.
 */
export function getCountryOrDefault(): CountryCode {
  return getCountryCookie() ?? DEFAULT_COUNTRY
}

/**
 * Detect country from browser timezone and language.
 * - Middle East timezones or Arabic language → UAE
 * - Albania timezone → Albania
 * - Everything else (Europe, English, etc.) → Switzerland
 */
export function detectCountryFromBrowser(): CountryCode {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""
    const lang = (navigator.language || "").toLowerCase()

    // Albania
    if (tz === "Europe/Tirane") return "al"

    // UAE / Middle East
    const middleEastTzPrefixes = ["Asia/Dubai", "Asia/Riyadh", "Asia/Qatar", "Asia/Bahrain", "Asia/Kuwait", "Asia/Muscat"]
    if (middleEastTzPrefixes.some(p => tz.startsWith(p)) || lang.startsWith("ar")) return "ae"

    // Default: Switzerland
    return "ch"
  } catch {
    return DEFAULT_COUNTRY
  }
}
