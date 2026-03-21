# Tasks: RSVP Sheet Persistence

**Input**: Design documents from `/specs/009-rsvp-sheet-persistence/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Unit tests included for `flattenToRows` (mentioned in plan.md; core logic is non-trivial and independently testable).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

## Path Conventions

This is a web app project. Key paths:
- `api/` — Vercel serverless functions
- `gas/` — Google Apps Script files
- `src/` — React frontend
- `tests/` — test files

---

## Phase 1: Setup (Shared Types)

**Purpose**: Add the new TypeScript types that both the Vercel function and tests depend on. No new files — types extend the existing `src/types/rsvp.ts`.

- [ ] T001 Add `RsvpRow`, `GasWriteRequest`, and `GasWriteResponse` TypeScript interfaces to `src/types/rsvp.ts` per the shapes defined in `specs/009-rsvp-sheet-persistence/data-model.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The row-flattening logic is the core business rule shared by the Vercel wiring (US1) and its unit tests. It must exist before Phase 3 begins.

**⚠️ CRITICAL**: T005 (Vercel wiring) and T003 (unit tests) both depend on this phase being complete.

- [ ] T002 Implement pure function `flattenToRows(request: RsvpSubmitRequest, timestamp: string): RsvpRow[]` in `api/rsvp-submit.ts` following rules in `specs/009-rsvp-sheet-persistence/data-model.md`: if `attending=false` produce one row (primary only, `attending="no"`); if `attending=true` produce one row per guest (`attending="yes"`); set `invite_source = guests[0].name` on every row; capitalise `type` (`"primary"` → `"Primary"`, `"plus-one"` → `"Plus-One"`); set deferred fields (`is_child`, `age_range`, `seating_needs`, `safety_ack`) to `""`
- [ ] T003 [P] Write unit tests for `flattenToRows` in `tests/rsvp-submit.test.ts`: (a) decline with two named plus-ones produces exactly 1 row with `attending="no"` and no plus-one rows, (b) accept with two plus-ones produces 3 rows all with `attending="yes"`, (c) `invite_source` equals `guests[0].name` on every row in both scenarios, (d) `type` values are `"Primary"` and `"Plus-One"` (capitalised), (e) deferred fields are `""` not `null`/`undefined`

**Checkpoint**: `npm test` passes for `flattenToRows` unit tests before starting Phase 3.

---

## Phase 3: User Story 1 — Guest Submits RSVP, Every Person Saved (Priority: P1) 🎯 MVP

**Goal**: Every RSVP submission writes one row per person to the RSVPs Google Sheet atomically. Declined submissions produce exactly one row.

**Independent Test**: Submit a form with one primary guest and two plus-ones. Open the Google Sheet → RSVPs tab and confirm three rows appear with the correct data, same `invite_source`, and same timestamp. Submit a decline and confirm exactly one row with `attending=no`.

### Implementation for User Story 1

- [ ] T004 [US1] Add `doPost(e)` handler to `gas/guest-lookup.gs`: (1) parse `e.postData.contents` as JSON; (2) validate `body.secret === PropertiesService.getScriptProperties().getProperty('GUEST_SECRET')`, return `{error:'unauthorised'}` if mismatch; (3) validate `body.rows` is a non-empty array, return `{error:'invalid payload'}` if not; (4) get or create the `RSVPs` sheet via `SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RSVPs')` (create with `insertSheet('RSVPs')` if null); (5) write header row `['timestamp','guest_name','attending','dietary','type','invite_source','is_child','age_range','seating_needs','safety_ack']` if `sheet.getLastRow() === 0`; (6) build `data` as 2D array from `body.rows` in the same column order; (7) write via `sheet.getRange(sheet.getLastRow() + 1, 1, data.length, 10).setValues(data)`; (8) wrap step 7 in try/catch, return `{error:'Sheet write failed: ' + e.message}` on exception; (9) return `{status:'ok', rowsWritten: data.length}`
- [ ] T005 [US1] Wire persistence into `api/rsvp-submit.ts`: after the existing validation block, (1) generate `const timestamp = new Date().toISOString()`; (2) call `flattenToRows(body, timestamp)` to get `RsvpRow[]`; (3) build `GasWriteRequest` with `{secret: process.env.GAS_SECRET, rows}`; (4) `fetch(process.env.GAS_ENDPOINT_URL!, { method: 'POST', body: JSON.stringify(gasReq), signal: AbortSignal.timeout(Number(process.env.GAS_TIMEOUT_MS ?? 6000)) })`; (5) parse response JSON as `GasWriteResponse`; (6) if `response.error` is present or fetch throws/aborts, return HTTP 502 `{error:'failed to save RSVP'}`; (7) otherwise return HTTP 200 `{status:'ok'}`
- [ ] T006 [US1] Add submission loading state to `src/components/RsvpLookup.tsx`: introduce `isSubmitting` boolean state; set to `true` before `submitRsvp` call and `false` in finally; disable the submit button and show a loading indicator (spinner or "Saving…" text) while `isSubmitting` is true; on 502/error from `submitRsvp`, display an inline error message without navigating away and without resetting any form field values (react-hook-form state is preserved automatically — just surface the error)

**Checkpoint**: User Story 1 is fully functional. `npm test` passes. Manual E2E test (quickstart.md step 4) shows three rows in the sheet.

---

## Phase 4: User Story 2 — Couple and Caterers Read Sheet Directly (Priority: P2)

**Goal**: The RSVPs sheet always has a header row with correct column labels, so non-technical stakeholders can read it without any setup.

