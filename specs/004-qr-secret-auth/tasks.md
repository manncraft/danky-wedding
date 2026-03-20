---

description: "Task list for QR Code Secret Validation implementation"
---

# Tasks: QR Code Secret Validation

**Input**: Design documents from `/specs/004-qr-secret-auth/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/rsvp-lookup-v2.md ✓, quickstart.md ✓

**Tests**: Not requested — manual verification via quickstart.md.

**Organization**: Tasks grouped by user story. All changes are to existing files — no new source files created.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no blocking dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)

---

## Phase 1: Setup

**Purpose**: Create local dev secret config.

- [x] T001 Create `.env.local` at project root with content `INTERNAL_SECRET=dev-secret-local-only` (this file is already git-ignored via `.env*`)

---

## Phase 2: Foundational

No cross-story foundational work required — all changes are modifications to three existing files that form a single chain. Proceed directly to user story phases after T001.

---

## Phase 3: User Story 1 — Guest Arrives via Invite QR Code (Priority: P1) 🎯 MVP

**Goal**: A guest scanning the QR code gets a working RSVP experience with the secret validated silently on every backend call.

**Independent Test**: Run `vercel dev`. Open `http://localhost:3000/?s=dev-secret-local-only` — RSVP lookup works end-to-end. Open without `?s=` — currently no gate yet (that's US2), but the backend correctly returns 401 for curl calls without the header.

### Implementation for User Story 1

- [x] T002 [US1] Add secret validation to `api/rsvp.ts`: insert as the second check in the handler (after method check, before body validation) — read `req.headers['x-invite-secret']` as a string; if it does not strictly equal `process.env.INTERNAL_SECRET` (or if `INTERNAL_SECRET` is undefined), return `res.status(401).json({ error: 'unauthorised' })`
- [x] T003 [P] [US1] Update `lookup()` in `src/services/rsvpApi.ts`: add `secret: string` as a second parameter; include it as `'X-Invite-Secret': secret` in the fetch headers object
- [x] T004 [US1] Update `src/components/RsvpLookup.tsx`: add `secret` state (`useState<string | null>(null)`); add `useEffect` on mount that (1) reads `new URLSearchParams(window.location.search).get('s')`, (2) if found writes it to `sessionStorage.setItem('invite_secret', value)` and sets state, (3) if not in URL reads `sessionStorage.getItem('invite_secret')` and sets state if present; update the `onSubmit` handler to pass `secret!` as the second argument to `rsvpApi.lookup()`

**Checkpoint**: `POST /api/rsvp` with correct `X-Invite-Secret` header returns 200. Without the header returns 401. Frontend passes the secret from `?s=` param through to the API call.

---

## Phase 4: User Story 2 — Visitor Arrives Without a Valid Invite Link (Priority: P2)

**Goal**: Anyone opening the site without a valid secret sees a clear "use your invite" screen and cannot access the RSVP lookup.

**Independent Test**: Open `http://localhost:3000` (no `?s=`). Verify gate screen is shown instead of the RSVP form. Open with wrong secret `?s=wrong` — gate screen shown. Open with correct secret — normal form shown.

### Implementation for User Story 2

- [x] T005 [US2] Add gate screen to `src/components/RsvpLookup.tsx`: after the mount `useEffect` resolves, if `secret === null` render a gate view instead of the form — heading "Please use your invite link", body "Scan the QR code on your physical invitation to access the RSVP.", no retry button and no back button interaction beyond the existing `onBack` prop
- [x] T006 [US2] Handle 401 response in `src/components/RsvpLookup.tsx` catch block: when `err instanceof RsvpApiError && err.status === 401`, call `sessionStorage.removeItem('invite_secret')` and set `secret(null)` — this will cause the component to re-render into the gate screen (handles the case where a secret was stored but has since been rotated)

**Checkpoint**: All four scenarios from quickstart.md pass: valid secret → form shown; no secret → gate screen; wrong secret → 401 → gate screen; refresh with valid secret in URL → form still shown.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Verification and code quality pass.

- [ ] T007 Manual end-to-end verification using all scenarios in `specs/004-qr-secret-auth/quickstart.md` with `vercel dev`
- [x] T008 [P] Run `npm run lint` and resolve any lint errors introduced by this feature

---

## Dependencies & Execution Order

### Task Chain

```
T001 (.env.local)
  ↓
T002 (backend secret check)  ←→  T003 [P] (service header param)
  ↓                                     ↓
  └─────────────── T004 (component reads secret, passes to service) ───────────┐
                                                                                ↓
                                                          T005 (gate screen for null secret)
                                                          T006 (401 → clear + gate)
                                                                                ↓
                                                               T007 + T008 [P] (polish)
```

T002 and T003 are in different files and can be done in parallel after T001.
T004 depends on both T002 and T003 being complete.
T005 and T006 both extend T004's work in the same file — do sequentially.

### Parallel Opportunities

- T002 (`api/rsvp.ts`) and T003 (`src/services/rsvpApi.ts`) after T001
- T007 (manual verification) and T008 (lint) in final phase

---

## Parallel Example: User Story 1

```bash
# After T001, run these two streams in parallel:

# Stream A (backend):
Task T002: "Add secret validation to api/rsvp.ts"

# Stream B (service layer — different file):
Task T003: "Update lookup() in src/services/rsvpApi.ts"

# Then merge:
Task T004: "Update RsvpLookup.tsx to read secret and pass to service"
```

---

## Implementation Strategy

### MVP (User Story 1 only)

1. T001 — create `.env.local`
2. T002 + T003 in parallel — backend + service
3. T004 — wire component to read and forward secret
4. **STOP and VALIDATE**: curl tests pass; frontend passes secret from URL to API

### Full delivery

5. T005 — gate screen for missing secret
6. T006 — 401 clears session and shows gate
7. T007 + T008 — polish pass

---

## Notes

- [P] tasks = different files with no blocking dependencies
- The `secret` state in RsvpLookup is `string | null` — `null` means "not present or revoked", a non-null value is always forwarded to the API
- T005 renders the gate screen based on `secret === null` (not a `ViewState` entry) — keeps the logic simple
- T006 reuses the gate screen by setting `secret(null)`, which naturally triggers the same render branch as T005
- After adding React Router in future: see routing note in plan.md regarding query param retention
