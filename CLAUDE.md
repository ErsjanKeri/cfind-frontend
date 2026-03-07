# Rules

- Work in small chunks. Think first, ask first if unclear.
- NEVER over-engineer. Simplest solution first.
- ALWAYS read existing files before modifying. Check how similar things are already done.
- Follow existing patterns — don't invent new ones.
- Prefer editing existing files over creating new ones.
- Do not write tests unless explicitly asked.
- Only commit/push when explicitly told to.
- Do not add verbose section divider comments. Keep comments minimal.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CompanyFinder is a business acquisition marketplace for Albania. Verified agents list businesses for sale; vetted buyers browse and contact agents. The platform maintains business confidentiality by showing limited public information until buyers engage.

This is a **frontend-only** Next.js application. The backend is a separate FastAPI service (repo: `cfind-backend`) that handles database, auth, S3 uploads, and email.

**Tech Stack**: Next.js 16 (App Router), React 19, TypeScript, TanStack Query v5, Axios, Tailwind CSS v4, Radix UI / shadcn/ui

**Language**: English only (no Albanian translations)

## Development Commands

```bash
npm run dev          # Dev server on localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npx vitest           # Run tests (vitest, node environment)
npx vitest run path  # Run single test file
```

The backend API URL defaults to `http://localhost:8000` (set via `NEXT_PUBLIC_API_URL`).

## Architecture

### Frontend-Backend Split

This frontend has **no database, no Prisma, no server actions**. All data flows through a REST API:

```
Frontend (this repo)              Backend (cfind-backend, FastAPI)
  lib/api/client.ts  ----HTTP---->  /api/auth/*, /api/listings/*, etc.
  lib/hooks/          <---JSON----  PostgreSQL, S3, Email
```

### Authentication

Cookie-based JWT managed entirely by the backend:
- Backend sets `access_token` and `refresh_token` as httpOnly cookies
- `lib/api/client.ts` has an Axios interceptor that auto-refreshes on 401
- CSRF token sent via `X-CSRF-Token` header on state-changing requests
- Middleware (`middleware.ts`) does a simple cookie-presence check for protected routes (`/profile`, `/settings`)
- No NextAuth - auth state comes from `useUser()` hook which calls `GET /api/users/me`

### API Client Layer (`lib/api/`)

Organized by domain, all accessed through a unified object:

```typescript
import { api } from '@/lib/api';

await api.auth.login({ email, password });
await api.listings.getListings(filters);
await api.user.getProfile();
await api.demands.claimDemand(id);
await api.admin.verifyAgent(agentId);
await api.promotions.promoteListing(listingId, { tier: 'featured' });
await api.upload.uploadFile(file, 'listing');
```

Modules: `auth.ts`, `user.ts`, `listings.ts`, `leads.ts`, `demands.ts`, `promotions.ts`, `admin.ts`, `upload.ts`

### React Query Hooks (`lib/hooks/`)

Every API module has a corresponding hooks file with `useQuery`/`useMutation` wrappers:

| Hook | Purpose |
|------|---------|
| `useUser()` | Current user (from `/api/users/me`), returns `null` if unauthenticated |
| `useAuth()` | `login()` and `logout()` functions |
| `useInvalidateUser()` | Force-refetch user data after profile changes |
| `useRole()` | Derived role/verification state: `isAgent`, `isVerifiedAgent`, etc. |
| `useListings(filters?)` | Browse listings with pagination/filters |
| `useCreateListing()` | Mutation for creating listings |
| `useLeads()` | Lead tracking (buyer-agent interactions) |
| `useDemands()` | Buyer demand CRUD |
| `usePromotions()` | Credit/promotion operations |
| `useAdmin()` | Admin operations |

### Types (`lib/api/types.ts`)

All TypeScript types mirror backend Pydantic schemas using **snake_case** (not camelCase). Keep in sync with backend.

Key types: `User`, `UserWithProfile`, `AgentProfile`, `Listing`, `BuyerDemand`, `Lead`, `CreditPackage`, `PromotionTierConfig`

### Three User Roles

| Role | Capabilities |
|------|-------------|
| `buyer` | Browse listings, save listings, contact agents, create demands |
| `agent` | All buyer actions + create/manage listings, claim demands (requires `verification_status: "approved"`) |
| `admin` | Everything: user management, agent verification, credit adjustment, listing moderation |

