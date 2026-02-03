---
paths:
  - "lib/actions.ts"
  - "lib/auth*.ts"
  - "auth.ts"
  - "auth.config.ts"
  - "middleware.ts"
  - "app/api/auth/**/*.ts"
---

# Authentication & Authorization Rules

## Auth Stack
- NextAuth v5 with credential provider
- Argon2 password hashing
- JWT sessions with extended fields

## Three User Roles

| Role | Can Do | Cannot Do |
|------|--------|-----------|
| `buyer` | Browse listings, save listings, contact agents, create demands | Create listings, claim demands, access admin |
| `agent` | All buyer actions + create/manage own listings, claim demands | Access admin, edit others' listings |
| `admin` | Everything | - |

## Session Fields

```typescript
// Available in session.user (after JWT callback)
interface ExtendedUser {
  id: string
  role: string  // "buyer" | "agent" | "admin"
  name: string
  image: string | null
  verificationStatus: string  // "pending" | "approved" | "rejected"
  createdAt: Date
  licenseDocumentUrl: string | null
  companyDocumentUrl: string | null
  idDocumentUrl: string | null
}
```

## Email Verification

- `emailVerified` must be `true` to login
- Unverified users are rejected with `EmailNotVerifiedError`
- This is enforced in the credential provider in `auth.ts`

## Agent Verification System

**CRITICAL**: `verificationStatus` is the **single source of truth** for agent verification.

**Status values**: `"pending"` | `"approved"` | `"rejected"`

### Checking Verification Status

```typescript
// WRONG - JWT may contain stale data
if (session.user.verificationStatus === "approved") { ... }

// CORRECT - Always re-fetch from database for critical operations
const agentProfile = await prisma.agentProfile.findUnique({
  where: { userId: session.user.id },
  select: {
    verificationStatus: true,
    licenseDocumentUrl: true,
    companyDocumentUrl: true,
    idDocumentUrl: true
  }
})

if (agentProfile?.verificationStatus !== "approved") {
  return { error: "Only verified agents can perform this action" }
}

// Also check required documents
if (!agentProfile.licenseDocumentUrl || !agentProfile.companyDocumentUrl || !agentProfile.idDocumentUrl) {
  return { error: "Please upload all required documents" }
}
```

### Verification Requirements

Agents must have:
1. `verificationStatus === "approved"`
2. All 3 documents uploaded: `licenseDocumentUrl`, `companyDocumentUrl`, `idDocumentUrl`

### Verification Actions

- `verifyAgentAction()` - Admin approves agent
- `rejectAgentAction()` - Admin rejects with reason, sends email
- `resubmitAgentVerificationAction()` - Agent resubmits after rejection

## Authorization Patterns

### Server Actions MUST check auth:
```typescript
export async function protectedAction() {
  const session = await auth();

  // Check authentication
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  // Check role if needed
  if (session.user.role !== "agent") {
    return { error: "Only agents can perform this action" };
  }

  // Check verification from DATABASE (not JWT!)
  const profile = await prisma.agentProfile.findUnique({
    where: { userId: session.user.id },
    select: { verificationStatus: true }
  })
  if (profile?.verificationStatus !== "approved") {
    return { error: "Only verified agents can perform this action" }
  }

  // Check ownership for resource-specific actions
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (listing?.agentId !== session.user.id && session.user.role !== "admin") {
    return { error: "You can only edit your own listings" };
  }
}
```

### Middleware protects routes:
- `/profile` and `/settings` require authentication
- Logged-in users redirected away from `/login` and `/register`

## Security Rules

1. NEVER trust client-side role checks alone
2. ALWAYS verify on server
3. NEVER trust JWT for verification status - always check database
4. NEVER expose user passwords or tokens
5. ALWAYS use Argon2 for password operations
6. NEVER store plain text passwords
