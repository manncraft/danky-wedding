# Implementation Plan: RSVP Attendance Form

**Branch**: `006-rsvp-attendance-form` | **Date**: 2026-03-20 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/006-rsvp-attendance-form/spec.md`

## Summary

The existing `RsvpLookup` component already has a `confirmed` view state that displays the matched guest name with a "RSVP flow coming soon." placeholder. This feature replaces that placeholder with an inline attendance form (Attending / Not Attending), adds a new `rsvp-submitted` view state for post-submit confirmation, and introduces a new Vercel endpoint `POST /api/rsvp-submit` that validates the invite secret and returns a stub success response. No persistence is introduced in this iteration.

## Technical Context

**Language/Version**: TypeScript 5.9 (frontend + Vercel function)
**Primary Dependencies**: React 19, Vite 8, Tailwind CSS v4, react-hook-form 7, Zod, `@vercel/node`
**Storage**: N/A — backend stubs success; no persistence in this iteration
**Testing**: No test framework configured; no test tasks in scope
**Target Platform**: Vercel (browser SPA + serverless function)
**Project Type**: Web application
**Performance Goals**: Submit response perceived as instant; serverless cold-start accepted per constitution
**Constraints**: New endpoint must require `X-Invite-Secret` header; no new paid services
**Scale/Scope**: ~100 wedding guests

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Guest-First, Mobile-First UX | ✅ Pass | Inline form — no page navigation. Loading state on submit. Mobile-first Tailwind layout required. |
| II. Zero-Cost Serverless Architecture | ✅ Pass | New Vercel function only; no database, no paid services. |
| III. Privacy & Security by Design | ✅ Pass | New endpoint validates `X-Invite-Secret` identically to existing lookup endpoint. Guest name not exposed beyond session. |
| IV. MVP Discipline | ✅ Pass | Dietary, song requests, additional guests explicitly excluded. Stub persistence keeps scope minimal. |
| V. Admin Visibility & Data Integrity | ✅ Pass (deferred) | No writes in this iteration. Full RSVP schema (dietary, type, etc.) is deferred to a future feature. |

## Project Structure

### Documentation (this feature)

```text
specs/006-rsvp-attendance-form/
├── plan.md              ← this file
├── research.md          ← Phase 0
├── data-model.md        ← Phase 1
├── quickstart.md        ← Phase 1
├── contracts/
│   └── rsvp-submit.md   ← Phase 1
└── tasks.md             ← Phase 2 (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── components/
│   └── RsvpLookup.tsx        ← update confirmed state; add rsvp-submitted state
├── services/
│   └── rsvpApi.ts            ← add submitRsvp()
└── types/
    └── rsvp.ts               ← add RsvpSubmitRequest, RsvpSubmitResponse, rsvp-submitted ViewState

api/
└── rsvp-submit.ts            ← new Vercel serverless function
```

**Structure Decision**: Single-project web app layout (Option 2 equivalent, but using `src/` at repo root rather than `frontend/src/`). No new directories needed — all changes fit existing structure.

## Complexity Tracking

> No constitution violations. Table omitted.
