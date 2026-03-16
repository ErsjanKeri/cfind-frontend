import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export { getErrorMessage } from '@/lib/api/client'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  return new Date(date).toLocaleDateString('en-US', options)
}

export function getWhatsAppUrl(phone: string, message?: string): string {
  const cleaned = phone.replace(/[^0-9]/g, '')
  const url = `https://wa.me/${cleaned}`
  return message ? `${url}?text=${encodeURIComponent(message)}` : url
}

export function getInitials(name: string | null | undefined) {
  return (name || "User")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}
