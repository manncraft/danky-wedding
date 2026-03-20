# Implementation Plan: RSVP Backend Stub

**Branch**: `003-rsvp-backend-stub` | **Date**: 2026-03-20 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-rsvp-backend-stub/spec.md`

## Summary

Add a `POST /api/rsvp` Vercel serverless function that accepts a guest name and returns matching records from a hard-coded canned data set. The frontend's existing `RsvpLookup` component is updated to call this endpoint and render three distinct states: single match, multiple matches (selectable list), and not found. A backend error state is handled separately from not-found. No authentication in this iteration.

## Technical Context

**Language/Version**: TypeScript 5.9
**Primary Dependencies**: React 19, Vite 8, Tailwind CSS v4, react-hook-form 7, `@vercel/node` (devDep, new)
**Storage**: None — canned data hard-coded in function
**Testing**: No test runner currently installed; manual curl + browser verification
**Target Platform**: Vercel (Node.js serverless runtime)
**Project Type**: Web application (SPA + serverless API)
**Performance Goals**: Lookup completes within 1 second (trivial for in-memory canned data)
**Constraints**: Zero infrastructure cost; no database; no auth this iteration
**Scale/Scope**: ~100 wedding guests; single-event site

## Constitution Check

*GATE: Must pass before implementation begins.*

| Principle | Status | Notes |
|---|---|---|
| I. Guest-First, Mobile-First UX | ✅ Pass | Loading spinner required on lookup call (cold-start latency). Selectable list must be tap-friendly on mobile. |
| II. Zero-Cost Serverless Architecture | ✅ Pass | Vercel serverless function, no database, no paid services. |
| III. Privacy & Security by Design | ✅ Pass | POST body keeps guest name out of URLs/logs. Input normalised (trim, lowercase, strip diacritics, strip non-alphanumeric). No auth this iteration — explicitly deferred and noted in spec. |
| IV. MVP Discipline | ✅ Pass | Canned data only; no GAS integration, no auth, no submission in scope. |
| V. Admin Visibility & Data Integrity | ✅ Pass | Read-only lookup; no writes in this iteration. |

No constitution violations. Complexity Tracking table not required.

## Project Structure

### Documentation (this feature)

```text
specs/003-rsvp-backend-stub/
├── plan.md              ← This file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/
│   └── rsvp-lookup.md  ← Phase 1 output
└── tasks.md             ← Phase 2 output (/speckit.tasks — not yet created)
```

### Source Code

```text
api/
└── rsvp.ts              ← New: Vercel serverless function (POST /api/rsvp)

src/
├── types/
│   └── rsvp.ts          ← New: shared TS types (GuestRecord, LookupResponse, MatchedGuest)
├── services/
│   └── rsvpApi.ts       ← New: frontend API client calling POST /api/rsvp
└── components/
    └── RsvpLookup.tsx   ← Modified: replace stub with real API call + 3 UI states
```

**Structure Decision**: Vercel functions live in `api/` at the repo root (Vercel convention). Frontend types and service layer go in `src/types/` and `src/services/` to keep component code clean. No separate `backend/` directory — the function is a thin adapter, not a full backend.

## Design Decisions

### Function: `api/rsvp.ts`

- Accepts `POST` only; returns `405` for other methods.
- Reads `name` from JSON body; returns `400` if missing/empty after trim.
- Normalises input: trim → lowercase → NFD decompose → strip diacritics → strip non-alphanumeric (except spaces) → collapse spaces.
- Parses normalised input: last word = last-name token, first char of first word = first-initial token (omitted if single word).
- Matches against canned `GuestRecord[]` array; returns `{ status, matches }` as JSON.

### Canned Data

Minimum required records (illustrate all match scenarios):

| Name | max_guests | Scenario |
|---|---|---|
| Alice Johnson | 2 | Unique last name → single match |
| Jane Smith | 3 | Shared last name, different initial → multi-match |
| John Smith | 1 | Shared last name, different initial → multi-match |
| *(any others)* | * | Padding for realism |

### Frontend: `RsvpLookup.tsx`

Current state: form submits and shows a stub "Thanks" message.

Updated behaviour:
1. On submit, call `rsvpApi.lookup(firstName, lastName)` with loading state.
2. Render loading spinner while awaiting response.
3. On `status: "found"` with one match → show name + party size, proceed button.
4. On `status: "found"` with multiple matches → show selectable list; selecting one advances to same view as single match.
5. On `status: "not_found"` → show "We couldn't find you" message with retry prompt.
6. On network/HTTP error → show "Something went wrong, please try again" message (distinct from not-found).

### Local Dev

Use `vercel dev` (not `npm run dev`) to run the full stack locally. See [quickstart.md](quickstart.md).
