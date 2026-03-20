# Implementation Plan: Landing Page with Wedding Information

**Branch**: `001-landing-page` | **Date**: 2026-03-20 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-landing-page/spec.md`

## Summary

Replace the Vite boilerplate with a mobile-first, single-page landing site
displaying wedding information across six independently-replaceable section
components (Hero + 5 info modules) with a sticky navigation bar. All content
is placeholder text in bracket notation. Tailwind CSS will be installed as
part of this feature — it is not yet in the project.

## Technical Context

**Language/Version**: TypeScript 5.9 / React 19
**Primary Dependencies**: React 19, Vite 8, Tailwind CSS v4 (to be installed)
**Storage**: N/A — static page, no data persistence
**Testing**: N/A — manual browser verification only (see quickstart.md)
**Target Platform**: Web browser, mobile-first (320 px+)
**Project Type**: SPA (web-app)
**Performance Goals**: Instant load — all content is static HTML/CSS, zero network
requests on the landing page
**Constraints**: No horizontal overflow at 320 px; sticky nav must work without JS;
zero console errors
**Scale/Scope**: 6 UI components (1 Nav + 1 Hero + 5 info sections)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design — all pass.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Guest-First, Mobile-First UX | ✅ PASS | Mobile-first layout; sticky nav; no account required |
| II. Zero-Cost Serverless Architecture | ✅ PASS | Static page only; no new infrastructure |
| III. Privacy & Security by Design | ✅ PASS | No sensitive data on this page |
| IV. MVP Discipline | ✅ PASS | No RSVP, no auth, no out-of-scope features |
| V. Admin Visibility & Data Integrity | ✅ N/A | No backend writes in this feature |

No violations. Complexity Tracking table not required.

## Project Structure

### Documentation (this feature)

```text
specs/001-landing-page/
├── plan.md           # This file
├── research.md       # Phase 0 output
├── quickstart.md     # Phase 1 output
└── tasks.md          # Phase 2 output (/speckit.tasks — not yet created)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── Nav.tsx                    # Sticky navigation bar
│   └── sections/
│       ├── Hero.tsx               # Couple names, date, venue
│       ├── Schedule.tsx           # Day-of timeline
│       ├── Travel.tsx             # Directions, map link, transport
│       ├── DressCode.tsx          # Attire guidance
│       ├── Registry.tsx           # Gift registry / wishing well
│       └── Housekeeping.tsx       # Venue notes, vendor info
├── App.tsx                        # Assembly only — imports and renders sections
├── App.css                        # Remove (replaced by Tailwind)
└── index.css                      # Tailwind entry: @import "tailwindcss";

public/                            # Existing — no changes
index.html                         # Existing — no changes needed
vite.config.ts                     # Add @tailwindcss/vite plugin
```

**Structure Decision**: Single-project SPA with a flat `sections/` directory.
Each section is a self-contained `.tsx` file with no shared state. `App.tsx`
is an assembly-only root — it imports sections in display order and renders
them inside a `<main>` wrapper. No routing library needed.

## Phase 0: Research

See [research.md](research.md) for full findings. Summary:

- **Tailwind CSS**: Install `tailwindcss @tailwindcss/vite`; configure via
  `vite.config.ts` + `index.css`. No config file needed with v4.
- **Sticky nav**: Pure CSS (`sticky top-0`) — no JS required.
- **Placeholder format**: Bracket notation (`[Partner 1 Name]`) — grep-able.
- **Component architecture**: One `.tsx` file per section, assembled in `App.tsx`.
- **Tests**: None for this feature (not requested in spec).

All NEEDS CLARIFICATION items resolved. No blockers.

## Phase 1: Design

### Component Contracts

No API contracts (static page). UI component interface summary:

| Component | Props | Renders |
|-----------|-------|---------|
| `Nav` | none | Sticky bar with 5 anchor links |
| `Hero` | none | Couple names, date, venue — placeholder strings |
| `Schedule` | none | Heading + placeholder paragraph |
| `Travel` | none | Heading + placeholder paragraph |
| `DressCode` | none | Heading + placeholder paragraph |
| `Registry` | none | Heading + placeholder paragraph |
| `Housekeeping` | none | Heading + placeholder paragraph |

All components are zero-prop (self-contained). Props will be added in a later
styling/content pass if dynamic data is needed.

### Placeholder Content Map

| Field | Placeholder String |
|-------|--------------------|
| Partner 1 name | `[Partner 1 Name]` |
| Partner 2 name | `[Partner 2 Name]` |
| Wedding date | `[Wedding Date]` |
| Venue name | `[Venue Name]` |
| Venue address | `[Venue Address]` |
| Schedule start | `[Ceremony Start Time]` |
| Schedule end | `[Reception End Time]` |
| Map link | `[Google Maps Link]` |
| Transport info | `[Transport Details]` |
| Dress code description | `[Dress Code Description]` |
| Registry link | `[Registry Link]` |
| Wishing well details | `[Wishing Well Details]` |
| Housekeeping note | `[Housekeeping Notes]` |

See [quickstart.md](quickstart.md) for setup and verification steps.
