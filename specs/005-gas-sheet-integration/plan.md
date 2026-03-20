# Implementation Plan: GAS Google Sheet Guest Data Integration

**Branch**: `005-gas-sheet-integration` | **Date**: 2026-03-20 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/005-gas-sheet-integration/spec.md`

## Summary

Replace the hard-coded guest array in `api/rsvp.ts` with a live fetch from a Google Apps Script web app that reads the `Invites` tab of the couple's Google Sheet. Add a version-controlled copy of the GAS script (`gas/guest-lookup.gs`) for operational continuity. The existing name-normalisation and matching logic is unchanged; only the data source changes.

## Technical Context

**Language/Version**: TypeScript 5.9 (Vercel function) / JavaScript ES2019 (GAS script)
**Primary Dependencies**: `@vercel/node` (already installed), Google Apps Script runtime (V8, managed by Google)
**Storage**: Google Sheets (external, zero-cost) — no new persistent storage added to the project
**Testing**: Manual end-to-end (no test framework currently installed); normalisation logic already covered by prior feature
**Target Platform**: Vercel serverless (Node 18+), Google Apps Script V8 runtime
**Project Type**: Serverless web API + external data connector
**Performance Goals**: Guest lookup response ≤ 8 seconds including GAS cold start; GAS timeout configurable via `GAS_TIMEOUT_MS` (default 6000 ms)
**Constraints**: Zero new infrastructure cost; no caching layer; secrets server-side only; GAS always returns HTTP 200
**Scale/Scope**: ~200 guests, low concurrent traffic; well within GAS daily quota

## Constitution Check

*GATE: Must pass before implementation. Re-checked after Phase 1 design.*

| Principle | Gate | Status |
|---|---|---|
| I. Guest-First, Mobile-First UX | No new UI changes; error states already handled by `RsvpLookup.tsx` | ✅ Pass |
| II. Zero-Cost Serverless Architecture | Google Sheets + GAS = zero cost; Vercel free tier unchanged; no new paid services | ✅ Pass |
| III. Privacy & Security by Design | `GAS_SECRET` is separate from `INTERNAL_SECRET`; GAS URL and secret stored server-side only; browser never sees GAS URL | ✅ Pass |
| IV. MVP Discipline — Simplicity Over Completeness | Only changes one file (`api/rsvp.ts`) and adds one script (`gas/guest-lookup.gs`); no caching, no extra abstraction | ✅ Pass |
| V. Admin Visibility & Data Integrity | Couple manages guest list directly in Google Sheets; changes reflected on next request | ✅ Pass |

**All gates pass. No complexity violations to justify.**

## Project Structure

### Documentation (this feature)

```text
specs/005-gas-sheet-integration/
├── plan.md              ← this file
├── spec.md
├── research.md          ← Phase 0: key decisions documented
├── data-model.md        ← Phase 1: entity shapes and wire formats
├── quickstart.md        ← Phase 1: manual setup guide
├── contracts/
│   └── gas-web-app.md   ← Phase 1: GAS endpoint contract
└── tasks.md             ← Phase 2 (/speckit.tasks — not yet created)
```

### Source Code (repository root)

```text
api/
└── rsvp.ts              ← modified: replace canned GUESTS with GAS fetch

gas/
└── guest-lookup.gs      ← new: GAS script (reference copy; deployed manually)

src/
└── types/
    └── rsvp.ts          ← no changes needed
```

**Structure Decision**: Single-project layout unchanged. The only new directory is `gas/` at repo root for the script reference copy. No new npm packages are required — `AbortSignal.timeout` is available natively in Node 18+.

## Implementation Detail

### `api/rsvp.ts` changes

Three targeted changes to the existing file:

**1. Remove**: `buildRecord()` helper and the `GUESTS` constant array (canned data).

**2. Add** `fetchGuests()` function:
```
- Reads GAS_ENDPOINT_URL and GAS_SECRET from env
- Reads GAS_TIMEOUT_MS from env, defaulting to 6000 if absent/invalid
- Calls GAS endpoint via GET with secret query param and AbortSignal.timeout
- Checks response body: throws if `error` key present OR `guests` field missing/null
- Maps GasGuest[] → GuestRecord[] (applying normaliseName to each full_name)
```

**3. Update** `findMatches()`:
```
- Add guests: GuestRecord[] as first parameter (remove closure over GUESTS)
```

**4. Update** `handler()`:
```
- Call fetchGuests() inside try/catch
- On catch: log error, return res.status(502).json({ error: 'could not load guest list' })
- Pass result to findMatches(guests, name)
```

### `gas/guest-lookup.gs`

New file. Implements a `doGet(e)` function that:
- Reads `e.parameter.secret` and validates against `GUEST_SECRET` script property
- On mismatch: returns `{ "error": "unauthorised" }`
- On match: reads `Invites` tab, skips header row and blank rows, returns `{ "guests": [...] }`
- On script error: returns `{ "error": "failed to read sheet: <message>" }`

Setup instructions are embedded as block comments at the top of the file (deployment steps, sheet structure, script property config).

## Complexity Tracking

> No constitution violations — table not needed.

## Phase 0 Artifacts

- [research.md](research.md) — all NEEDS CLARIFICATION resolved; no unknowns remain

## Phase 1 Artifacts

- [data-model.md](data-model.md) — `GasGuest`, `GasResponse`, `GuestRecord`, `MatchedGuest`, `LookupResponse`; sheet layout; env var table
- [contracts/gas-web-app.md](contracts/gas-web-app.md) — GAS GET endpoint: request, success response, failure response, error detection rules, auth, timeout
- [quickstart.md](quickstart.md) — end-to-end setup guide: create sheet → add GAS script → set script property → deploy web app → set Vercel env vars → verify
