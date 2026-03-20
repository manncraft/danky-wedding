# Quickstart: Landing Page with Wedding Information

## Validation Approach

**No automated tests for this feature.** The developer (Claude) runs `npm run build`
to catch TypeScript/lint errors before pushing. All visual and UX checks are
performed by the product owner (you) acting as QA via the Vercel preview URL
generated on each push.

## Prerequisites

- Node.js 18+ installed
- `npm install` already run (dependencies present in `node_modules/`)

## Step 1: Install Tailwind CSS

```bash
npm install tailwindcss @tailwindcss/vite
```

## Step 2: Push and Open Vercel Preview

After each push, Vercel generates a preview URL. Open it in your browser
(and in mobile DevTools at 320 px width) to verify the page.

## Step 3: QA Checklist

Check each success criterion in the Vercel preview:

| Criterion | How to verify |
|-----------|--------------|
| SC-001 | Hero section visible on load without scrolling (mobile viewport) |
| SC-002 | No Vite/React logos anywhere on the page |
| SC-003 | No horizontal scrollbar at 320 px width (DevTools → responsive mode) |
| SC-004 | Search for `[` in the source — every placeholder is found |
| SC-005 | Browser DevTools console shows zero errors |

## Step 4: Update Placeholder Content (When Ready)

Each section lives in its own file under `src/components/sections/`. To update
a section, open the relevant file and replace the bracketed placeholders:

| Section | File |
|---------|------|
| Hero (names, date, venue) | `src/components/sections/Hero.tsx` |
| Schedule | `src/components/sections/Schedule.tsx` |
| Travel & Directions | `src/components/sections/Travel.tsx` |
| Dress Code | `src/components/sections/DressCode.tsx` |
| Registry / Wishing Well | `src/components/sections/Registry.tsx` |
| Housekeeping / Venue Notes | `src/components/sections/Housekeeping.tsx` |

Search for `[` in any file to find all placeholders.