**Independent Test**: Delete the RSVPs tab from the Google Sheet (if it exists). Submit one RSVP. Open the sheet — confirm the RSVPs tab was auto-created, row 1 is the header with exactly the labels and order from `specs/009-rsvp-sheet-persistence/data-model.md`, and row 2 is the data row.

### Implementation for User Story 2

- [ ] T007 [US2] Validate `gas/guest-lookup.gs` `doPost` header guard: confirm the header values and column order in T004 exactly match the 10-column order in `specs/009-rsvp-sheet-persistence/data-model.md` (`timestamp`, `guest_name`, `attending`, `dietary`, `type`, `invite_source`, `is_child`, `age_range`, `seating_needs`, `safety_ack`); confirm the guard condition is `sheet.getLastRow() === 0` (not `<= 1`) so it does not re-write a header that already exists from a prior deployment

**Checkpoint**: User Story 2 validated. Deleting and re-creating the RSVPs sheet always produces the correct header on first write.

---

## Phase 5: User Story 3 — Re-submissions Append Without Overwriting (Priority: P3)

**Goal**: A second RSVP submission from the same guest appends new rows rather than overwriting the original, preserving the full audit trail.

**Independent Test**: Submit two RSVPs for the same guest name with different dietary values. The RSVPs sheet should contain two separate rows (or sets of rows) with different timestamps. The first submission's row must be unchanged.

### Implementation for User Story 3

- [ ] T008 [US3] Verify in `gas/guest-lookup.gs` `doPost` that `startRow` for `setValues()` is computed as `sheet.getLastRow() + 1` *after* any header write (not before), so each call reads the true current last row; submit two sequential RSVPs and confirm both sets of rows appear in the sheet with distinct timestamps and the first set is unmodified

**Checkpoint**: User Story 3 validated. All three user stories now independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Deployment, final verification, and cleanup.

- [ ] T009 Redeploy GAS script: open Extensions → Apps Script → Deploy → Manage deployments → pencil icon on the existing web app → set Version to "New version" → Deploy; confirm the web app URL has not changed (the URL shown must match `GAS_ENDPOINT_URL` in Vercel env vars)
- [ ] T010 [P] Run `npm test` — confirm all unit tests pass including the `flattenToRows` suite in `tests/rsvp-submit.test.ts`
- [ ] T011 [P] Run full E2E verification per `specs/009-rsvp-sheet-persistence/quickstart.md`: multi-person accept (step 4), decline path (step 5), error-handling/retry path (step 6); confirm zero rows with blank `invite_source` in the RSVPs sheet

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (needs `RsvpRow` type) — **BLOCKS Phase 3**
- **User Story 1 (Phase 3)**: Depends on Phase 2 — T004 (GAS) and T005/T006 (Vercel/frontend) can proceed in parallel once Phase 2 is done
- **User Story 2 (Phase 4)**: Depends on T004 (must implement before verifying); T007 is a verification step
- **User Story 3 (Phase 5)**: Depends on T004; T008 is a verification step
- **Polish (Phase 6)**: Depends on all phases complete; T010 and T011 can run in parallel

### User Story Dependencies

- **US1 (P1)**: Depends on Foundational phase only — primary deliverable
- **US2 (P2)**: Depends on T004 (GAS doPost) — verifies header guard behavior
- **US3 (P3)**: Depends on T004 (GAS doPost) — verifies append behavior

### Within Phase 3

- T004 (GAS script) and T005/T006 (Vercel + frontend) are in different files and can proceed in parallel once Phase 2 is done
- T005 depends on T002 (`flattenToRows`)
- T006 is independent of T004 and T005 (different file)

---

## Parallel Example: Phase 3 (User Story 1)

```bash
# Once Phase 2 is complete, launch all three Phase 3 tasks in parallel:
Task A: "Add doPost handler to gas/guest-lookup.gs" (T004)
Task B: "Wire persistence into api/rsvp-submit.ts" (T005)
Task C: "Add loading state to src/components/RsvpLookup.tsx" (T006)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002, T003) — verify tests pass
3. Complete Phase 3: User Story 1 (T004, T005, T006) in parallel
4. **STOP and VALIDATE**: Run quickstart.md step 4 — confirm rows in sheet
5. Deploy GAS new version (T009) — MVP live

### Incremental Delivery

1. Setup + Foundational → tests pass → foundation ready
2. US1 complete → rows persisted → **MVP shipped**
3. US2 validation (T007) → header always correct → couple can share sheet with caterers
4. US3 validation (T008) → re-submissions confirmed safe → feature complete
5. Polish (T010, T011) → full sign-off

### Parallel Team Strategy

With two developers after Phase 2 is done:
- **Developer A**: T004 (GAS doPost handler)
- **Developer B**: T005 + T006 (Vercel wiring + frontend loading state)

---

## Notes

- [P] tasks are in different files with no shared dependencies — safe to run simultaneously
- [Story] label maps each task to its user story for traceability
- T007 and T008 are validation/verification tasks — no new code expected; they confirm implementation correctness
- US2 and US3 are naturally delivered by the correct US1 implementation; their phases exist to make the verification explicit and independently testable
- The GAS script URL does not change on redeployment — `GAS_ENDPOINT_URL` env var requires no update
- Deferred fields (`is_child`, `age_range`, `seating_needs`, `safety_ack`) are always `""` — never `null` or `undefined` (GAS `setValues` behaves unpredictably with non-string values)
