---
paths:
  - "components/**/*.tsx"
  - "app/**/*.tsx"
---

# React & Next.js Component Rules

## All Components Are Client Components

This is a frontend-only app — no server actions, no Prisma. All data comes via React Query hooks calling the REST API.

## Component Patterns

### Page → Client Component
Pages in `app/` are thin wrappers. Interactive logic lives in client components:
```typescript
// app/[country]/listings/page.tsx (server component, minimal)
export default function Page() { return <ListingsClient /> }

// components/listings-client.tsx (client component, has hooks)
"use client"
export function ListingsClient() {
  const { data } = useListings(filters);
  return <ListingCard ... />
}
```

### Data Fetching via Hooks
```typescript
"use client"
import { useUser } from '@/lib/hooks/useAuth';
import { useRole } from '@/lib/hooks/useRole';
import { useListings } from '@/lib/hooks/useListings';
```

## Form Handling

Uses react-hook-form + zod. Schemas in `lib/schemas.ts`.

## Styling

- Tailwind CSS classes, not inline styles
- Mobile-first: start with mobile, add `md:` / `lg:` for larger screens
- shadcn/ui primitives in `components/ui/`

## UI Libraries

- **Loader2** from lucide-react for spinners
- **toast** from sonner for notifications
- **Badge, Button, Card, etc.** from `@/components/ui/*`

## Currency Display

```typescript
import { useCurrency } from "@/lib/contexts/currency-context"
import { formatCurrency } from "@/lib/currency"

const { currency } = useCurrency()
{formatCurrency(listing.asking_price_eur, currency)}
```

## Language

**English only** — no language toggle, no Albanian translations.
