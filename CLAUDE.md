# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CompanyFinder is a business acquisition marketplace platform for Albania. It connects verified agents who list businesses for sale with vetted buyers. The platform maintains business confidentiality by showing limited public information until buyers are qualified.

**Vision**: Become the **status quo platform for buying and selling businesses in Albania**.

**Tech Stack**: Next.js 16 (App Router), React 19, TypeScript, Prisma (PostgreSQL), NextAuth v5, AWS S3/DigitalOcean Spaces, Tailwind CSS

**Language**: English only (Albanian translations removed - see `scripts/verify-no-sq-usage.ts`)

**Future Development**: See `PROMOTION_PLANS.md` for the PropertyFinder-style promotion system roadmap.

## Development Commands

```bash
# Development
npm run dev              # Start dev server on localhost:3000

# Building
npm run build           # Production build
npm run start           # Start production server

# Linting
npm run lint            # Run ESLint

# Database
npx prisma migrate dev  # Create and apply migrations
npx prisma db push      # Push schema changes without migrations
npx prisma studio       # Open Prisma Studio GUI
npx prisma db seed      # Seed database with mock data

# Testing
npx vitest              # Run tests (vitest configured)

# Verification
npx tsx scripts/verify-no-sq-usage.ts  # Verify no Albanian fields remain
```

## Architecture Overview

### Authentication & Authorization

- **NextAuth v5** with credential provider using Argon2 password hashing
- Three user roles with strict separation: `buyer`, `agent`, `admin`
- Role-based authorization via middleware (`middleware.ts`), auth config (`auth.config.ts`), and server actions
- **Session Fields**: `id`, `role`, `name`, `image`, `verificationStatus`, `createdAt`, document URLs
- **Protected routes**: `/profile` and `/settings` (authenticated users only)
- **Email verification strictly enforced at login** - unverified users cannot authenticate (throws `EmailNotVerifiedError`)
  - No grace period - users simply cannot login until verified
  - No time-based expiration - unverified accounts remain indefinitely
  - **Admin-created accounts** have `emailVerified: true` by default (intentional bypass)
- Authorization checks enforced in all server actions for role-specific operations

### Agent Verification System

**CRITICAL**: `verificationStatus` is the **single source of truth** for agent verification status.

**Status values**: `"pending"` | `"approved"` | `"rejected"`

- Agents must have `verificationStatus: "approved"` to create listings
- Agents must upload 3 required documents: `licenseDocumentUrl`, `companyDocumentUrl`, `idDocumentUrl`
- JWT tokens may contain stale verification data - always re-fetch from database for critical operations
- Rejection tracking includes: `rejectionReason`, `rejectedAt`, `rejectedBy`
- Agents can resubmit for verification after rejection via `resubmitAgentVerificationAction()`
- **Re-verification**: When agent changes critical fields (license number, agency name, or uploads new documents), status resets to `"pending"` and their **listings become invisible** to public until re-approved

### Data Access Patterns

**Critical**: The platform has a **two-tier data visibility system**:

1. **Public Listings** (`transformPublicListing` in `lib/data.ts`): Visible to all users
   - Hides: `realBusinessName`, `realDescription`, exact `realLocationAddress`, coordinates
   - Shows: Public title/description, approximate area, financials
   - **CRITICAL**: Only shows listings from `approved` agents

2. **Private Listings** (`transformPrivateListing` in `lib/data.ts`): Visible only to listing owner (agent) or admin
   - Shows: All fields including real business name, exact address
   - Used in agent dashboard and admin panel

**When adding features**: Always consider which data visibility mode is appropriate. Use `mode: "public" | "private"` parameter in data fetching functions.

### Database Schema (Prisma)

**Core Models:**

- **User** - Base authentication and identity
  - `role`: `"buyer"` | `"agent"` | `"admin"` (default: `"buyer"`)
  - `emailVerified`: Boolean (default: false) - **must be true to login**
  - Has **ONLY ONE** profile based on role
  - Relations: `sessions`, `listings`, `buyerLeads`, `agentLeads`, `savedListings`, `buyerDemands`, `assignedDemands`

- **AgentProfile** - Extended agent information
  - `verificationStatus`: `"pending"` | `"approved"` | `"rejected"` (single source of truth)
  - Required documents: `licenseDocumentUrl`, `companyDocumentUrl`, `idDocumentUrl`
  - Fields: `agencyName`, `licenseNumber`, `phone`, `whatsapp`, `bioEn`
  - Rejection tracking: `rejectionReason`, `rejectedAt`, `rejectedBy`, `submittedAt`

