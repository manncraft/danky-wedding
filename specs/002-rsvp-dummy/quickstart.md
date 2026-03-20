# Quickstart: RSVP Lookup Screen

## Validation Approach

**No automated tests.** Developer runs `npm run build` to catch TypeScript/lint
errors before pushing. All visual and UX checks are performed by the product
owner (QA) via the Vercel preview URL.

## Prerequisites

- `npm install` already run
- Landing page feature (001) merged — `Nav`, `Hero`, and section components exist

## Step 1: Install react-hook-form

```bash
npm install react-hook-form
```

## Step 2: Push and Open Vercel Preview

Push the branch; open the generated Vercel preview URL.

## Step 3: QA Checklist

| Criterion | How to verify |
|-----------|---------------|
| SC-001 | RSVP button visible in sticky nav from any scroll position; tap opens lookup screen |
| SC-002 | Fill first + last name, tap Find Invite → stub response shown in under 30 s |
| SC-003 | DevTools Network tab shows zero requests when Find Invite is tapped |
| SC-004 | No horizontal overflow at 320 px viewport width |
| SC-005 | Submit with empty fields → inline error(s) visible without scrolling |
| Back nav | Back/close control returns to landing page with sections visible |
