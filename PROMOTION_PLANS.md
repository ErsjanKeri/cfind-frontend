# CompanyFinder Promotion System - Implementation Guide

> **Status**: Planning Phase
> **Last Updated**: 2026-01-12
> **Model Reference**: PropertyFinder (UAE/MENA)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [Listing Promotion Tiers](#listing-promotion-tiers)
4. [Credit System](#credit-system)
5. [Subscription Plans (Phase 2)](#subscription-plans-phase-2)
6. [Database Schema](#database-schema)
7. [Implementation Phases](#implementation-phases)
8. [UI/UX Requirements](#uiux-requirements)
9. [Business Rules](#business-rules)
10. [API/Actions Specification](#apiactions-specification)
11. [Testing Checklist](#testing-checklist)
12. [Launch Checklist](#launch-checklist)
13. [Future Enhancements](#future-enhancements)
14. [Changelog](#changelog)

---

## Executive Summary

### Vision
Transform CompanyFinder into the **status quo platform for buying and selling businesses in Albania** by implementing a PropertyFinder-style promotion system that:
- Generates revenue through listing promotions
- Provides agents with tools to increase visibility
- Creates a fair, tiered marketplace

### Revenue Model
1. **Credits (Phase 1)**: Pay-per-promotion, agents buy credit packages
2. **Subscriptions (Phase 2)**: Monthly plans with included credits

### Key Metrics to Track
- Credit purchase conversion rate
- Promoted listing lead conversion (vs standard)
- Agent retention after first credit purchase
- Revenue per agent per month

---

## System Overview

### How It Works (Agent Perspective)

```
1. Agent creates listing → defaults to "Standard" tier
2. Agent purchases credit package (e.g., 50 credits for €50)
3. Agent selects listing → clicks "Promote"
4. Agent chooses tier: Featured (5 credits) or Premium (15 credits)
5. Credits deducted → Listing promoted for 30 days
6. Listing appears higher in search results with badge
7. After 30 days → reverts to Standard (agent can re-promote)
```

### Search Results Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    SEARCH RESULTS PAGE                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 💎 PREMIUM    Restaurant in Tirana    €150,000      │    │
│  │              "Premium" badge visible                 │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 💎 PREMIUM    Hotel in Saranda        €500,000      │    │
│  │              "Premium" badge visible                 │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ ✨ FEATURED   Cafe in Durrës          €45,000       │    │
│  │              "Featured" badge visible                │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │    STANDARD   Retail Shop in Elbasan  €30,000       │    │
│  │              No badge                                │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Listing Promotion Tiers

### Tier Comparison

| Aspect | Standard | Featured | Premium |
|--------|----------|----------|---------|
| **Credit Cost** | 0 | 5 credits | 15 credits |
| **Duration** | Unlimited | 30 days | 30 days |
| **Search Position** | Default (by date) | Above Standard | Top of results |
| **Badge** | None | "Featured" | "Premium" |
| **Homepage Carousel** | No | No | Yes |
| **Expected Lead Boost** | Baseline | ~3x | ~10x |

### Tier Details

#### Standard (Free)
- Default tier for all new listings
- Sorted by creation date (newest first within standard tier)
- No special visibility or badges
- Available to all verified agents

#### Featured (5 Credits / 30 Days)
- Appears above all Standard listings in search results
- "Featured" badge displayed on listing card
- Within Featured tier: sorted by promotion start date (newest first)
- Good for: Testing promotions, moderate visibility boost

#### Premium (15 Credits / 30 Days)
- Appears at the very top of search results
- "Premium" badge displayed on listing card (more prominent than Featured)
- Included in Homepage "Premium Listings" carousel
- Within Premium tier: sorted by promotion start date (newest first)
- Best for: Maximum visibility, flagship properties

### Promotion Expiration

When a promotion expires:
1. Listing automatically reverts to Standard tier
2. Agent receives email notification 3 days before expiration
3. Agent receives email notification on expiration day
4. Listing remains active (just not promoted)
5. Agent can re-promote at any time

---

## Credit System

### Credit Packages (Phase 1 Pricing)

| Package | Credits | Price (EUR) | Price/Credit | Savings |
|---------|---------|-------------|--------------|---------|
| Starter | 10 | €15 | €1.50 | - |
| Basic | 25 | €30 | €1.20 | 20% |
| Standard | 50 | €50 | €1.00 | 33% |
| Pro | 100 | €80 | €0.80 | 47% |
| Agency | 250 | €175 | €0.70 | 53% |

### Credit Rules

1. **No Expiration**: Purchased credits never expire
2. **Non-Refundable**: Credits cannot be refunded once purchased
3. **Non-Transferable**: Credits cannot be transferred between agents
4. **Usage**: Credits can only be used for listing promotions
5. **Balance**: Agent can see credit balance in dashboard at all times

### Credit Transactions

Every credit movement is logged:

| Transaction Type | Amount | Description |
|-----------------|--------|-------------|
| `purchase` | +X | Agent bought credit package |
| `usage` | -X | Credits used for promotion |
| `refund` | +X | Admin refund (exceptional cases) |
| `bonus` | +X | Promotional bonus credits |
| `adjustment` | ±X | Admin manual adjustment |

---

## Subscription Plans (Phase 2)

> **Note**: Implement AFTER validating credit system demand

### Plan Tiers

| Plan | Monthly (EUR) | Annual (EUR) | Credits/Month | Rollover | Perks |
|------|--------------|--------------|---------------|----------|-------|
| Free | €0 | €0 | 0 | - | Standard listings only |
| Starter | €29 | €290 (17% off) | 15 | No | - |
| Pro | €79 | €790 (17% off) | 50 | Up to 25 | Priority support |
| Agency | €199 | €1,990 (17% off) | 150 | Up to 75 | Team features, Analytics |

### Subscription Rules

1. **Monthly Credit Grant**: Credits added on billing date
2. **Partial Rollover**: Unused credits roll over (up to 50% of monthly allocation)
3. **Purchased Credits Priority**: When promoting, use purchased credits first, then subscription credits
4. **Downgrade**: Can downgrade at end of billing period
5. **Upgrade**: Immediate, prorated for remaining days
6. **Cancellation**: Access until end of billing period

---

## Database Schema

### New Models

```prisma
// Add to Listing model
model Listing {
  // ... existing fields ...

  // Promotion fields
  promotionTier       String    @default("standard") @map("promotion_tier") // "standard" | "featured" | "premium"
  promotionStartDate  DateTime? @map("promotion_start_date")
  promotionEndDate    DateTime? @map("promotion_end_date")

  // Relations
  promotionHistory    PromotionHistory[]
}

// Add to AgentProfile model
model AgentProfile {
  // ... existing fields ...

  // Credit balance
  creditBalance       Int       @default(0) @map("credit_balance")

  // Relations
  creditTransactions  CreditTransaction[]
}

// New model: Credit Transaction History
model CreditTransaction {
  id          String   @id @default(uuid())
  agentId     String   @map("agent_id")
  agent       AgentProfile @relation(fields: [agentId], references: [userId], onDelete: Cascade)

  amount      Int      // Positive = credit added, Negative = credit used
  type        String   // "purchase" | "usage" | "refund" | "bonus" | "adjustment"
  description String

  // Reference to listing if usage
  listingId   String?  @map("listing_id")

  // Reference to promotion if usage
  promotionId String?  @map("promotion_id")

  // Payment reference if purchase
  paymentReference String? @map("payment_reference")

  createdAt   DateTime @default(now()) @map("created_at")

  @@map("credit_transactions")
}

// New model: Promotion History
model PromotionHistory {
  id          String   @id @default(uuid())
  listingId   String   @map("listing_id")
  listing     Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)

  tier        String   // "featured" | "premium"
  creditCost  Int      @map("credit_cost")

  startDate   DateTime @map("start_date")
  endDate     DateTime @map("end_date")

  status      String   @default("active") // "active" | "expired" | "cancelled"

  // Stats during promotion period (updated periodically)
  viewsDuringPromotion    Int @default(0) @map("views_during_promotion")
  leadsDuringPromotion    Int @default(0) @map("leads_during_promotion")

  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @default(now()) @updatedAt @map("updated_at")

  @@map("promotion_history")
}

// New model: Credit Package (admin-configurable)
model CreditPackage {
  id          String   @id @default(uuid())
  name        String   // "Starter", "Basic", etc.
  credits     Int      // Number of credits
  priceEur    Decimal  @map("price_eur")
  priceLek    Decimal  @map("price_lek")
  isActive    Boolean  @default(true) @map("is_active")
  sortOrder   Int      @default(0) @map("sort_order")

  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @default(now()) @updatedAt @map("updated_at")

  @@map("credit_packages")
}

// New model: Promotion Tier Configuration (admin-configurable)
model PromotionTierConfig {
  id          String   @id @default(uuid())
  tier        String   @unique // "featured" | "premium"
  creditCost  Int      @map("credit_cost")
  durationDays Int     @map("duration_days")
  displayName String   @map("display_name")
  description String?
  badgeColor  String?  @map("badge_color") // Tailwind color class
  isActive    Boolean  @default(true) @map("is_active")

  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @default(now()) @updatedAt @map("updated_at")

  @@map("promotion_tier_configs")
}
```

### Schema Changes Summary

| Model | Change | Fields |
|-------|--------|--------|
| Listing | Add fields | `promotionTier`, `promotionStartDate`, `promotionEndDate` |
| AgentProfile | Add field | `creditBalance` |
| AgentProfile | Remove fields | `subscriptionPlan`, `subscriptionStatus`, `subscriptionExpiry` |
| CreditTransaction | New model | Full transaction history |
| PromotionHistory | New model | Track all promotions |
| CreditPackage | New model | Admin-configurable packages |
| PromotionTierConfig | New model | Admin-configurable tiers |

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2) ✅ COMPLETE
- [x] Database schema updates (Listing, AgentProfile, CreditTransaction, PromotionHistory, CreditPackage, PromotionTierConfig)
- [x] Credit balance tracking (AgentProfile.creditBalance)
- [x] Basic promotion actions (promoteListingAction, cancelPromotionAction)
- [x] Search results ordering by tier (getListings sorts by premium > featured > standard)
- [ ] Listing card badges (Featured/Premium) - UI component needed

### Phase 2: Credit Purchase (Week 3-4)
- [ ] Credit package display UI
- [ ] Payment integration (Stripe or local provider)
- [ ] Credit purchase flow
- [ ] Transaction history page
- [ ] Purchase confirmation emails

### Phase 3: Agent Dashboard (Week 5)
- [ ] Credit balance widget
- [ ] Promotion management UI
- [ ] "Promote" button on listing cards
- [ ] Promotion tier selector dialog
- [ ] Active promotions overview

### Phase 4: Homepage Integration (Week 6)
- [ ] Premium listings carousel on homepage
- [ ] "Premium" section in featured listings
- [ ] Badge styling refinement

### Phase 5: Automation & Notifications (Week 7)
- [ ] Promotion expiration cron job
- [ ] Email: 3 days before expiration
- [ ] Email: On expiration
- [ ] Email: Purchase confirmation
- [ ] Auto-revert to Standard on expiration

### Phase 6: Admin Tools (Week 8)
- [ ] Credit package management
- [ ] Promotion tier configuration
- [ ] Manual credit adjustments
- [ ] Promotion analytics dashboard
- [ ] Revenue reporting

### Phase 7: Analytics & Optimization (Week 9-10)
- [ ] Promotion performance tracking
- [ ] Lead attribution to promotion tier
- [ ] ROI calculator for agents
- [ ] A/B testing framework

### Phase 8: Subscriptions (Future)
- [ ] Subscription plan management
- [ ] Recurring billing
- [ ] Monthly credit grants
- [ ] Subscription analytics

---

## UI/UX Requirements

### Listing Card Badge

```
┌────────────────────────────────────────┐
│ [IMAGE]                                │
│                          ┌──────────┐  │
│                          │ PREMIUM  │  │ ← Gold/amber badge
│                          └──────────┘  │
│ Restaurant in Tirana                   │
│ €150,000                               │
│ ⭐ 4.5 | 📍 Tirana | 🏢 Restaurant     │
└────────────────────────────────────────┘
```

Badge Styling:
- **Premium**: `bg-amber-500 text-white` with subtle glow
- **Featured**: `bg-blue-500 text-white`
- **Standard**: No badge

### Promote Dialog

```
┌─────────────────────────────────────────────────────┐
│  Promote Your Listing                          [X]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  "Restaurant in Tirana"                             │
│                                                     │
│  Your credit balance: 45 credits                    │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ ○ FEATURED                                   │   │
│  │   5 credits for 30 days                      │   │
│  │   • Appear above standard listings           │   │
│  │   • "Featured" badge on listing              │   │
│  │   • ~3x more visibility                      │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ ● PREMIUM                          ⭐ Best   │   │
│  │   15 credits for 30 days                     │   │
│  │   • Top of search results                    │   │
│  │   • "Premium" badge on listing               │   │
│  │   • Homepage carousel placement              │   │
│  │   • ~10x more visibility                     │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [Cancel]                    [Promote for 15 cr]   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Credit Purchase Page

```
┌─────────────────────────────────────────────────────┐
│  Buy Credits                                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Current balance: 5 credits                         │
│                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ STARTER  │ │ BASIC    │ │ STANDARD │            │
│  │ 10 cr    │ │ 25 cr    │ │ 50 cr    │            │
│  │ €15      │ │ €30      │ │ €50      │ ← Popular  │
│  │          │ │ Save 20% │ │ Save 33% │            │
│  │ [Select] │ │ [Select] │ │ [Select] │            │
│  └──────────┘ └──────────┘ └──────────┘            │
│                                                     │
│  ┌──────────┐ ┌──────────┐                         │
│  │ PRO      │ │ AGENCY   │                         │
│  │ 100 cr   │ │ 250 cr   │                         │
│  │ €80      │ │ €175     │                         │
│  │ Save 47% │ │ Save 53% │                         │
│  │ [Select] │ │ [Select] │                         │
│  └──────────┘ └──────────┘                         │
│                                                     │
│  💡 Credits never expire                            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Agent Dashboard Widget

```
┌─────────────────────────────────────────────────────┐
│  Credits & Promotions                               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Credit Balance        Active Promotions            │
│  ┌────────────┐       ┌────────────┐               │
│  │    45      │       │     2      │               │
│  │  credits   │       │  listings  │               │
│  └────────────┘       └────────────┘               │
│                                                     │
│  [Buy Credits]        [View All Promotions]         │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  Expiring Soon:                                     │
│  • Restaurant in Tirana - 3 days left              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Business Rules

### Promotion Rules

1. **Only verified agents** can promote listings
2. **Only active listings** can be promoted
3. **One promotion per listing** at a time (can't stack Featured + Premium)
4. **Upgrade allowed**: Featured → Premium (pay difference: 10 credits)
5. **No downgrade**: Premium → Featured not allowed mid-promotion
6. **Re-promote**: After expiration, can promote again
7. **Cancel**: Agent can cancel promotion (no refund)

### Credit Rules

1. **Minimum purchase**: 10 credits (Starter package)
2. **Maximum balance**: No limit
3. **Payment methods**: Credit card, bank transfer
4. **Currency**: Display in user's preferred currency (EUR/LEK)
5. **Invoicing**: Generate invoice for each purchase

### Search Ordering Rules

```
ORDER BY:
  1. promotionTier DESC (premium > featured > standard)
  2. Within same tier: promotionStartDate DESC (newest promotion first)
  3. Within standard: createdAt DESC (newest listing first)
```

### Edge Cases

| Scenario | Behavior |
|----------|----------|
| Agent deletes promoted listing | Promotion cancelled, no refund |
| Agent's verification revoked | Listings hidden, promotions paused |
| Listing marked as sold | Promotion continues (agent's choice to deactivate) |
| Promotion expires while listing inactive | Listing stays inactive, no re-promote needed |
| Agent has 0 credits, tries to promote | Show "Buy Credits" prompt |

---

## API/Actions Specification

### New Server Actions

```typescript
// Credit Management
purchaseCreditsAction(packageId: string, paymentMethod: string)
getAgentCreditsAction() → { balance: number, transactions: Transaction[] }
getAgentCreditHistoryAction(page: number) → Transaction[]

// Promotion Management
promoteListingAction(listingId: string, tier: "featured" | "premium")
cancelPromotionAction(listingId: string)
upgradePromotionAction(listingId: string) // Featured → Premium
getActivePromotionsAction() → Promotion[]
getPromotionHistoryAction(listingId?: string) → PromotionHistory[]

// Admin Actions
adminAdjustCreditsAction(agentId: string, amount: number, reason: string)
adminUpdateCreditPackageAction(packageId: string, data: PackageData)
adminUpdatePromotionTierAction(tier: string, data: TierData)
adminGetPromotionAnalyticsAction() → Analytics

// Cron/Background Jobs
expirePromotionsJob() // Run daily
sendExpirationRemindersJob() // Run daily
```

### Modified Existing Actions

```typescript
// getListings - Update to order by promotion tier
getListings(params) {
  // Add: orderBy promotionTier, then existing sort
}

// getListingById - Include promotion status
getListingById(id) {
  // Add: promotionTier, promotionEndDate to response
}

// createListingAction - Default to standard tier
createListingAction(data) {
  // Add: promotionTier: "standard"
}
```

---

## Testing Checklist

### Unit Tests
- [ ] Credit balance calculation
- [ ] Promotion tier ordering in queries
- [ ] Promotion expiration logic
- [ ] Credit transaction logging

### Integration Tests
- [ ] Full promotion flow (purchase → promote → expiration)
- [ ] Search results ordering with mixed tiers
- [ ] Credit purchase with payment provider

### E2E Tests
- [ ] Agent buys credits
- [ ] Agent promotes listing
- [ ] Listing appears in correct position
- [ ] Promotion expires and reverts
- [ ] Admin adjusts credits

### Manual Testing
- [ ] Badge visibility on all screen sizes
- [ ] Homepage carousel with premium listings
- [ ] Email notifications received
- [ ] Payment flow works in production

---

## Launch Checklist

### Pre-Launch
- [ ] Database migrations applied
- [ ] Payment provider configured
- [ ] Email templates created
- [ ] Admin seed data (packages, tier configs)
- [ ] Legal: Terms of service update
- [ ] Legal: Refund policy documented

### Launch Day
- [ ] Feature flag enabled
- [ ] Monitor error rates
- [ ] Monitor payment success rates
- [ ] Support team briefed

### Post-Launch (Week 1)
- [ ] Review analytics
- [ ] Gather agent feedback
- [ ] Fix any critical bugs
- [ ] Adjust pricing if needed

---

## Future Enhancements

### Phase 2+ Features

1. **Spotlight (Bidding System)**
   - Top 3 positions via competitive auction
   - Daily/weekly bidding cycles
   - Minimum bid requirements

2. **Community Top Spot**
   - Full-width banner at top of search
   - Premium tier only
   - Limited availability

3. **Auto-Renewal**
   - Agent opts in to auto-renew promotion
   - Credits deducted automatically

4. **Promotion Scheduling**
   - Schedule promotion to start on specific date
   - Useful for coordinating with marketing

5. **Bulk Promotion**
   - Promote multiple listings at once
   - Discounted credit cost

6. **Performance Analytics**
   - Detailed ROI tracking per promotion
   - Lead attribution
   - Comparison: promoted vs standard performance

7. **Dynamic Pricing**
   - Credit costs vary by category/city demand
   - Higher demand areas cost more credits
   - Updated quarterly

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-13 | 0.2.0 | Phase 1 backend complete: schema, types, data functions, server actions |
| 2026-01-12 | 0.1.0 | Initial plan created |

---

## References

- [PropertyFinder Partner Hub](https://www.propertyfinder.ae/partnerhub/)
- [PropertyFinder Terms - PF Flex](https://www.propertyfinder.com/terms-conditions-pf-flex/)
- [PropertyFinder Bahrain - Premium Benefits](https://www.propertyfinder.bh/blog/benefits-premium-listings-use-correctly/)