- **BuyerProfile** - Extended buyer information
  - Fields: `companyName`

- **Listing** - Business listings for sale
  - Public fields (English only): `publicTitleEn`, `publicDescriptionEn`, `publicLocationCityEn`, `publicLocationArea`
  - Private fields: `realBusinessName`, `realLocationAddress`, `realDescriptionEn`, coordinates
  - Financials: `askingPriceEur/Lek`, `monthlyRevenueEur/Lek`, `roi` (stored as `Decimal`)
  - Status: `"draft"` | `"active"` | `"sold"` | `"inactive"` (simplified - agent-controlled only)
  - `isPhysicallyVerified`: Boolean set by **admin only** after on-site visit to verify business exists

- **BuyerDemand** - NEW: Buyers posting what they're looking for
  - Budget: `budgetMinEur/Lek`, `budgetMaxEur/Lek` (dual currency)
  - Fields: `category`, `preferredCityEn`, `preferredArea`, `description`
  - Status: `"active"` | `"assigned"` | `"fulfilled"` | `"closed"`
  - Demand Type: `"investor"` (has money) | `"seeking_funding"` (needs investment)
  - Exclusive assignment: `assignedAgentId`, `assignedAt` (only verified agents can claim)

- **Lead** - Tracks buyer-agent interactions
  - `interactionType`: `"whatsapp"` | `"phone"` | `"email"`
  - **Deduplication**: One lead per buyer+listing+interactionType (so a buyer can create 3 separate leads for same listing via different contact methods)

- **SavedListing** - Bookmarked listings by buyers

- **Token Models**: `EmailVerificationToken`, `PasswordResetToken`

**Important Schema Rules:**
1. All currency fields use Prisma `Decimal` - serialize with `.toNumber()` or JSON.parse/stringify
2. All dates serialize to ISO strings - use `new Date()` before calling date methods
3. **No Albanian (`*Sq`) fields** - English only

### Buyer Demands Feature

New feature allowing buyers to post what they're looking for:

**Workflow:**
1. Buyer creates demand via `createBuyerDemandAction()` (status: `"active"`)
2. Verified agents browse active demands via `getActiveBuyerDemandsAction()`
3. Agent claims demand via `claimBuyerDemandAction()` (status becomes `"assigned"`)
4. Email notification sent to buyer with agent contact info
5. Buyer marks as `"fulfilled"` or `"closed"` when complete

**Deletion Rules (Historical Tracking):**
- `"active"` demands: Can be deleted by buyer or admin
- `"assigned"` demands: **Cannot be deleted** (agent has committed)
- `"fulfilled"` / `"closed"` demands: **Cannot be deleted** (kept for historical tracking)

**Components:**
- `DemandDialog` - Form for creating demands
- `DemandCard` - Display card with variant for buyer/agent views

### File Upload Flow

1. Client calls `uploadImagesAction()` with FormData
2. Server uploads to S3/DigitalOcean Spaces via `uploadBufferToS3()`
3. Returns array of URLs
4. URLs passed to listing/profile creation/update actions

**Required env variables**: `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_BUCKET_NAME`, `AWS_ENDPOINT`

### Server Actions Pattern

