# Tasks: GAS Google Sheet Guest Data Integration

**Input**: Design documents from `/specs/005-gas-sheet-integration/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: No automated test tasks — no test framework installed. Manual verification tasks included in Polish phase.

**Organization**: Tasks grouped by user story. US2 (manual setup) and US3 (script in repo) included as explicit checkable tasks per user request.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

---

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: Create the GAS script file and extend the TypeScript types. Both unblock the US1 code work and the US2 manual steps. Must complete before any user story work begins.

**⚠️ CRITICAL**: US1 code work and US2 manual setup both depend on this phase.

- [ ] T001 Create `gas/` directory at repo root (if absent)
- [ ] T002 Write `gas/guest-lookup.gs` — implement `doGet(e)` with: `GUEST_SECRET` property check returning `{"error":"unauthorised"}` on mismatch; `readGuests()` reading `Invites` tab (row 2 onward, col A + B), skipping blank rows, defaulting `max_guests` to 1 for blank/NaN; top-of-file block comment covering sheet structure, script property setup, deploy settings, and `GAS_TIMEOUT_MS` note
- [ ] T003 [P] Add `GasGuest` interface `{ full_name: string; max_guests: number }` and `GasResponse` interface `{ guests?: GasGuest[] | null; error?: string }` to `src/types/rsvp.ts`

**Checkpoint**: `gas/guest-lookup.gs` exists and typechecks pass — US1 and US2 can now proceed

---

## Phase 2: User Story 1 — Live Sheet Lookup (Priority: P1) 🎯 MVP

**Goal**: `api/rsvp.ts` fetches guest data from GAS on every request instead of using canned data.

**Independent Test**: Set `GAS_ENDPOINT_URL`, `GAS_SECRET`, and `GAS_TIMEOUT_MS` in `.env.local`, run `vercel dev`, submit a name that exists in your test sheet — correct `max_guests` is returned.

### Implementation for User Story 1

- [ ] T004 [US1] Remove canned-data section from `api/rsvp.ts`: delete `buildRecord()` helper and `GUESTS` constant (lines 19–44 in current file)
- [ ] T005 [US1] Add `fetchGuests()` to `api/rsvp.ts`: reads `GAS_ENDPOINT_URL` and `GAS_SECRET` from env (throw if either absent), reads `GAS_TIMEOUT_MS` from env defaulting to `6000`, calls `GET ${url}?secret=${encodeURIComponent(secret)}` with `AbortSignal.timeout(timeoutMs)`, throws on network error or timeout, throws if response body has `error` key or `guests` is absent/null, maps `GasGuest[]` → `GuestRecord[]` using existing `normaliseName()`
- [ ] T006 [US1] Update `findMatches()` signature in `api/rsvp.ts`: add `guests: GuestRecord[]` as first parameter, remove closure over (now-deleted) `GUESTS` constant
- [ ] T007 [US1] Update `handler()` in `api/rsvp.ts`: call `fetchGuests()` inside `try/catch` block before `findMatches()`; on catch: `console.error` the failure and return `res.status(502).json({ error: 'could not load guest list' })`; pass `guests` as first arg to `findMatches()`
- [ ] T008 [P] [US1] Create `.env.local.example` at repo root documenting required env vars: `INTERNAL_SECRET`, `GAS_ENDPOINT_URL`, `GAS_SECRET`, `GAS_TIMEOUT_MS=6000`

**Checkpoint**: `api/rsvp.ts` compiles with no type errors (`npm run lint`). All canned data removed. Function returns 502 when env vars are missing.

---

## Phase 3: User Story 2 — Manual Infrastructure Setup (Priority: P2)

**Goal**: The couple's Google Sheet and GAS web app are live and wired to the Vercel function.

**Independent Test**: After completing all tasks in this phase, submit a name from the sheet in the RSVP form and confirm the correct `max_guests` is returned from the live sheet (not canned data).

### Implementation for User Story 2 *(manual steps)*

- [ ] T009 [US2] **[MANUAL]** Create Google Sheet: go to sheets.google.com, create new spreadsheet, rename first tab to `Invites` (exact casing), add header row: A1 = `Full Name`, B1 = `Max Guests`; populate rows 2+ with the real guest list (one row per invite group)
- [ ] T010 [US2] **[MANUAL]** Open Apps Script editor (Extensions → Apps Script in the spreadsheet), delete all default code, paste the full contents of `gas/guest-lookup.gs` from this repo, save the project
- [ ] T011 [US2] **[MANUAL]** Set `GUEST_SECRET` script property: Project Settings (gear icon) → Script Properties → Add property: key = `GUEST_SECRET`, value = a new random secret (e.g. `openssl rand -base64 32`); save — keep this value for the next step
- [ ] T012 [US2] **[MANUAL]** Deploy GAS web app: Deploy → New deployment → Type: Web app → Execute as: Me → Who has access: Anyone → Deploy; copy the Web app URL
- [ ] T013 [US2] **[MANUAL]** Set Vercel environment variables in the Vercel dashboard (Settings → Environment Variables), for Production and Preview: `GAS_ENDPOINT_URL` = URL from T012; `GAS_SECRET` = secret from T011; `GAS_TIMEOUT_MS` = `6000`; also add all three to `.env.local` for local dev (this file is gitignored)
- [ ] T014 [US2] **[MANUAL]** Trigger Vercel redeploy: push the feature branch to origin (or use Vercel dashboard → Deployments → Redeploy) to pick up the new env vars

**Checkpoint**: The Vercel preview URL returns real guest data from the sheet. Adding a row to the sheet and re-submitting the lookup returns the new guest without any redeployment.

---

## Phase 4: User Story 3 — Script Reference (Priority: P3)

**Goal**: `gas/guest-lookup.gs` in the repo is complete and self-contained enough for a fresh deploy without external documentation.

**Independent Test**: Read only `gas/guest-lookup.gs`. Without opening quickstart.md, determine: the expected sheet tab name, the script property to set, the deploy settings (Execute as / Who has access), and what `GAS_TIMEOUT_MS` controls. All four should be answerable from the file comments alone.

### Implementation for User Story 3

- [ ] T015 [US3] Review `gas/guest-lookup.gs` header comment block against the independent test above — confirm tab name, property name, deploy settings, and timeout note are all present and accurate; update if any are missing or unclear

**Checkpoint**: The script file is self-documenting. US3 acceptance scenarios pass.

---

## Phase 5: Polish & Verification

**Purpose**: End-to-end validation, error-path checks, and lint.

- [ ] T016 Run `npm run lint` from repo root and confirm zero errors or type failures
- [ ] T017 [P] End-to-end happy path: submit a name from the real sheet via the RSVP form (Vercel preview URL) and confirm correct `full_name` and `max_guests` are returned
- [ ] T018 [P] End-to-end diacritic test: add a guest with a diacritic name (e.g. `María García`) to the sheet; submit `maria garcia` in the RSVP form; confirm match
- [ ] T019 Error path: temporarily set `GAS_SECRET` to a wrong value in `.env.local`; run `vercel dev`; submit any name; confirm the RSVP UI shows a user-friendly error message (not a blank screen or raw JSON); restore the correct secret

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Foundational)**: No dependencies — start immediately
- **Phase 2 (US1 code)**: Depends on Phase 1 (needs `GasGuest`/`GasResponse` types from T003)
- **Phase 3 (US2 manual)**: Depends on Phase 1 T002 (`gas/guest-lookup.gs` must exist to paste); T013 also depends on Phase 2 being merged/deployed
- **Phase 4 (US3)**: Depends on Phase 1 T002 existing; independent of Phase 2 and 3
- **Phase 5 (Polish)**: Depends on Phases 2 and 3 both complete

### User Story Dependencies

- **US1 (P1)**: Depends on Phase 1 (types); independent of US2/US3 for code writing, but needs US2 complete for end-to-end testing
- **US2 (P2)**: Depends on Phase 1 T002 (script file must exist to copy); T014 depends on US1 code being deployed
- **US3 (P3)**: Depends on Phase 1 T002; otherwise independent

### Within Each Phase

- T004 → T005 → T006 → T007 (all in `api/rsvp.ts`, sequential)
- T009 → T010 → T011 → T012 → T013 → T014 (manual steps, sequential)
- T015 (US3) independent of US1/US2 code

### Parallel Opportunities

- T003 (type additions) and T002 (GAS script) can run in parallel after T001
- T008 (`.env.local.example`) can run in parallel with any US1 task
- T015 (US3 review) can run in parallel with Phase 3 manual steps
- T017 and T018 (happy path + diacritic test) can run in parallel

---

## Parallel Example: Phase 1

```
T001 (create gas/ dir)
  ↓
  ├── T002 Write gas/guest-lookup.gs
  └── T003 [P] Add GasGuest/GasResponse to src/types/rsvp.ts
```

---

## Implementation Strategy

### MVP First (US1 code + manual setup)

1. Complete Phase 1: Foundational (T001–T003)
2. Complete Phase 2: US1 code changes (T004–T008)
3. Complete Phase 3: Manual infrastructure (T009–T014)
4. **STOP and VALIDATE**: Run T017 — guest lookup returns live sheet data
5. Deploy to production

### Incremental Delivery

1. Phase 1 → Foundation ready (types + GAS script)
2. Phase 2 → Code compiles, error paths work (testable with env vars)
3. Phase 3 → Live end-to-end flow working ← **demo-able milestone**
4. Phase 4 → Script reference verified ← operational continuity
5. Phase 5 → Fully validated and linted

---

## Notes

- `[MANUAL]` tasks cannot be automated — they require browser access to Google and Vercel dashboards
- `GAS_SECRET` and `INTERNAL_SECRET` are distinct secrets — never reuse one for the other
- GAS always returns HTTP 200 — error detection is body-based (dual check in `fetchGuests()`)
- `AbortSignal.timeout()` requires Node 18+ — available on all Vercel runtimes since 2023
- Committing `.env.local` to git would expose secrets — it is gitignored
