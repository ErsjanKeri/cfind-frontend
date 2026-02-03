/**
 * Currency utilities for formatting EUR and ALL (Albanian Lek)
 * Extracted from locale-context for standalone use after i18n removal
 */

export type Currency = "EUR" | "ALL"

const EUR_TO_ALL_RATE = 100

/**
 * Format a number as currency (EUR or ALL)
 * @param amount - The amount in EUR
 * @param currency - The target currency (EUR or ALL)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: Currency = "EUR"): string {
  if (currency === "ALL") {
    const allAmount = amount * EUR_TO_ALL_RATE
    return new Intl.NumberFormat("sq-AL", {
      style: "currency",
      currency: "ALL",
      maximumFractionDigits: 0,
    }).format(allAmount)
  }

  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount)
}