All data mutations use server actions in `lib/actions.ts`:
- Actions are marked `"use server"`
- All actions perform auth checks using `await auth()`
- **Critical operations re-fetch from database** (don't trust JWT for verification status)
- Actions call `revalidatePath()` to invalidate Next.js cache after mutations
- Return format: `{ success: true, ... }` or `{ error: "message" }`

### Form Handling

Multi-step listing form pattern (see `components/listing-form.tsx`):
- Uses `react-hook-form` with `zod` schemas
- Validation schemas in `lib/schemas.ts` (`ListingSchema`, `BuyerDemandSchema`)
- Currency auto-conversion between EUR and LEK (rate: 100)

### Currency Handling

- Dual currency support: EUR and LEK
- Conversion rate: 100 LEK = 1 EUR
- Both values stored in database
- `lib/currency.ts` provides `formatCurrency(amount, currency)` helper
- User currency preference stored in localStorage

### State Management

- Auth state: `lib/auth-context.tsx` wraps `next-auth` session
- No global state library - uses React Context and server actions
- Currency preference in localStorage

## Common Development Patterns

### Adding a New Server Action

1. Define in `lib/actions.ts` with `"use server"` directive
2. Add auth check: `const session = await auth()`
3. **For critical operations**: Re-fetch user/profile from database (don't trust JWT)
4. Validate input with Zod schema
5. Perform database operation via Prisma
6. Call `revalidatePath()` for affected routes
7. Return `{ success: true }` or `{ error: "message" }`

### Working with Agent Verification

```typescript
// ALWAYS check database for verification status, not JWT
const agentProfile = await prisma.agentProfile.findUnique({
  where: { userId: session.user.id },
  select: { verificationStatus: true }
})

if (agentProfile?.verificationStatus !== "approved") {
  return { error: "Only verified agents can perform this action" }
}
```

### Working with Listings

- **Create**: Use `createListingAction()` - checks agent is approved and has all documents
- **Update**: Use `updateListingAction()` - checks ownership or admin role
- **Delete**: Use `deleteListingAction()` - checks ownership or admin role
- **Fetch public**: Use `getListings()` - returns only from approved agents
- **Fetch for agent**: Use `getAgentListings(agentId)` - returns full data

**Status Transitions (Agent-controlled):**
- `draft` → `active` (publish)
- `active` → `inactive` (pause)
- `active` → `sold` (mark as sold)
- `inactive` → `active` (unpause)
- Any status → deleted

### Working with Buyer Demands

- **Create**: `createBuyerDemandAction()` - buyers only
- **Claim**: `claimBuyerDemandAction()` - verified agents only, sends email
- **Update status**: `updateBuyerDemandStatusAction()` - buyer or admin
- **Delete**: `deleteBuyerDemandAction()` - buyer or admin, **only if status is `"active"`** (assigned/fulfilled/closed kept for history)
- **Browse**: `getActiveBuyerDemandsAction()` - verified agents only

## Key Files Reference

- `lib/actions.ts` - All server actions (mutations)
- `lib/data.ts` - All data fetching with visibility transformations
- `lib/types.ts` - TypeScript types for all domain models
- `lib/schemas.ts` - Zod validation schemas
- `lib/constants.ts` - Business categories, Albanian cities
- `lib/currency.ts` - Currency formatting
- `lib/email.ts` - Email sending (verification, demand claimed, etc.)
- `prisma/schema.prisma` - Database schema
- `auth.ts` + `auth.config.ts` - Authentication configuration
- `middleware.ts` - Route protection
- `PROMOTION_PLANS.md` - Promotion system implementation roadmap

## Important Constraints

1. **Agent verification**: `verificationStatus === "approved"` required to create listings or claim demands
2. **Document requirements**: All 3 documents required before agent can be approved
3. **Data privacy**: Never expose `realBusinessName`, `realDescription`, exact address in public APIs
4. **Public listings**: Only show listings from approved agents (listings become invisible if agent loses approval)
5. **Email verification**: Required at login - blocks unverified users (no grace period)
6. **No Albanian fields**: All `*Sq` fields have been removed - English only
7. **Listing status**: Simplified to `draft | active | sold | inactive` - fully agent-controlled
8. **Buyer demand history**: Assigned/fulfilled/closed demands cannot be deleted (historical tracking)
9. **Physical verification**: `isPhysicallyVerified` is admin-only (set after on-site business visit)

---

## Claude Code Setup

This project has an advanced Claude Code configuration for maximum productivity.

### Custom Commands

| Command | Description |
|---------|-------------|
| `/fix-ts` | Find and fix all TypeScript errors |
| `/test` | Run the test suite |
| `/lint` | Run ESLint and auto-fix |
| `/build` | Run production build |
| `/db migrate\|push\|seed\|studio` | Database operations |
| `/review-ui [page]` | Trigger UI/UX review of a page |

### Subagents

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| `ui-reviewer` | Visual UI/UX validation with Playwright | After frontend changes |
| `code-reviewer` | Code quality & security review | Before PRs |
| `ts-fixer` | Fix TypeScript errors systematically | When build fails |
| `test-runner` | Run and fix failing tests | After code changes |
| `deep-researcher` | Research libraries/approaches | Before major decisions |

**Usage**: `Use the ui-reviewer subagent to check the login page`

### Modular Rules

Path-specific rules in `.claude/rules/`:
- `auth.md` - Authentication & authorization patterns
- `listings.md` - Data privacy rules for listings
- `components.md` - React/Next.js component patterns

### Directory Structure

```
.claude/
├── commands/          # Custom slash commands
├── agents/            # Specialized subagents
└── rules/             # Path-specific rules
```
