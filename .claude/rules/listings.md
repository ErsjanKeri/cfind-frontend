---
paths:
  - "lib/api/listings.ts"
  - "lib/hooks/useListings.ts"
  - "app/[country]/listings/**/*.tsx"
  - "components/listing*.tsx"
  - "components/listing-form/**/*.tsx"
  - "components/dashboard/**/*.tsx"
---

# Listing Data Privacy Rules

## Two-Tier Data Visibility

The **backend** controls which fields are returned based on the requester's role.

### Public Data (shown to everyone)
- `public_title_en`, `public_description_en`
- `public_location_city_en`, `public_location_area`
- Financial figures (asking_price_eur, monthly_revenue_eur, roi)
- Business category
- Agent contact info (for logged-in users)

### Private Data (owner/admin only)
- `real_business_name`
- `real_description_en`
- `real_location_address`
- `real_location_lat`, `real_location_lng`

## Rules

1. **Never render `real_*` fields in public components** — only in agent dashboard or admin views
2. **Public listings only from approved agents** — backend enforces, UI should respect
3. **Listing statuses**: `draft` | `active` | `sold` | `inactive`
4. **English only** — no Albanian fields

## Currency

All API amounts are in EUR. Display conversion to ALL is handled by `formatCurrency()` from `lib/currency.ts` and `useCurrency()` hook.

## API Pattern

```typescript
import { api } from '@/lib/api';

// Browse
const { listings, total } = await api.listings.getListings(filters);

// Single listing
const listing = await api.listings.getListing(id);

// Agent's listings
const listings = await api.listings.getAgentListings(agentId);
```
