# Implementation Plan: RSVP Sheet Persistence

**Branch**: `009-rsvp-sheet-persistence` | **Date**: 2026-03-21 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/009-rsvp-sheet-persistence/spec.md`

## Summary

Wire up the existing stub `api/rsvp-submit.ts` to write RSVP data to a new **RSVPs** sheet in Google Sheets via the existing GAS web app. A new `doPost` handler is added to the GAS script to accept flattened row data and write it atomically (batch `setValues`). The Vercel function validates the submission, flattens guests into per-person rows (one per person when attending, primary-only when declining), stamps a timestamp, and POSTs to the same `GAS_ENDPOINT_URL` already used for guest lookup. No new infrastructure, no new secrets, no frontend form changes.

## Technical Context

**Language/Version**: TypeScript 5.9 (Vercel function) / Google Apps Script (V8 runtime, managed by Google)
**Primary Dependencies**: `@vercel/node` (existing), Google Apps Script Spreadsheet Service (built-in)
**Storage**: Google Sheets — existing `Invites` sheet unchanged; new `RSVPs` sheet appended
**Testing**: `npm test` (Vitest, existing) for Vercel function unit tests; manual E2E via sheet inspection
**Target Platform**: Vercel Serverless Functions + Google Apps Script web app
**Project Type**: Web service (Vercel proxy + GAS backend)
**Performance Goals**: Sheet write completes within 5 seconds (SC-001); GAS cold-start covered by existing `GAS_TIMEOUT_MS=6000`
**Constraints**: Zero new infrastructure or paid services; no new Vercel environment variables required
**Scale/Scope**: ~100–200 RSVP submissions total (small wedding)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design — all gates pass.*

| Principle | Gate | Status |
|-----------|------|--------|
| I. Guest-First, Mobile-First | Loading indicator during write; form preserved on error; no extra steps | ✅ Pass — FR-007/FR-008 + loading state required in Vercel call path |
| II. Zero-Cost Serverless | No new infrastructure; extends existing GAS + Vercel setup | ✅ Pass — reuses `GAS_ENDPOINT_URL`, no new services |
| III. Privacy & Security | `GAS_SECRET` authenticates Vercel→GAS writes; `INTERNAL_SECRET` gates Vercel endpoint | ✅ Pass — same auth pattern as guest lookup |
| IV. MVP Discipline | Deferred fields (is_child, age_range, seating_needs, safety_ack) written as blank; no dedup; no email | ✅ Pass — confirmed in clarifications |
| V. Admin Visibility & Data Integrity | One row per person; append-only; 10-column schema; zero mystery guests; invite_source on every row | ✅ Pass — FR-001 through FR-009 |

## Project Structure

### Documentation (this feature)

```text
specs/009-rsvp-sheet-persistence/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   ├── api-rsvp-submit.md   # Vercel endpoint contract
│   └── gas-rsvp-write.md    # GAS doPost contract
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
api/
└── rsvp-submit.ts       # Extend: add GAS write call + row flattening

gas/
└── guest-lookup.gs      # Extend: add doPost handler for RSVPs sheet write

src/
└── types/
    └── rsvp.ts          # Extend: add GasWriteRequest / GasWriteResponse types

tests/
└── rsvp-submit.test.ts  # New: unit tests for row-flattening logic
```

**Structure Decision**: Web application layout (existing). All changes are additive to existing files; no new source files required except the test file.

## Complexity Tracking

> No constitution violations — section intentionally blank.
