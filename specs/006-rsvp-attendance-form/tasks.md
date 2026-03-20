# Tasks: RSVP Attendance Form

**Input**: Design documents from `/specs/006-rsvp-attendance-form/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: No test tasks — no test framework is configured for this project.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)

## Path Conventions

Single-project web app with `src/` and `api/` at repository root.

---

## Phase 1: Setup

No new project structure required. All work extends existing files. Proceed directly to Phase 2.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: New types, new endpoint, and new service function that both user stories depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T001 [P] Add `RsvpSubmitRequest` and `RsvpSubmitResponse` interfaces to `src/types/rsvp.ts` — `RsvpSubmitRequest: { guest_name: string; attending: boolean }`, `RsvpSubmitResponse: { status: 'ok' }`
- [x] T002 [P] Create `api/rsvp-submit.ts` — Vercel serverless function that: (1) rejects non-POST methods with 405, (2) validates `X-Invite-Secret` header against `process.env.INTERNAL_SECRET` (return 401 on mismatch), (3) parses and validates body with Zod (`guest_name` non-empty string, `attending` boolean; return 400 on failure), (4) returns `{ status: 'ok' }` with 200
- [x] T003 Add `submitRsvp(guestName: string, attending: boolean, secret: string): Promise<RsvpSubmitResponse>` to `src/services/rsvpApi.ts` — POST to `/api/rsvp-submit` with `X-Invite-Secret` header; throw `RsvpApiError` on non-200 response (depends on T001)
- [x] T004 Add `rsvp-submitted` variant to `ViewState` in `src/components/RsvpLookup.tsx`: `{ kind: 'rsvp-submitted'; guest: MatchedGuest; attending: boolean }` (depends on T001)

**Checkpoint**: Foundation ready — types, endpoint, service, and new state variant all in place.

---

## Phase 3: User Story 1 — Submit Attendance Decision (Priority: P1) 🎯 MVP

**Goal**: Replace the "RSVP flow coming soon." placeholder in the `confirmed` view state with a working inline attendance form.

**Independent Test**: Load the RSVP page, complete a guest name lookup to reach the `confirmed` state, verify the attendance form appears inline with two options, submit, and verify the `rsvp-submitted` state is reached.

### Implementation for User Story 1

- [x] T005 [US1] Replace the "RSVP flow coming soon." placeholder in the `confirmed` branch of `RsvpLookup.tsx` with an attendance form — render two mutually exclusive buttons or radio options labelled "Attending" and "Not Attending", controlled by local form state (depends on T004)
- [x] T006 [US1] Add react-hook-form validation to the attendance form in `src/components/RsvpLookup.tsx` — the submit button MUST be disabled (or trigger an inline validation error) when no option is selected (depends on T005)
- [x] T007 [US1] Add submit handler in `src/components/RsvpLookup.tsx` — on form submit: (1) show a loading spinner, (2) call `submitRsvp(guest.full_name, attending, secret)`, (3) on success transition to `{ kind: 'rsvp-submitted', guest, attending }` view state (depends on T006, T003)
- [x] T008 [US1] Add inline submission error handling in `src/components/RsvpLookup.tsx` — on `submitRsvp` failure display an error message inline (below the form), keep the guest's selection intact, and allow retry without resetting the form (depends on T007)

**Checkpoint**: User Story 1 fully functional. Guest can reach confirmed state, select attendance, submit, and land on the submitted state.

---

## Phase 4: User Story 2 — View Confirmation After Submission (Priority: P2)

**Goal**: Render the `rsvp-submitted` view state inline showing the guest's name and their attendance decision.

**Independent Test**: Trigger the `rsvp-submitted` state (by completing US1 flow), verify the confirmation displays the correct guest name and decision text for both attending and not-attending cases.

### Implementation for User Story 2

- [x] T009 [US2] Add `rsvp-submitted` branch to the view state renderer in `src/components/RsvpLookup.tsx` — display the guest's `full_name` and a confirmation message reflecting their decision: distinct messaging for attending vs. not attending (depends on T004, T007)

**Checkpoint**: User Stories 1 and 2 both complete. Full inline flow works: lookup → confirmed → attendance form → submit → confirmation.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [x] T010 [P] Mobile-first styling review in `src/components/RsvpLookup.tsx` — verify attendance options and submit button are sufficiently large for touch interaction on mobile screens (constitution Principle I); adjust Tailwind classes as needed
- [ ] T011 [P] Validate the `api/rsvp-submit.ts` endpoint against all three curl scenarios in `specs/006-rsvp-attendance-form/quickstart.md` (happy path, missing secret, invalid body) against the local dev server

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: No dependencies — can start immediately. T001 and T002 are fully parallel.
- **User Story 1 (Phase 3)**: Depends on entire Phase 2 (T001–T004).
- **User Story 2 (Phase 4)**: Depends on T004 (ViewState) and T007 (submit handler sets the state).
- **Polish (Phase 5)**: Depends on all implementation phases being complete.

### User Story Dependencies

- **US1 (P1)**: Depends on Foundational phase — no dependency on US2.
- **US2 (P2)**: Depends on T004 (from Foundational) and T007 (from US1) — US2 renders the state that US1 sets.

### Within Each User Story

- T005 → T006 → T007 → T008 (sequential — all in same component, each builds on previous)
- T009 can start as soon as T004 and T007 are done

### Parallel Opportunities

- T001 and T002 are fully parallel (different files: `src/types/rsvp.ts` vs `api/rsvp-submit.ts`)
- T003 and T004 can run in parallel after T001 completes (different files: `src/services/rsvpApi.ts` vs `src/components/RsvpLookup.tsx`)
- T010 and T011 are fully parallel (different concerns)

---

## Parallel Example: Foundational Phase

```
Start together:
  T001 — Add types to src/types/rsvp.ts
  T002 — Create api/rsvp-submit.ts

Once T001 complete, start together:
  T003 — Add submitRsvp() to src/services/rsvpApi.ts
  T004 — Add rsvp-submitted ViewState variant to src/components/RsvpLookup.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (T001–T004)
2. Complete Phase 3: User Story 1 (T005–T008)
3. **STOP and VALIDATE**: Guest can look up name, select attendance, submit, see the `rsvp-submitted` state
4. US2 (T009) can follow immediately after

### Incremental Delivery

1. Phase 2 complete → stub endpoint live, types and service in place
2. Phase 3 complete → working attendance form, functional submission (MVP)
3. Phase 4 complete → full inline confirmation experience
4. Phase 5 complete → mobile polish and endpoint verified

---

## Notes

- [P] tasks = different files, no dependencies on each other
- All implementation is in existing files except `api/rsvp-submit.ts` (new file)
- The `confirmed` view state in `RsvpLookup.tsx` already exists with "coming soon" placeholder — T005 replaces that placeholder only; do not restructure the surrounding code
- `secret` for `submitRsvp()` is already available in `RsvpLookup.tsx` via `sessionStorage` (established in 004) — no new auth wiring needed
- Commit after each phase checkpoint to keep history clean
