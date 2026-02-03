---
description: Run ESLint and fix auto-fixable issues
allowed-tools: Bash, Read
---

## Run Linter

!`npm run lint 2>&1`

## Auto-fix

If there are auto-fixable issues, run:

```bash
npx eslint . --fix
```

## Instructions

1. Review lint errors above
2. Auto-fix what can be fixed
3. For remaining errors, report them with file:line references
4. Common issues in Next.js projects:
   - Unused imports
   - Missing dependencies in useEffect
   - Unescaped entities in JSX
   - Missing key props in lists