### Agent Verification

`verification_status` on `AgentProfile` is the source of truth: `"pending"` | `"approved"` | `"rejected"`

- Agents must be approved + have 3 documents uploaded to create listings
- Use `useRole().isVerifiedAgent` for UI checks
- Backend enforces verification on all agent-restricted endpoints

### Data Privacy (Two-Tier Visibility)

Listings have public and private fields. The **backend** controls which fields are returned based on the requester's role:

- **Public**: `public_title_en`, `public_description_en`, `public_location_city_en`, financials, agent contact
- **Private** (agent owner/admin only): `real_business_name`, `real_location_address`, `real_description_en`, coordinates

Frontend components should only use `real_*` fields in agent dashboard or admin views, never in public listing cards.

### File Uploads

Frontend sends files to backend, which handles S3 upload:
```typescript
const url = await api.upload.uploadFile(croppedFile, 'listing'); // 'avatar' | 'listing' | 'document'
```

Agent documents (license, company, ID) are uploaded via `api.user.updateAgentProfile()` as multipart/form-data.

### Form Handling

Uses `react-hook-form` + `zod`. Schemas defined in `lib/schemas.ts`:
- `ListingSchema` - Multi-step listing creation form
- `BuyerDemandSchema` - Buyer demand creation

### Currency

Dual display: EUR and ALL (Albanian Lek). Rate: 100 ALL = 1 EUR. Use `formatCurrency(amount, currency)` from `lib/currency.ts`. All API amounts are in EUR; conversion is display-only.

## Key Files

| File | Purpose |
|------|---------|
| `lib/api/client.ts` | Axios instance with JWT refresh + CSRF interceptors |
| `lib/api/types.ts` | All TypeScript types (mirrors backend schemas) |
| `lib/api/index.ts` | Unified `api` object re-exporting all modules |
| `lib/hooks/useAuth.ts` | `useUser()`, `useAuth()`, `useInvalidateUser()` |
| `lib/hooks/useRole.ts` | Derived role helpers (`isAgent`, `isVerifiedAgent`, etc.) |
| `lib/schemas.ts` | Zod validation schemas |
| `lib/constants.ts` | Business categories, Albanian cities, max price |
| `lib/currency.ts` | Currency formatting (EUR/ALL) |
| `lib/providers/query-provider.tsx` | React Query setup (wraps app) |
| `middleware.ts` | Route protection (cookie-presence check) |
| `components/ui/` | shadcn/ui primitives |
| `components/listing-form/` | Multi-step listing creation form |
| `components/dashboard/` | Role-based dashboard views (agent, buyer, admin) |

## Important Constraints

1. **No server actions, no Prisma** - This is a pure frontend; all data goes through the API client
2. **snake_case types** - Types match Python backend schemas, not JavaScript convention
3. **Data privacy** - Never render `real_business_name`, `real_description_en`, or exact address in public-facing components
4. **Public listings only from approved agents** - Backend enforces this, but UI should also respect it
5. **English only** - No Albanian (`*Sq`) fields exist
6. **Listing statuses**: `draft` | `active` | `sold` | `inactive`
7. **Buyer demand deletion**: Only `"active"` demands can be deleted (assigned/fulfilled/closed are kept for history)
8. **Agent verification required** for: creating listings, claiming demands

## .claude/ Configuration

### Custom Commands

| Command | Description |
|---------|-------------|
| `/fix-ts` | Find and fix all TypeScript errors |
| `/test` | Run the test suite |
| `/lint` | Run ESLint and auto-fix |
| `/build` | Run production build |
| `/db` | Database operations (migrate, push, seed) |
| `/review-ui` | UI/UX review of a page |

### Subagents

| Agent | Purpose |
|-------|---------|
| `ui-reviewer` | Visual UI/UX validation with Playwright |
| `code-reviewer` | Code quality & security review |
| `ts-fixer` | Fix TypeScript errors systematically |
| `test-runner` | Run and fix failing tests |
| `deep-researcher` | Research libraries/approaches |

### Path-Specific Rules

Rules in `.claude/rules/` provide context-specific guidance for auth, listings, and component patterns. **Note**: These rules reference the old full-stack architecture (Prisma, server actions) and need updating - the backend enforcement patterns they describe are now handled by the FastAPI backend, not this frontend.