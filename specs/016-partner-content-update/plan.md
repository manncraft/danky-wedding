# Implementation Plan: Partner Content Update

**Branch**: `016-partner-content-update` | **Date**: 2026-05-23 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `/specs/016-partner-content-update/spec.md`

## Summary

Incorporate the partner-provided content from `docs/content.md` into the wedding landing page. Page sections map 1:1 to the bold headers in `content.md`. This requires creating five new components, deleting four misaligned existing ones (`Travel`, `Schedule`, `Registry`, `Housekeeping`), updating two that already align (`Hero`, `DressCode`), and reordering everything in `App.tsx`. No new dependencies required.

## Technical Context

**Language/Version**: TypeScript 5.9 / React 19  
**Primary Dependencies**: Vite 8, Tailwind CSS v4 (no new deps)  
**Storage**: N/A — static content hardcoded in components  
**Testing**: `npm test && npm run lint`  
**Target Platform**: Web browser, mobile-first  
**Project Type**: Web application (SPA)  
**Performance Goals**: N/A — static content, no network calls  
**Constraints**: No new dependencies; content must match `docs/content.md` exactly where specified  
**Scale/Scope**: ~100 guests; static informational page

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Guest-First, Mobile-First UX | ✅ Pass | Content update only; mobile-first Tailwind layout preserved |
| II. Zero-Cost Serverless Architecture | ✅ Pass | No infrastructure changes; frontend-only |
| III. Privacy & Security by Design | ✅ Pass | No guest data involved |
| IV. MVP Discipline | ✅ Pass | All deferred items (Add to Calendar, RSVP deadline) explicitly excluded |
| V. Admin Visibility & Data Integrity | ✅ N/A | Frontend-only; no backend writes |

No violations. No Complexity Tracking required.

**Post-Phase 1 re-check**: Unchanged — no design decisions introduced new complexity.

## Project Structure

### Documentation (this feature)

```text
specs/016-partner-content-update/
├── plan.md              ✅ This file
├── research.md          ✅ Phase 0 output
├── quickstart.md        ✅ Phase 1 output
└── tasks.md             (Phase 2 — /speckit.tasks)
```

### Source Code

```text
src/
├── components/
│   └── sections/
│       ├── Hero.tsx                  — UPDATE: combined subtitle line
│       ├── DateAndTime.tsx           — NEW: ceremony time + arrival guidance
│       ├── Venue.tsx                 — NEW: venue name, address, Google Maps link
│       ├── ParkingTransportation.tsx — NEW: parking note + taxi/rideshare warning
│       ├── DressCode.tsx             — UPDATE: full content + examples
│       ├── DietaryRestrictions.tsx   — NEW: dietary note
│       ├── Gifts.tsx                 — NEW: wishing well message
│       ├── Timeline.tsx              — NEW: 6-entry day timeline
│       ├── Travel.tsx                — DELETE
│       ├── Schedule.tsx              — DELETE
│       ├── Registry.tsx              — DELETE
│       └── Housekeeping.tsx          — DELETE
└── App.tsx                           — UPDATE: replace all imports, reorder sections
```

**Structure Decision**: Single-project SPA. All changes within `src/components/sections/` and `src/App.tsx`. Four files deleted, five created, two updated in-place.

## Section Order

Following `docs/content.md` bold headers top-to-bottom, the final page order is:

1. `Hero` — names + `12 January 2027 | Markovina Vineyard Estate` subtitle
2. `DateAndTime` — ceremony time (3pm), arrival guidance (no earlier than 2:30pm)
3. `Venue` — venue name, street address, Google Maps link
4. `ParkingTransportation` — parking note, taxi/rideshare warning
5. `DressCode` — semi-formal + clothing and footwear examples
6. `DietaryRestrictions` — dietary note
7. `Gifts` — wishing well message
8. `Timeline` — 6-entry day timeline
