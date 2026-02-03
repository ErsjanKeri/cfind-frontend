---
description: Run production build and report any errors
allowed-tools: Bash, Read, Grep
---

## Production Build

!`npm run build 2>&1`

## Instructions

1. If build succeeds, report success with build stats
2. If build fails:
   - Identify the specific error
   - Determine if it's a type error, import error, or runtime issue
   - Report with file:line references
   - Suggest fixes

## Common Build Issues

- Dynamic imports not properly handled
- Server/client component mismatches ("use client" missing)
- Environment variables not available at build time
- Image optimization issues (check `next.config.mjs`)
