# CompanyFinder - Future Development Plan

This document outlines planned AI-powered features and platform enhancements for CompanyFinder.

---

## Phase 1: Smart Matching & Recommendations

### Demand-to-Listing Matching System

**Priority**: High
**Complexity**: Medium

Match buyer demands to listings automatically with compatibility scoring.

**Features**:
- Calculate match percentage based on: budget fit (40%), category match (30%), location proximity (20%), semantic similarity (10%)
- Display "87% match" badges on listings for logged-in buyers with active demands
- Proactive email notifications: "New listing matches your demand"
- Agent dashboard: "These buyers are looking for businesses like yours"

**Technical Approach**:
```typescript
function calculateMatchScore(demand: BuyerDemand, listing: Listing): number {
  let score = 0;

  // Budget fit (40% weight)
  if (listing.askingPriceEur >= demand.budgetMinEur &&
      listing.askingPriceEur <= demand.budgetMaxEur) {
    score += 40;
  } else {
    const overBudget = Math.max(0, listing.askingPriceEur - demand.budgetMaxEur);
    const underBudget = Math.max(0, demand.budgetMinEur - listing.askingPriceEur);
    const budgetDistance = Math.min(overBudget, underBudget) / demand.budgetMaxEur;
    score += Math.max(0, 40 - budgetDistance * 100);
  }

  // Category match (30% weight)
  if (listing.category === demand.category) score += 30;

  // Location match (20% weight)
  if (listing.publicLocationCityEn === demand.preferredCityEn) score += 15;
  if (listing.publicLocationArea === demand.preferredArea) score += 5;

  // Semantic similarity (10% weight) - requires embeddings
  score += cosineSimilarity(demand.embedding, listing.embedding) * 10;

  return Math.round(score);
}
```

**Database Changes**:
```prisma
model Listing {
  // ... existing fields
  descriptionEmbedding Float[] // Vector embedding for semantic search
}

model BuyerDemand {
  // ... existing fields
  descriptionEmbedding Float[] // Vector embedding for semantic search
}

model ListingMatch {
  id          String      @id @default(cuid())
  demandId    String
  listingId   String
  matchScore  Int         // 0-100
  notified    Boolean     @default(false)
  createdAt   DateTime    @default(now())

  demand      BuyerDemand @relation(fields: [demandId], references: [id])
  listing     Listing     @relation(fields: [listingId], references: [id])

  @@unique([demandId, listingId])
}
```

---

## Phase 2: Document Intelligence

### AI-Powered Document Analysis

**Priority**: Very High
**Complexity**: Medium

Automate document verification and data extraction for agent onboarding.

**Features**:
- OCR extraction from uploaded license, company registration, and ID documents
- Auto-fill form fields from extracted data
- Cross-validation between documents (name matching, license validity)
- Risk flags for inconsistencies
- Admin review queue with AI-highlighted concerns

**Technical Approach**:
- Use Claude's vision API or GPT-4 Vision for document analysis
- Extract: business name, license number, expiry date, owner name, address
- Validate against manually entered data
- Flag mismatches for admin review

**New Components**:
```typescript
// lib/document-ai.ts
interface DocumentAnalysisResult {
  extractedData: {
    businessName?: string;
    licenseNumber?: string;
    ownerName?: string;
    expiryDate?: Date;
    address?: string;
  };
  confidence: number; // 0-1
  flags: string[]; // ["Name mismatch", "License expired"]
  rawText: string;
}

async function analyzeDocument(
  documentUrl: string,
  documentType: "license" | "company" | "id"
): Promise<DocumentAnalysisResult>
```

---

## Phase 3: AI Valuation Assistant

### Business Valuation Tool

**Priority**: Very High
**Complexity**: High

Help agents price businesses accurately with AI-powered comparable analysis.

**Features**:
- Analyze comparable sales from platform database
- Industry-specific revenue multiples
- Location-based price adjustments
- Generate PDF valuation reports
- Confidence intervals and price ranges

**Valuation Factors**:
| Factor | Weight | Description |
|--------|--------|-------------|
| Revenue Multiple | 30% | Industry-specific (restaurants: 1.5-2.5x, tech: 3-5x) |
| Comparable Sales | 25% | Similar businesses sold on platform |
| Location Premium | 15% | Tirana center vs suburbs vs other cities |
| Asset Value | 15% | Equipment, inventory, property |
| Growth Trend | 10% | Revenue trajectory |
| Market Conditions | 5% | Current demand in category |

**Output**:
```typescript
interface ValuationReport {
  estimatedValue: {
    low: number;
    mid: number;
    high: number;
  };
  confidence: "low" | "medium" | "high";
  comparables: Array<{
    listingId: string;
    soldPrice: number;
    similarity: number;
  }>;
  factors: Array<{
    name: string;
    impact: "positive" | "neutral" | "negative";
    details: string;
  }>;
  generatedAt: Date;
}
```

