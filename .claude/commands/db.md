---
description: Database operations - migrate, push, or seed
allowed-tools: Bash, Read
argument-hint: [migrate|push|seed|studio]
---

## Database Operation: $ARGUMENTS

### Commands Available

- `migrate` - Create and apply migrations: `npx prisma migrate dev`
- `push` - Push schema changes (no migration): `npx prisma db push`
- `seed` - Seed with mock data: `npx prisma db seed`
- `studio` - Open Prisma Studio: `npx prisma studio`

### Execute

Based on argument "$ARGUMENTS":

If migrate:
!`npx prisma migrate dev 2>&1`

If push:
!`npx prisma db push 2>&1`

If seed:
!`npx prisma db seed 2>&1`

If studio:
!`npx prisma studio &`

## Schema Location

The Prisma schema is at `prisma/schema.prisma`
