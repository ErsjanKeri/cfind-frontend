# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Rules

- Work in small chunks. Think first, ask first if unclear.
- NEVER over-engineer. Simplest solution first.
- ALWAYS read existing files before modifying. Check how similar things are already done.
- Follow existing patterns — don't invent new ones.
- Prefer editing existing files over creating new ones.
- Do not write tests unless explicitly asked.
- Only commit/push when explicitly told to.
- Do not add verbose section divider comments. Keep comments minimal.

## Project Overview

CompanyFinder is a business acquisition marketplace. Verified agents list businesses for sale; vetted buyers browse and contact agents. The platform maintains business confidentiality by showing limited public information until buyers engage.

This is a **frontend-only** Next.js application. The backend is a separate FastAPI service (repo: `cfind-backend`) that handles database, auth, S3 uploads, and email.

**Tech Stack**: Next.js 16 (App Router), React 19, TypeScript, TanStack Query v5, Axios, Tailwind CSS v4, Radix UI / shadcn/ui, Vitest

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
- Middleware (`middleware.ts`) does a simple cookie-presence check for protected routes (`/profile`, `/settings`) and redirects guests away; redirects logged-in users away from `/login`, `/register`
- No NextAuth — auth state comes from `useUser()` hook which calls `GET /api/users/me`

### Country Routing

The app supports multiple countries (`al` = Albania, `ae` = UAE). Listings and demands are scoped by country:
- URL pattern: `/{country}/listings`, `/{country}/listings/{id}`
- Middleware redirects `/` to `/{country}` if a `country` cookie exists
- Country codes and flags defined in `lib/constants.ts`; cities and neighbourhoods are DB-driven via `lib/api/geography.ts` and `lib/hooks/useGeography.ts`

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

Modules: `auth.ts`, `user.ts`, `listings.ts`, `leads.ts`, `demands.ts`, `promotions.ts`, `admin.ts`, `upload.ts`, `chat.ts`, `geography.ts`

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
| `useConversations()` | List AI chat conversations |
| `useSendMessage()` | Send message to AI agent (optimistic updates) |
| `useCityNames(countryCode?)` | City names for a country (from geography API) |
| `useNeighbourhoodNames(cityId?)` | Neighbourhood names for a city (from geography API) |
| `useAdminCreateCity()` | Admin mutation to create a city |
| `useAdminCreateNeighbourhood()` | Admin mutation to create a neighbourhood |

### Types (`lib/api/types.ts`)

All TypeScript types mirror backend Pydantic schemas using **snake_case** (not camelCase). Keep in sync with backend.

Key types: `User`, `UserWithProfile`, `AgentProfile`, `Listing`, `BuyerDemand`, `Lead`, `CreditPackage`, `PromotionTierConfig`, `ChatMessageResponse`, `ToolCallResult`, `ToolCallListing`, `ToolCallDemand`, `Conversation`, `City`, `Neighbourhood`, `Country`

### Three User Roles

| Role | Capabilities |
|------|-------------|
| `buyer` | Browse listings, save listings, contact agents, create demands, AI recommendations |
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

Uses `react-hook-form` + `zod`. Forms handle validation inline in their respective components.

### Currency

All API amounts are in EUR. `formatCurrency(amount, currency)` from `lib/currency.ts` supports EUR and ALL (Albanian Lek) display with a hardcoded conversion rate. Currently all components hardcode `"EUR"` — there is no currency context or toggle UI.

## Key Files

| File | Purpose |
|------|---------|
| `lib/api/client.ts` | Axios instance with JWT refresh + CSRF interceptors |
| `lib/api/types.ts` | All TypeScript types (mirrors backend schemas) |
| `lib/api/index.ts` | Unified `api` object re-exporting all modules |
| `lib/hooks/useAuth.ts` | `useUser()`, `useAuth()`, `useInvalidateUser()` |
| `lib/hooks/useRole.ts` | Derived role helpers (`isAgent`, `isVerifiedAgent`, etc.) |
| `lib/constants.ts` | Business categories, country/city/area data, max price |
| `lib/currency.ts` | Currency formatting (EUR/ALL) |
| `lib/providers/query-provider.tsx` | React Query setup (wraps app) |
| `middleware.ts` | Route protection + country redirect |
| `components/ui/` | shadcn/ui primitives |
| `components/listing-form/` | Multi-step listing creation form |
| `components/dashboard/` | Role-based dashboard views (agent, buyer, admin) |
| `lib/api/chat.ts` | AI chat API module (send message, conversations CRUD) |
| `lib/api/geography.ts` | Geography API module (countries, cities, neighbourhoods) |
| `lib/hooks/useChat.ts` | React Query hooks for AI chat |
| `lib/hooks/useGeography.ts` | Geography hooks (cities, neighbourhoods, admin CRUD) |
| `lib/hooks/use-listing-filters.ts` | Client-side listing filter/sort with URL sync |
| `app/[country]/ai-recommendations/` | AI Recommendations page (buyer-only) |

## AI Recommendations

The AI Recommendations page (`/{country}/ai-recommendations`) lets buyers chat with a Gemini-powered assistant that searches listings and provides personalized recommendations.

- **Buyer-only**: Page shows auth gate for non-buyers. Backend restricts to `buyer`/`admin` roles.
- **Conversation sidebar**: Lists previous conversations; collapsible on mobile.
- **Listing cards from tool calls**: AI responses include `tool_calls` with listing data. The `extractListings()` helper parses these to render clickable `ListingCard` components with image, price, ROI, and category badge.
- **Optimistic updates**: User messages appear immediately; rolled back on error.
- **User context**: Backend injects buyer's country preference and saved listing titles into the AI system prompt.

## Important Constraints

1. **No server actions, no Prisma** — This is a pure frontend; all data goes through the API client
2. **snake_case types** — Types match Python backend schemas, not JavaScript convention
3. **Data privacy** — Never render `real_business_name`, `real_description_en`, or exact address in public-facing components
4. **Public listings only from approved agents** — Backend enforces this, but UI should also respect it
5. **English only** — No Albanian fields exist
6. **Listing statuses**: `draft` | `active` | `sold` | `inactive`
7. **Buyer demand deletion**: Only `"active"` demands can be deleted (assigned/fulfilled/closed are kept for history)
8. **Agent verification required** for: creating listings, claiming demands

## Known Bugs

1. **`agent_agency_name` vs `agent_agency` naming split** (`lib/api/types.ts`) — `Listing` and `BuyerLead` use `agent_agency_name` (matching backend schemas). `ToolCallListing` uses `agent_agency` (matching backend `agent_service.py` tool output). This is intentional — different backend endpoints use different field names.

