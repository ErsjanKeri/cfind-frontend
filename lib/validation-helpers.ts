/**
 * Validation helper functions for consistent form validation
 */

// Phone number validation (international format)
export function validatePhone(phone: string): string | null {
  if (!phone) return null

  // Basic validation: starts with + and contains only digits, spaces, dashes, parentheses
  const phoneRegex = /^\+?[\d\s\-()]+$/
  if (!phoneRegex.test(phone)) {
    return "Please enter a valid phone number (e.g., +383 44 123 456)"
  }

  // Check minimum length (at least 8 digits)
  const digitsOnly = phone.replace(/\D/g, '')
  if (digitsOnly.length < 8) {
    return "Phone number must contain at least 8 digits"
  }

  return null
}

// URL validation
export function validateUrl(url: string): string | null {
  if (!url) return null

  try {
    new URL(url)
    return null
  } catch {
    return "Please enter a valid URL (e.g., https://example.com)"
  }
}

// File size validation
export function validateFileSize(file: File, maxSizeMB: number): string | null {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
    return `File is ${fileSizeMB}MB. Maximum size is ${maxSizeMB}MB. Please compress the file.`
  }
  return null
}

// File type validation
export function validateFileType(file: File, allowedTypes: string[]): string | null {
  const fileType = file.type
  const fileExt = file.name.split('.').pop()?.toLowerCase()

  const isAllowed = allowedTypes.some(type => {
    if (type.startsWith('.')) {
      return type === `.${fileExt}`
    }
    return fileType.startsWith(type)
  })

  if (!isAllowed) {
    return `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
  }

  return null
}

// Character length validation
export function validateLength(
  value: string,
  min?: number,
  max?: number,
  fieldName: string = "Field"
): string | null {
  if (min !== undefined && value.length < min) {
    return `${fieldName} must be at least ${min} characters`
  }
  if (max !== undefined && value.length > max) {
    return `${fieldName} must be at most ${max} characters`
  }
  return null
}

// Number range validation
export function validateNumber(
  value: number,
  min?: number,
  max?: number,
  fieldName: string = "Value"
): string | null {
  if (isNaN(value)) {
    return `${fieldName} must be a valid number`
  }
  if (min !== undefined && value < min) {
    return `${fieldName} must be at least ${min}`
  }
  if (max !== undefined && value > max) {
    return `${fieldName} must be at most ${max}`
  }
  return null
}

// Email validation
export function validateEmail(email: string): string | null {
  if (!email) return null

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address"
  }

  return null
}

// Password strength validation
export function validatePasswordStrength(password: string): {
  isValid: boolean
  errors: string[]
  strength: 'weak' | 'medium' | 'strong'
} {
  const errors: string[] = []
  let strength: 'weak' | 'medium' | 'strong' = 'weak'

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters")
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Include at least one lowercase letter")
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Include at least one uppercase letter")
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Include at least one number")
  }

  // Determine strength
  if (errors.length === 0) {
    if (password.length >= 12 && /[^a-zA-Z0-9]/.test(password)) {
      strength = 'strong'
    } else {
      strength = 'medium'
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength
  }
}
