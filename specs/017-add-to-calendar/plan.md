# Implementation Plan: Add to Calendar Button

**Branch**: `017-add-to-calendar` | **Date**: 2026-05-23 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `/specs/017-add-to-calendar/spec.md`

## Summary

Add a client-side "Add to Calendar" button to the `DateAndTime` section that lets guests save the wedding to Google Calendar (new tab via URL), Apple Calendar (ICS download), or Outlook (ICS download). No new npm packages; no backend. All event data is hardcoded at build time.

## Technical Context

**Language/Version**: TypeScript 5.9 / React 19  
**Primary Dependencies**: React 19, Tailwind CSS v4 — no new dependencies  
**Storage**: N/A — all data is compile-time constants  
**Testing**: No test infrastructure in this project (existing pattern — no new tests required for this feature)  
**Target Platform**: Web (Vercel, free tier), mobile-first (375px+ viewport)  
**Project Type**: Web application — landing page feature addition  
**Performance Goals**: N/A — no network calls; instant interaction  
**Constraints**: Mobile-first layout; ≤ 2 taps to complete; no login or personal data required  
**Scale/Scope**: ~100 wedding guests; single event; static data

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|---|---|---|
| I. Guest-First, Mobile-First UX | ✅ PASS | Button + dropdown works in 2 taps; no account or login required; mobile layout tested at 375px |
| II. Zero-Cost Serverless Architecture | ✅ PASS | Entirely client-side; no new infrastructure, no paid APIs; Google Calendar URL is free and public |
| III. Privacy & Security by Design | ✅ PASS | No personal data collected or transmitted; guest clicks a link or downloads a file |
| IV. MVP Discipline | ✅ PASS | Feature is explicitly requested; implementation is minimal (two files, no new packages) |
| V. Admin Visibility & Data Integrity | ✅ PASS | N/A — no data writes |

**Post-design re-check**: All five principles hold. No violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/017-add-to-calendar/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks — not yet created)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── AddToCalendar.tsx        # NEW — button + dropdown + ICS/URL logic
│   └── sections/
│       └── DateAndTime.tsx      # MODIFIED — renders <AddToCalendar /> at bottom
```

**Structure Decision**: Single-project web app. No backend changes. The new component lives alongside existing section components under `src/components/`. Calendar URL generation and ICS construction are self-contained within `AddToCalendar.tsx` — not extracted to a utility file, since there is only one consumer and the logic is minimal.

## Complexity Tracking

> No constitution violations — this section intentionally left empty.
