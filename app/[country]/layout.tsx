import { notFound } from "next/navigation"
import { isValidCountryCode } from "@/lib/constants"

export default async function CountryLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ country: string }>
}) {
  const { country } = await params

  if (!isValidCountryCode(country)) {
    notFound()
  }

  return <>{children}</>
}
