# Implementation Plan: Multi-Guest RSVP

**Branch**: `008-multi-guest-rsvp` | **Date**: 2026-03-20 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/008-multi-guest-rsvp/spec.md`

## Summary

Extend the existing RSVP attendance form to support multi-person party submissions. When a guest's invitation allows more than one person and they are attending, a static label "Are you RSVPing for anyone else?" and an "Add Guest" button appear. Each additional guest gets a visually-delineated section with an optional dietary requirements field and a trash-can remove button. The "Add Guest" button hides once the total reaches `max_guests`. The submission payload is extended to carry all additional guests' dietary data alongside the primary guest's. The backend stub is updated to accept the new payload shape.

## Technical Context

**Language/Version**: TypeScript 5.9 (frontend + Vercel function)
**Primary Dependencies**: React 19, Vite 8, Tailwind CSS v4, react-hook-form 7 + useFieldArray, `@vercel/node`
**Storage**: N/A — backend stub only; no persistence in this iteration
**Testing**: Vitest + React Testing Library (existing test setup)
**Target Platform**: Vercel (free tier) + browser (mobile-first)
**Project Type**: Web application (React SPA + Vercel Serverless Functions)
**Performance Goals**: Form interactions are instantaneous (no network calls); no new latency introduced
**Constraints**: Mobile-first layout; no new dependencies beyond what is already installed
**Scale/Scope**: Single-page form; supports up to max_guests dynamic sections (typically 2–6)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Guest-First, Mobile-First UX | ✅ PASS | Dynamic sections use Tailwind mobile-first utilities; no extra navigation steps; "Add Guest" and trash-can controls are touch-friendly |
| II. Zero-Cost Serverless Architecture | ✅ PASS | No new infrastructure; no new paid dependencies; still a stub submit |
| III. Privacy & Security by Design | ✅ PASS | Additional guests carry no name data; no new enumeration surface; X-Invite-Secret header unchanged |
| IV. MVP Discipline | ✅ PASS | `useFieldArray` is in the locked stack explicitly for this use case; dietary-only scope is the minimum viable data set |
| V. Admin Visibility & Data Integrity | ✅ PASS | Submission payload structured so each guest (primary + additional) maps to one row when GAS integration lands; `type` field distinguishes Primary from Plus-One |

*Post-Phase 1 re-check*: No violations introduced by design. `useFieldArray` is the prescribed tool; no additional abstractions added.

## Project Structure

### Documentation (this feature)

```text
specs/008-multi-guest-rsvp/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── rsvp-submit.md   # Updated submit endpoint contract
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── components/
│   │   └── RsvpLookup.tsx       # Primary change: multi-guest section added
│   ├── types/
│   │   └── rsvp.ts              # Extended: AdditionalGuest type, updated RsvpSubmitRequest
│   └── services/
│       └── rsvpApi.ts           # Updated: submitRsvp payload shape

api/
└── rsvp-submit.ts               # Updated: accept additional_guests[] in stub

tests/
└── components/
    └── RsvpLookup.test.tsx      # New/extended: multi-guest behaviour tests
```

**Structure Decision**: Web application layout (Option 2). Changes are localised to one frontend component, one types file, one service file, and one API stub. No new files in `src/` are required beyond updated tests.

## Complexity Tracking

No constitution violations to justify.
