---
description: Run the test suite and report results
allowed-tools: Bash, Read, Grep
---

## Run Tests

Execute the test suite:

!`npx vitest run 2>&1`

## Instructions

1. Review all test results above
2. If tests pass, report success
3. If tests fail:
   - Identify which tests failed
   - Determine if it's a test issue or code bug
   - Report findings with specific file:line references

## Test Patterns in This Project

- Tests use Vitest (configured in `vitest.config.ts`)
- Mock data available in `lib/mock-data.ts`
- Test files should be co-located or in `__tests__` directories
