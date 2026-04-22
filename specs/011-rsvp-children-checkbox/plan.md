# Implementation Plan: RSVP Children Checkbox

**Branch**: `011-rsvp-children-checkbox` | **Date**: 2026-03-26 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/011-rsvp-children-checkbox/spec.md`

## Summary

Add a conditional "bringing children" checkbox to the RSVP form, visible only when one or more additional guests are present. When ticked, an inline safety message about site hazards is shown. The boolean value is persisted through the existing Vercel → GAS pipeline into a new column 11 ("bringing_children") of the RSVPs Google Sheet. No new dependencies are required; the implementation extends existing react-hook-form field arrays, the existing type system, and the existing GAS batch-write pattern.

## Technical Context

**Language/Version**: TypeScript 5.9 (frontend + Vercel function) / Google Apps Script V8 (GAS)
**Primary Dependencies**: React 19, react-hook-form 7 + useFieldArray, Zod, `@vercel/node`
**Storage**: Google Sheets — `RSVPs` sheet gains one new column (column 11: `bringing_children`)
**Testing**: Vitest (frontend unit tests), manual end-to-end via Vercel preview URL
**Target Platform**: Vercel (SPA + serverless function) + Google Apps Script (managed by Google)
**Project Type**: Web application (SPA + API proxy + GAS data store)
**Performance Goals**: No new performance requirements; inherits existing cold-start tolerance from constitution
**Constraints**: Must not introduce new dependencies; must not break existing RSVP submissions
**Scale/Scope**: Small change — 5 touch points across frontend, API types, Vercel function, and GAS

## Constitution Check

| Principle | Status | Notes |
|---|---|---|
| I. Guest-First, Mobile-First UX | PASS | Checkbox + safety message are inline, no modal. Conditional visibility keeps form clean for guests without children. |
| II. Zero-Cost Serverless Architecture | PASS | No new infrastructure. Extends existing React/Vercel/GAS stack. |
| III. Privacy & Security by Design | PASS | No new data exposed. `bringing_children` is stored server-side in the same Google Sheet already used for RSVP data. |
| IV. MVP Discipline | PASS | Feature is directly requested. No scope creep (no per-child names, ages, counts). |
| V. Admin Visibility & Data Integrity | PASS | New column 11 is human-readable in Sheets. Primary row gets `'yes'/'no'`; plus-one rows get `''` to avoid confusion. |

All gates pass. No Complexity Tracking entries required.

## Project Structure

### Documentation (this feature)

```text
specs/011-rsvp-children-checkbox/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 — decisions and rationale
├── data-model.md        # Phase 1 — entities and sheet schema
├── quickstart.md        # Phase 1 — implementation guide
├── contracts/
│   └── rsvp-submit.md   # Phase 1 — API contract (v2.0.0)
└── tasks.md             # Phase 2 output (/speckit.tasks — not yet created)
```

### Source Code (repository root)

```text
src/
├── types/
│   └── rsvp.ts              # Add bringing_children to RsvpSubmitRequest, RsvpRow
├── components/
│   └── RsvpLookup.tsx       # Checkbox, safety message, useEffect reset, submit update
└── services/
    └── rsvp.ts              # Forward bringing_children in request body

api/
└── rsvp-submit.ts           # Parse bringing_children; update flattenToRows

gas/
└── guest-lookup.gs          # Update doPost to 11 columns
```

**Structure Decision**: Web application layout (Option 2). Follows the established pattern from features 008 and 009.
