import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export { getErrorMessage } from '@/lib/api/client'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string | null | undefined) {
  return (name || "User")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}
