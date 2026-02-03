---
description: Fix all TypeScript errors across the codebase
allowed-tools: Read, Edit, Bash, Grep, Glob
---

## Current TypeScript Errors

Run the TypeScript compiler to identify all errors:

!`npx tsc --noEmit 2>&1 | head -100`

## Instructions

1. Review ALL errors listed above
2. Fix each error systematically, starting from the first file
3. After fixing errors in a file, move to the next
4. Re-run `npx tsc --noEmit` after completing all fixes
5. Continue until zero errors remain

## Rules

- NEVER use `any` type - find or create proper types
- Check `lib/types.ts` for existing type definitions
- For Prisma types, use generated types from `@prisma/client`
- For Next.js types, use types from `next` and `next-auth`
- Decimal fields from Prisma need `.toNumber()` before client use
- Date fields need proper serialization

## Common Fixes in This Project

- `Decimal` → `number`: Use `.toNumber()` or serialize in data layer
- Missing session types: Extend in `auth.config.ts`
- Form data types: Check `lib/schemas.ts` for Zod schemas
