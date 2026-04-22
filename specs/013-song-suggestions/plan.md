# Implementation Plan: Guest Song Suggestions

**Branch**: `013-song-suggestions` | **Date**: 2026-04-22 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/013-song-suggestions/spec.md`

## Summary

Add an optional single free-text "Song Suggestion" field per guest to the RSVP form, shown only when a guest is marked as attending. The field value flows through the existing data pipeline (form → Vercel function → GAS) and is written as a new "Song Suggestion" column (column K) on each guest's existing per-person row in the RSVPs Google Sheet.

## Technical Context

**Language/Version**: TypeScript 5.9 (frontend + Vercel function) / Google Apps Script V8 (GAS)
**Primary Dependencies**: React 19, Vite 8, Tailwind CSS v4, react-hook-form 7, Zod, `@vercel/node`
**Storage**: Google Sheets — `RSVPs` sheet, new column K: "Song Suggestion" appended to existing schema
**Testing**: Existing test setup (npm test)
**Target Platform**: Vercel (serverless) + GAS web app (Google-hosted)
**Project Type**: Web application (SPA + serverless API proxy + GAS backend)
**Performance Goals**: No new targets; inherits existing wedding site expectations
**Constraints**: Must not break existing RSVP flow; column append only (no reordering of A–J)
**Scale/Scope**: ~100–200 guests; low traffic, finite lifespan

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Guest-First, Mobile-First UX | ✅ Pass | Single optional text field; no extra navigation step; hidden for non-attending guests |
| II. Zero-Cost Serverless Architecture | ✅ Pass | No new infrastructure; GAS and Vercel already in use |
| III. Privacy & Security by Design | ✅ Pass | No new secrets; data flows through existing Vercel proxy only |
| IV. MVP Discipline | ✅ Pass | Minimal addition — one field, one column. No duplicate detection, no editing, no music API |
| V. Admin Visibility & Data Integrity | ✅ Pass | New column appended to existing per-person row; one row per person invariant maintained |

No violations. Complexity Tracking table not required.

## Project Structure

### Documentation (this feature)

```text
specs/013-song-suggestions/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── rsvp-submit.md
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created here)
```

### Source Code (repository root)

```text
frontend/
src/
├── components/
│   └── RsvpLookup.tsx       # MODIFY: add song field to primary + additional guest sections
├── types/
│   └── rsvp.ts              # MODIFY: add song?: string to Guest, AttendanceFormData
└── services/
    └── rsvpApi.ts           # No change expected

api/
└── rsvp-submit.ts           # MODIFY: pass song through flattenToRows()

gas/
└── guest-lookup.gs          # MODIFY: add "Song Suggestion" column K header + row value
```

**Structure Decision**: Web application (Option 2). All changes are surgical modifications to existing files across four layers of the existing stack; no new files in the source tree.

## Phase 0: Research

See [research.md](research.md).

## Phase 1: Design & Contracts

See [data-model.md](data-model.md) and [contracts/rsvp-submit.md](contracts/rsvp-submit.md).
