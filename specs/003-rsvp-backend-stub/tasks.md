---

description: "Task list for RSVP Backend Stub implementation"
---

# Tasks: RSVP Backend Stub

**Input**: Design documents from `/specs/003-rsvp-backend-stub/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/rsvp-lookup.md ✓, quickstart.md ✓

**Tests**: Not requested — manual verification via quickstart.md.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no blocking dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)

## Path Conventions

This project uses Vercel conventions: `api/` for serverless functions at repo root, `src/` for frontend code.

---

## Phase 1: Setup

**Purpose**: Install new dependency and confirm dev workflow.

- [x] T001 Add `@vercel/node` as a devDependency in `package.json` (`npm install --save-dev @vercel/node`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types and canned data that both user stories depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T002 Create `src/types/rsvp.ts` with TypeScript types: `GuestRecord` (full_name, normalised_name, first_initial, last_name_normalised, max_guests), `MatchedGuest` (full_name, max_guests), `LookupRequest` (name), `LookupResponse` (status: "found"|"not_found", matches: MatchedGuest[])
- [x] T003 Create `api/rsvp.ts` with: (a) name normalisation function (trim → lowercase → NFD decompose → strip diacritics → strip non-alphanumeric except spaces → collapse spaces), (b) canned `GuestRecord[]` array containing at minimum: "Alice Johnson" (max 2), "Jane Smith" (max 3), "John Smith" (max 1), plus 2–3 additional records for realism — no handler yet

**Checkpoint**: Types and data are in place. Both user story phases can now proceed.

---

## Phase 3: User Story 1 — Guest Looks Up RSVP by Name (Priority: P1) 🎯 MVP

**Goal**: A guest submits their name, the backend returns matching records, and the frontend renders the result as either a single confirmed match or a selectable list.

**Independent Test**: Run `vercel dev`, `POST /api/rsvp` with `{"name":"Alice Johnson"}` returns single match; `{"name":"J Smith"}` returns two matches. Frontend shows both states correctly.

### Implementation for User Story 1

- [x] T004 [US1] Implement matching function in `api/rsvp.ts`: accepts normalised input string, parses last-name token and optional first-initial token, returns all `GuestRecord[]` entries where `last_name_normalised` matches exactly and (if initial provided) `first_initial` matches
- [x] T005 [US1] Implement POST request handler in `api/rsvp.ts`: read JSON body, validate `name` field (return 400 if missing/empty after trim), normalise input, call matching function, return `LookupResponse` JSON; return 405 for non-POST methods
- [x] T006 [P] [US1] Create `src/services/rsvpApi.ts`: async `lookup(firstName: string, lastName: string): Promise<LookupResponse>` function that POSTs `{name: "${firstName} ${lastName}".trim()}` to `/api/rsvp`, parses JSON response, and throws a typed error on HTTP 4xx/5xx or network failure
- [x] T007 [US1] Update `src/components/RsvpLookup.tsx`: replace stub `onSubmit` with call to `rsvpApi.lookup()`, add `loading` state (show spinner/disabled button while awaiting response), store result in component state
- [x] T008 [US1] Add single-match result view to `src/components/RsvpLookup.tsx`: when `status === "found"` and `matches.length === 1`, display guest's `full_name` and `max_guests`, with a "That's me" / proceed button
- [x] T009 [US1] Add multiple-match selectable list to `src/components/RsvpLookup.tsx`: when `status === "found"` and `matches.length > 1`, render a tappable list of guest names; selecting one shows the same single-match view (T008) for that record

**Checkpoint**: User Story 1 fully functional. `vercel dev` + manual curl tests pass. Frontend renders single-match and multi-match states without crashing.

---

## Phase 4: User Story 2 — Guest Name Not Found (Priority: P2)

**Goal**: A guest whose name is not in the list (or who submits empty input) sees a clear, friendly message that is distinct from a backend error.

**Independent Test**: Submit "Unknown Person" → "not found" message shown. Submit empty form → inline validation error, no network request. Break the function (e.g. syntax error) → "try again" error message shown, not "not found".

### Implementation for User Story 2

- [x] T010 [US2] Add not-found state view to `src/components/RsvpLookup.tsx`: when `status === "not_found"`, display friendly "We couldn't find your invite — double check your name or contact us" message with a "Try again" button that resets to the form
- [x] T011 [US2] Add backend error state view to `src/components/RsvpLookup.tsx`: when `rsvpApi.lookup()` throws (network failure or HTTP error), display "Something went wrong — please try again" message with retry button; this state MUST be visually distinct from not-found
- [x] T012 [US2] Verify client-side validation in `src/components/RsvpLookup.tsx`: confirm that submitting an empty or whitespace-only name triggers the existing react-hook-form validation error and does NOT call `rsvpApi.lookup()`; update validation rules if needed

**Checkpoint**: All four UI states (single match, multiple matches, not found, error) work independently. User Story 2 complete.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and code quality pass.

- [ ] T013 Manual end-to-end verification using all scenarios in `specs/003-rsvp-backend-stub/quickstart.md` with `vercel dev`
- [x] T014 [P] Run `npm run lint` and resolve any lint errors introduced by this feature

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS both user stories
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion
- **User Story 2 (Phase 4)**: Depends on Phase 3 completion (reuses component state and service from US1)
- **Polish (Phase 5)**: Depends on Phase 4 completion

### Within Phase 3

```
T002 (types) → T003 (canned data + normalise) → T004 (matching logic) → T005 (handler)
                                                 T006 [P] (service) ──────────────┐
                                                                                   ↓
                                                                   T007 (RsvpLookup wired up)
                                                                   → T008 (single match view)
                                                                   → T009 (multi match list)
```

T006 can be written in parallel with T004+T005 (different file, depends only on T002).

### Parallel Opportunities

- T006 (`src/services/rsvpApi.ts`) can be written in parallel with T004+T005 (`api/rsvp.ts`) once T002 is done
- T014 (lint) can run in parallel with T013 (manual verification)

---

## Parallel Example: User Story 1

```bash
# After T002+T003 complete, run these two streams in parallel:

# Stream A (backend):
Task T004: "Implement matching function in api/rsvp.ts"
Task T005: "Implement POST handler in api/rsvp.ts"

# Stream B (frontend service — different file):
Task T006: "Create src/services/rsvpApi.ts"

# Then merge and continue sequentially:
Task T007: "Update RsvpLookup.tsx with API call + loading state"
Task T008: "Add single-match result view"
Task T009: "Add multi-match selectable list"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: Install `@vercel/node`
2. Phase 2: Create types + canned data
3. Phase 3: Build backend function + wire up frontend happy path
4. **STOP and VALIDATE**: `vercel dev` — all match scenarios return correct results; frontend renders without crashing
5. Deploy to Vercel preview and confirm relative URL `/api/rsvp` works

### Incremental Delivery

1. Complete Phases 1–3 → MVP: guests can look up by name and see results
2. Add Phase 4 → Not-found and error states handled gracefully
3. Add Phase 5 → Clean lint pass, manual sign-off

---

## Notes

- [P] tasks = different files with no blocking dependencies
- [Story] label maps each task to its user story for traceability
- Use `vercel dev` (not `npm run dev`) for local development — see quickstart.md
- The canned data in T003 uses these real-ish names to cover all match paths: Alice Johnson (unique), Jane Smith + John Smith (shared surname, different initials)
- Input normalisation in T003 must handle accented names (e.g. "José" → "jose") via NFD decomposition
