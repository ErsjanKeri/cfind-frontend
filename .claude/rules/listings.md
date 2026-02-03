---
paths:
  - "lib/data.ts"
  - "lib/actions.ts"
  - "app/listings/**/*.tsx"
  - "components/listing*.tsx"
  - "components/dashboard/**/*.tsx"
---

# Listing Data Privacy Rules

## CRITICAL: Two-Tier Data Visibility

This platform has **strict data privacy requirements**. Businesses listed for sale have sensitive information that must be protected.

## Public vs Private Data

### Public Data (shown to everyone)
- `publicTitleEn` - Anonymized title
- `publicDescriptionEn` - Sanitized description
- `publicLocationCityEn` - General city
- `publicLocationArea` - General area
- Financial figures (asking price, revenue, ROI)
- Business category
- Listing status
- Agent contact info (for logged-in users only)

### Private Data (owner/admin only)
- `realBusinessName` - Actual business name
- `realDescriptionEn` - Full details
- `realLocationAddress` - Exact address
- `realLocationLat`, `realLocationLng` - GPS coordinates

## Transform Functions

### For Public Display
```typescript
import { transformPublicListing } from '@/lib/data';

// Use for any public-facing data
const publicListing = transformPublicListing(dbListing);
// realBusinessName, realDescription, exact address are HIDDEN
```

### For Owner/Admin Views
```typescript
import { transformPrivateListing } from '@/lib/data';

// Only use when:
// 1. User is the listing owner (agent)
// 2. User is an admin
const privateListing = transformPrivateListing(dbListing);
// All fields included
```

## CRITICAL: Only Approved Agents

Public listings should ONLY show listings from approved agents:

```typescript
// In getListings() - already implemented
const where: any = {
  status: "active",
  // CRITICAL: Only show listings from verified agents
  agent: {
    agentProfile: {
      verificationStatus: "approved"
    }
  }
}
```

## Data Fetching Pattern

```typescript
// In lib/data.ts
export async function getListingById(id: string, mode: "public" | "private" = "public") {
  const listing = await prisma.listing.findUnique({...})

  if (!listing) return null

  // CRITICAL: In public mode, only show listings from approved agents
  if (mode === "public" && listing.agent.agentProfile?.verificationStatus !== "approved") {
    return null
  }

  if (mode === "private") {
    return transformPrivateListing(listing)
  }
  return transformPublicListing(listing)
}
```

## Access Control for Private Data

Before returning private data, ALWAYS verify:

```typescript
export async function getAgentListings(agentId: string) {
  const session = await auth();

  // Only the agent or admin can see private data
  if (session?.user.id !== agentId && session?.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const listings = await prisma.listing.findMany({
    where: { agentId }
  });

  return listings.map(transformPrivateListing);
}
```

## Common Mistakes to Avoid

### WRONG - Leaking private data
```typescript
// BAD: Returns raw listing with all fields
export async function getListing(id: string) {
  return prisma.listing.findUnique({ where: { id } });
}
```

### WRONG - Showing private data in public component
```typescript
// BAD: Using realBusinessName in public listing card
<h2>{listing.realBusinessName}</h2>
```

### WRONG - Showing listings from unapproved agents
```typescript
// BAD: No verification check
const listings = await prisma.listing.findMany({ where: { status: "active" } })
```

### CORRECT - Using appropriate transform
```typescript
// GOOD: Public page uses public transform
const listing = await getListingById(id, "public");
return <h2>{listing?.publicTitleEn}</h2>;
```

## Currency Fields

Stored as `Decimal` in both EUR and LEK:
- `askingPriceEur` / `askingPriceLek`
- `monthlyRevenueEur` / `monthlyRevenueLek`
- `roi`

Must serialize before sending to client:
```typescript
const toNumber = (value: any) => value ? Number(value) : undefined
const price = toNumber(listing.askingPriceEur)
```

## Listing Status Values

- `"draft"` - Not published
- `"active"` - Live and visible
- `"pending"` - Awaiting approval
- `"sold"` - Business sold
- `"inactive"` - Temporarily hidden
- `"rejected"` - Admin rejected with reason

## Rejection Tracking

Listings can be rejected by admin:
- `rejectionReason` - Why it was rejected
- `rejectedAt` - When
- `rejectedBy` - Admin who rejected

Agent can reactivate via `reactivateListingAction()` after fixing issues.

## Language

**English only** - No Albanian (`*Sq`) fields. All public and private text fields end in `En`:
- `publicTitleEn`, `publicDescriptionEn`, `publicLocationCityEn`
- `realDescriptionEn`
