---
paths:
  - "lib/api/auth.ts"
  - "lib/api/client.ts"
  - "lib/hooks/useAuth.ts"
  - "lib/hooks/useRole.ts"
  - "middleware.ts"
---

# Authentication & Authorization Rules

## Auth Stack
- Cookie-based JWT managed by FastAPI backend
- Backend sets `access_token` and `refresh_token` as httpOnly cookies
- `lib/api/client.ts` Axios interceptor auto-refreshes on 401
- CSRF token attached via `X-CSRF-Token` header on state-changing requests
- No NextAuth, no Prisma, no server actions

## Three User Roles

| Role | Can Do | Cannot Do |
|------|--------|-----------|
| `buyer` | Browse listings, save listings, contact agents, create demands | Create listings, claim demands, access admin |
| `agent` | All buyer actions + create/manage own listings, claim demands | Access admin, edit others' listings |
| `admin` | Everything | - |

## Auth Hooks

- `useUser()` — current user from `GET /api/users/me`, returns `null` if unauthenticated
- `useAuth()` — `login()` and `logout()` functions
- `useInvalidateUser()` — force-refetch user data after profile changes
- `useRole()` — derived helpers: `isAgent`, `isVerifiedAgent`, `isBuyer`, `isAdmin`

## Agent Verification

`verification_status` on `AgentProfile`: `"pending"` | `"approved"` | `"rejected"`

- Agents must be approved + have 3 documents uploaded to create listings
- Use `useRole().isVerifiedAgent` for UI checks
- Backend enforces verification on all agent-restricted endpoints

## Middleware

- Protected routes (`/profile`, `/settings`): redirect to `/login` if no `access_token` cookie
- Guest-only routes (`/login`, `/register`): redirect to `/profile` if authenticated
- Country redirect: `/` → `/{country}` based on cookie