---

## Phase 4: Conversational AI Assistant

### Deal Assistant Chatbot

**Priority**: Medium
**Complexity**: High

Natural language interface for buyers and agents.

**For Buyers**:
- "Find me a cafe in Tirana under €150k"
- "What's the average ROI for restaurants?"
- "Compare these two listings"
- "What questions should I ask the agent?"

**For Agents**:
- "Draft a response to this buyer inquiry"
- "Summarize this buyer's requirements"
- "What similar listings have sold recently?"
- "Generate a listing description for this business"

**Technical Approach**:
- Claude/GPT with function calling
- RAG over listings database
- Conversation memory per user session
- Guardrails for data privacy (never expose real business names)

---

## Phase 5: Market Intelligence Dashboard

### Analytics & Insights

**Priority**: Medium
**Complexity**: Medium

AI-generated market insights for all users.

**Public Insights**:
- "Restaurant listings up 23% this quarter"
- "Average asking price for bars: €175k"
- "Hot categories: cafes, e-commerce"
- "Trending locations: Blloku, Durrës"

**Agent Insights**:
- Predicted time-to-sale for listings
- Optimal pricing recommendations
- Best times to list
- Buyer activity trends

**Admin Insights**:
- Platform health metrics
- Fraud risk scoring
- Verification bottleneck analysis
- Revenue projections

---

## Phase 6: Lead Scoring & Buyer Intelligence

### Predictive Lead Quality

**Priority**: Low
**Complexity**: Medium

Predict buyer seriousness and conversion likelihood.

**Scoring Factors**:
| Signal | Weight | Description |
|--------|--------|-------------|
| Profile Completeness | 15% | All fields filled, verified email |
| Engagement Depth | 25% | Views, saves, time on listings |
| Contact Attempts | 20% | WhatsApp/phone/email clicks |
| Demand Specificity | 20% | Detailed vs vague requirements |
| Budget Realism | 10% | Budget aligns with market |
| Response Rate | 10% | Replies to agent messages |

**Output**:
- "Hot Lead" / "Warm" / "Cold" badges
- Priority sorting in agent dashboard
- Automated follow-up suggestions

---

## Phase 7: Fraud & Risk Detection

### Platform Security AI

**Priority**: Medium
**Complexity**: High

Protect platform integrity with AI monitoring.

**Detection Targets**:
- Suspicious listings (unrealistic financials, stock photos)
- Fake buyer accounts (patterns: rapid signups, no engagement)
- Scam patterns (pressure tactics, unusual payment requests)
- Document fraud (edited documents, reused images)

**Technical Approach**:
- Anomaly detection on financial claims
- Image similarity search for stock photos
- Behavioral analysis for account patterns
- Document forensics (metadata, edit detection)

---

## Implementation Priority

| Phase | Feature | Business Value | Effort | Priority |
|-------|---------|---------------|--------|----------|
| 1 | Smart Matching | High | Medium | P0 |
| 2 | Document Intelligence | Very High | Medium | P0 |
| 3 | Valuation Assistant | Very High | High | P1 |
| 4 | Conversational AI | Medium | High | P2 |
| 5 | Market Intelligence | Medium | Medium | P2 |
| 6 | Lead Scoring | Low | Medium | P3 |
| 7 | Fraud Detection | Medium | High | P3 |

---

## Technical Infrastructure Needed

### Vector Database
For semantic search and embeddings:
- **Option 1**: Pinecone (managed, easy)
- **Option 2**: pgvector extension (keep everything in PostgreSQL)
- **Option 3**: Supabase Vector (if migrating)

### AI Provider
- **Primary**: Claude API (Anthropic) - best for reasoning and documents
- **Fallback**: OpenAI GPT-4 - mature ecosystem
- **Embeddings**: OpenAI text-embedding-3-small or Cohere

### Background Jobs
For async processing (embeddings, notifications):
- **Option 1**: Vercel Cron + Edge Functions
- **Option 2**: Inngest (event-driven)
- **Option 3**: BullMQ + Redis

---

## Cost Estimates

| Feature | Monthly Cost (Est.) | Notes |
|---------|---------------------|-------|
| Embeddings | €20-50 | ~10k listings, regenerate on update |
| Document Analysis | €50-100 | ~100 agent verifications/month |
| Valuation API calls | €30-50 | ~200 valuations/month |
| Chatbot | €100-200 | Depends on usage |
| Vector DB | €0-25 | pgvector is free |

**Total estimated**: €200-425/month at scale

---

## Success Metrics

| Feature | KPI | Target |
|---------|-----|--------|
| Smart Matching | Match click-through rate | >15% |
| Document AI | Verification time reduction | 50% faster |
| Valuation | Agent adoption rate | >60% |
| Chatbot | Query resolution rate | >70% |
| Lead Scoring | High-score conversion rate | 3x vs low-score |

---

*Last updated: January 2026*
