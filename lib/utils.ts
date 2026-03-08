import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(error: unknown, fallback = "An unexpected error occurred"): string {
  if (error instanceof Error) return error.message
  if (typeof error === "string") return error
  return fallback
}

export function getInitials(name: string | null | undefined) {
  return (name || "User")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}
