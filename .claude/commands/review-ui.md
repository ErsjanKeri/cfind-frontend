---
description: Trigger UI/UX review of a page or component using the ui-reviewer subagent
allowed-tools: Task
argument-hint: [page-path or component-name]
---

## UI/UX Review Request

Use the ui-reviewer subagent to visually review the specified page or component.

**Target**: $ARGUMENTS

## What to Review

1. Navigate to the page at `http://localhost:3000/$ARGUMENTS`
2. Take screenshots at desktop (1280px), tablet (768px), and mobile (375px) widths
3. Check all interactive elements
4. Verify responsive behavior
5. Check accessibility basics
6. Report any issues found

## Expected Output

A structured report with:
- Screenshots at each breakpoint
- List of issues by severity (Critical/High/Medium/Low)
- Specific recommendations for fixes
