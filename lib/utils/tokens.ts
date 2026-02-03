/**
 * Token generation utilities
 */

/**
 * Generate a cryptographically secure random token
 * Used for email verification, password reset, etc.
 */
export function generateToken(): string {
  const crypto = require("crypto")
  return crypto.randomBytes(32).toString("hex")
}
