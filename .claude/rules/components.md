---
paths:
  - "components/**/*.tsx"
  - "app/**/*.tsx"
---

# React & Next.js Component Rules

## Server vs Client Components

### Default to Server Components
```typescript
// No directive needed - this is a server component
export default async function Page() {
  const data = await fetchData(); // Can await directly
  return <div>{data}</div>;
}
```

### Use Client Components Only When Needed
```typescript
"use client"

import { useState } from 'react';

// Client component - for interactivity
export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### When to Use "use client"
- Using React hooks (useState, useEffect, useContext, etc.)
- Using browser APIs (window, document, localStorage)
- Adding event handlers (onClick, onChange, etc.)
- Using client-only libraries

### When NOT to Use "use client"
- Fetching data
- Accessing backend resources
- Rendering static content
- Using server-only code

## Component Patterns

### Page Component (Server)
```typescript
// app/listings/[id]/page.tsx
import { getListingById } from '@/lib/data';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ListingPage({ params }: Props) {
  const { id } = await params;
  const listing = await getListingById(id, "public");

  return <ListingDetail listing={listing} />;
}
```

### Interactive Component (Client)
```typescript
"use client"

import { useAuth } from '@/lib/auth-context';
import { createLeadAction } from '@/lib/actions';

export function ContactButton({ listingId }: { listingId: string }) {
  const { user } = useAuth();

  if (!user) return <LoginPrompt />;

  return (
    <button onClick={() => createLeadAction(listingId, 'whatsapp')}>
      Contact Agent
    </button>
  );
}
```

## Form Handling

Use react-hook-form with Zod:
```typescript
"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ListingSchema, BuyerDemandSchema } from '@/lib/schemas';
import type { z } from 'zod';

type FormData = z.infer<typeof ListingSchema>;

export function ListingForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(ListingSchema),
  });

  const onSubmit = async (data: FormData) => {
    const result = await createListingAction(data);
    if (result.error) {
      // Handle error
    }
  };

  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>;
}
```

## Styling with Tailwind

Follow these conventions:
- Use Tailwind classes, not inline styles
- Mobile-first: Start with mobile styles, add `md:` and `lg:` for larger screens
- Use design system spacing: `p-4`, `m-2`, `gap-4`, etc.

```typescript
// Good
<div className="p-4 md:p-6 lg:p-8">
  <h1 className="text-xl md:text-2xl font-bold">Title</h1>
</div>

// Avoid
<div style={{ padding: '16px' }}>
  <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Title</h1>
</div>
```

## Loading & Error States

Always handle loading and error states:

```typescript
// app/listings/[id]/loading.tsx
export default function Loading() {
  return <ListingSkeleton />;
}

// app/listings/[id]/error.tsx
"use client"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

## UI Components Used

- **Loader2** from lucide-react for spinners
- **toast** from sonner for notifications
- **EmptyState** from `@/components/ui/empty-state` for empty states
- **StatCard** from `@/components/ui/stat-card` for dashboard stats
- **Card, Button, Badge, etc.** from `@/components/ui/*`

## Dashboard Views

Three role-based views in `/profile`:
- `BuyerView` - Saved listings, contact history, buyer demands
- `AgentView` - Listings management, leads, verification status
- `AdminView` - User management, listing moderation

## Agent Verification UI

Show appropriate alerts based on `verificationStatus`:
- `"pending"` with all docs - Yellow "Pending Verification" alert
- `"pending"` without docs - Blue "Complete Your Profile" alert
- `"rejected"` - Red rejection banner with reason and resubmit button
- `"approved"` - Show "Create Listing" button

## Buyer Demands UI

- `DemandDialog` - Modal form for creating demands
- `DemandCard` - Display card with `variant="buyer"` or `variant="agent"`
- Buyers see their demands with status, can mark fulfilled/close/delete
- Agents see claimable demands, can claim (only if verified)

## Currency Display

Use currency from localStorage:
```typescript
const [currency, setCurrency] = useState<Currency>("EUR")

useEffect(() => {
  const saved = localStorage.getItem("currency") as Currency
  if (saved) setCurrency(saved)
}, [])

// Display
{formatCurrency(listing.askingPrice, currency)}
```

## Language

**English only** - No language toggle, no Albanian translations. All text is in English.
