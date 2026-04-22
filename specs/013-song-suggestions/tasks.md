# Tasks: Guest Song Suggestions

**Input**: Design documents from `/specs/013-song-suggestions/`
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ contracts/ ✅ quickstart.md ✅

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

---

## Phase 1: Setup

**Purpose**: No new dependencies or files required. This phase confirms the existing structure is understood before changes begin.

- [x] T001 Read `src/types/rsvp.ts`, `src/components/RsvpLookup.tsx`, `api/rsvp-submit.ts`, and `gas/guest-lookup.gs` to confirm current shape before any edits

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Type definitions that all three layers (form, Vercel function, GAS) depend on. Must be complete before user story work begins.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T002 Add `song?: string` to the `Guest` type and to the additional guest array item shape in `src/types/rsvp.ts`
- [x] T003 [P] Add `song: string` to the `RsvpRow` type in `api/rsvp-submit.ts`

**Checkpoint**: Type definitions updated — user story implementation can now begin.

---

## Phase 3: User Story 1 — Submit Song Suggestion During RSVP (Priority: P1) 🎯 MVP

**Goal**: A primary guest sees a single optional song suggestion field when attending, fills it in, and the value is included in the submitted RSVP payload.

**Independent Test**: Complete a primary-guest RSVP with a song suggestion and verify the value is present in the JSON payload sent to `/api/rsvp-submit` (browser DevTools network tab). Verify submitting without a song causes no error.

- [x] T004 [US1] Add optional song suggestion text input (max 200 chars, `maxLength` validation) to the primary guest section of the attendance form in `src/components/RsvpLookup.tsx`, rendered only when `attending === 'true'`
- [x] T005 [US1] Include trimmed `song` value in the primary guest object during payload construction in `src/components/RsvpLookup.tsx` (omit field entirely if blank, matching dietary pattern)
- [x] T006 [P] [US1] Extend `flattenToRows()` in `api/rsvp-submit.ts` to map `guest.song ?? ''` to `RsvpRow.song`

**Checkpoint**: Primary guest song suggestion collected and forwarded to GAS layer.

---

## Phase 4: User Story 2 — Song Suggestions Visible in Sheet (Priority: P2)

**Goal**: The couple can see each guest's song suggestion as a "Song Suggestion" column (column K) on their existing per-person row in the RSVPs Google Sheet.

**Independent Test**: Submit an RSVP with a song suggestion (after US1 is complete) and verify column K "Song Suggestion" on the guest's row in the RSVPs sheet contains the submitted value. Verify a guest with no suggestion leaves column K blank.

- [x] T007 [P] [US2] Add `"Song Suggestion"` as the 11th header entry (index 10) in the RSVPs sheet header row in `gas/guest-lookup.gs`
- [x] T008 [US2] Add `row.song || ""` as the 11th value (index 10) in each row value array written to the sheet in `gas/guest-lookup.gs`

**Checkpoint**: Song suggestions appear correctly in the Google Sheet.

---

## Phase 5: User Story 3 — Additional Party Members Can Suggest Songs (Priority: P3)

**Goal**: Each additional party member in a multi-guest RSVP has their own song suggestion field; values are saved per-person to the sheet.

**Independent Test**: RSVP for 2+ guests, enter a song for the primary guest and leave additional guest blank (or vice versa). Verify each row in the sheet reflects the correct per-person value.

- [x] T009 [US3] Add optional song suggestion text input (max 200 chars) to each additional guest row in `src/components/RsvpLookup.tsx`, within the `additionalGuests` field array section
- [x] T010 [US3] Include trimmed `song` value (omit if blank) in each additional guest object during payload construction in `src/components/RsvpLookup.tsx`

**Checkpoint**: All user stories complete and independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T011 [P] Run all 5 test scenarios from `specs/013-song-suggestions/quickstart.md` and confirm each passes
- [x] T012 Run `npm run lint` and fix any issues

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — **blocks all user stories**
- **US1 (Phase 3)**: Depends on T002 (Guest type) and T003 (RsvpRow type)
- **US2 (Phase 4)**: Depends on T003 (RsvpRow type) and T006 (flattenToRows)
- **US3 (Phase 5)**: Depends on T002 (Guest type) and T004/T005 (same file as primary guest form changes — implement after to avoid merge conflicts)
- **Polish (Phase 6)**: Depends on all stories complete

### User Story Dependencies

- **US1 (P1)**: Unblocked after Foundational — core form + API layer
- **US2 (P2)**: GAS changes (T007, T008) can be done in parallel with US1 form work (different file); requires T006 to be complete before end-to-end testing
- **US3 (P3)**: Shares `RsvpLookup.tsx` with US1 — implement sequentially after US1 form tasks (T004, T005) to avoid conflicts

### Parallel Opportunities

- T002 and T003 are parallel (different files)
- T006 and T004/T005 are parallel (different files)
- T007 and T004/T005 are parallel (different files)
- T011 and T012 are parallel (independent)

---

## Parallel Example: Foundational + US1

```
# Foundational (parallel):
Task T002: Add song to Guest type in src/types/rsvp.ts
Task T003: Add song to RsvpRow type in api/rsvp-submit.ts

# US1 (T006 parallel with T004/T005):
Task T004 → T005: Form field + payload  (src/components/RsvpLookup.tsx)
Task T006:         flattenToRows update (api/rsvp-submit.ts)

# US2 (parallel with US1 form work):
Task T007 → T008: GAS header + row     (gas/guest-lookup.gs)
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2 Only)

1. Complete Phase 1: Setup (read files)
2. Complete Phase 2: Foundational (T002, T003)
3. Complete Phase 3: US1 (T004, T005, T006)
4. Complete Phase 4: US2 (T007, T008) — deploy updated GAS
5. **STOP and VALIDATE**: Submit an RSVP, check sheet column K
6. Ship if validated

### Incremental Delivery

1. Setup + Foundational → types ready
2. US1 + US2 → end-to-end song collection working (MVP)
3. US3 → additional guests covered
4. Polish → lint, tests, quickstart validation

---

## Notes

- [P] tasks = different files, no shared state, safe to implement concurrently
- GAS must be re-deployed after `gas/guest-lookup.gs` changes for US2 to take effect
- Existing rows in the RSVPs sheet will not have column K backfilled — only new submissions gain the field
- Commit after each phase checkpoint to preserve a working state
