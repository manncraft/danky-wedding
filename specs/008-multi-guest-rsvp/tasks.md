# Tasks: Multi-Guest RSVP

**Input**: Design documents from `/specs/008-multi-guest-rsvp/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

## Path Conventions

Web application layout:
- Frontend component: `src/components/RsvpLookup.tsx`
- Frontend types: `src/types/rsvp.ts`
- Frontend service: `src/services/rsvpApi.ts`
- API stub: `api/rsvp-submit.ts`

---

## Phase 1: Setup

No project initialization required — this feature extends an existing TypeScript/React project. Proceed directly to Phase 2.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared type contracts that all user story phases depend on. Both tasks touch different files and can run in parallel.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T001 [P] Add `Guest` type (`{ name: string; dietary?: string; type: 'primary' | 'plus-one' }`) and replace existing `RsvpSubmitRequest` fields (`guest_name`, `attending`, `dietary`) with `{ attending: boolean; guests: Guest[] }` in `src/types/rsvp.ts`
- [x] T002 [P] Extend `AttendanceFormData` interface with `additionalGuests: { name: string; dietary?: string }[]` and update `submitRsvp` in `src/services/rsvpApi.ts` to build the flat `guests[]` payload per the contract in `specs/008-multi-guest-rsvp/contracts/rsvp-submit.md`

**Checkpoint**: Type contracts in place — user story implementation can now begin.

---

## Phase 3: User Story 1 — Add Additional Guests to RSVP (Priority: P1) 🎯 MVP

**Goal**: When a guest's invitation allows more than one person and they are attending, show a static "Are you RSVPing for anyone else?" label and an "Add Guest" button. Each added guest gets a visually-delineated section with a required name field, an optional dietary field, and a trash-can remove button. The button hides at capacity. All guests are submitted as a flat `guests[]` array.

**Independent Test**: Load the RSVP form for an invitation with `max_guests: 3`, select Attending, add 2 guests with names and dietary info, submit, and confirm the network request contains `guests: [{ name, dietary, type: 'primary' }, { name, dietary, type: 'plus-one' }, { name, dietary, type: 'plus-one' }]`.

- [x] T003 [US1] Wire `useFieldArray` for `additionalGuests` into the existing attendance `useForm` instance and add a `useEffect` that calls `replace([])` when `attending` changes to `'false'` in `src/components/RsvpLookup.tsx`
- [x] T004 [US1] Render the "Are you RSVPing for anyone else?" static label and "Add Guest" button below the primary dietary field, visible only when `attending === 'true'` and `guest.max_guests > 1`; hide the button when `fields.length >= guest.max_guests - 1` in `src/components/RsvpLookup.tsx`
- [x] T005 [US1] Render each `fields` entry as a visually-delineated card (Tailwind border + rounded + padding) containing: a required name text input (`register(\`additionalGuests.\${index}.name\`, { required: true })`), an optional dietary text input, and a trash-can SVG button that calls `remove(index)` in `src/components/RsvpLookup.tsx`
- [x] T006 [US1] Update `onSubmit` to build the flat `guests[]` payload — primary guest at index 0 (`type: 'primary'`, `name: guest.full_name`, `dietary`) followed by `additionalGuests` mapped to `type: 'plus-one'` entries — and call `submitRsvp` with the new `RsvpSubmitRequest` shape in `src/components/RsvpLookup.tsx`
- [x] T007 [US1] Update `api/rsvp-submit.ts` stub to accept and validate the `{ attending: boolean; guests: Guest[] }` payload: check `guests` is a non-empty array, `guests[0].type === 'primary'`, `guests[0].name` is non-empty, and each element with `type: 'plus-one'` has a non-empty `name`; return 400 on failure, `{ status: 'ok' }` on success

**Checkpoint**: US1 fully functional — can add guests, submit, and see correct payload in network tab.

---

## Phase 4: User Story 2 — Single-Guest Invitation (Priority: P2)

**Goal**: Guests whose invitation allows exactly 1 person see no multi-guest UI — the form is identical to the pre-feature version.

**Independent Test**: Load the RSVP form for an invitation with `max_guests: 1`, select Attending, and confirm the "Are you RSVPing for anyone else?" label and "Add Guest" button are absent from the DOM entirely (not just hidden with CSS).

- [x] T008 [US2] Confirm the condition added in T004 (`guest.max_guests > 1`) results in the entire multi-guest section being absent from the DOM when `max_guests === 1`; add an explicit early return or null render to ensure no residual elements leak through in `src/components/RsvpLookup.tsx`

**Checkpoint**: US2 verified — single-invite guests see an unmodified form.

---

## Phase 5: User Story 3 — Dynamic Add and Remove at Scale (Priority: P3)

**Goal**: The form correctly tracks add/remove sequences at larger party sizes: removing a guest re-enables the "Add Guest" button if below capacity; the count never exceeds `max_guests`.

**Independent Test**: Load the form for an invitation with `max_guests: 4`, add 3 guests (button disappears), remove the second one (button reappears), add another (button disappears again), and submit — confirm the payload contains exactly 4 guests in total.

- [x] T009 [US3] Verify the `fields.length >= guest.max_guests - 1` condition from T004 is reactive to removals — after calling `remove(index)`, `fields.length` decreases and the "Add Guest" button reappears without a page reload; confirm with a manual walkthrough at `max_guests: 4` using the quickstart scenario in `specs/008-multi-guest-rsvp/quickstart.md`
- [x] T010 [US3] Ensure form validation (name required on each added guest) blocks submission when any `additionalGuests[*].name` is empty: display an inline validation error below the offending name input using `formState.errors.additionalGuests` in `src/components/RsvpLookup.tsx`

**Checkpoint**: US3 verified — add/remove sequences work correctly at all party sizes and validation prevents nameless guest submissions.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T011 [P] Verify the trash-can SVG button meets minimum touch-target size (44×44 px) and has an `aria-label="Remove guest"` attribute for screen-reader accessibility in `src/components/RsvpLookup.tsx`
- [x] T012 [P] Verify the additional guest card layout is correct at 375px viewport width (iPhone SE) — name and dietary inputs stack vertically, trash-can button in top-right corner does not overlap inputs in `src/components/RsvpLookup.tsx`
- [x] T013 Run `npm test && npm run lint` from repo root and fix any type errors or lint failures introduced by the new `Guest` type and updated `RsvpSubmitRequest`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: No dependencies — start immediately; T001 and T002 are parallel
- **US1 (Phase 3)**: Depends on Phase 2 completion — T003 → T004 → T005 → T006 → T007 (sequential within story)
- **US2 (Phase 4)**: Depends on Phase 3 (T004 specifically); single verification task
- **US3 (Phase 5)**: Depends on Phase 3 completion; T009 and T010 can run in parallel
- **Polish (Phase 6)**: Depends on all user story phases; T011 and T012 are parallel

### User Story Dependencies

- **US1 (P1)**: Depends only on Phase 2 — no dependency on US2 or US3
- **US2 (P2)**: Depends on US1's conditional rendering (T004) being in place
- **US3 (P3)**: Depends on US1's `useFieldArray` setup (T003) and button condition (T004) being in place

### Within US1

T003 → T004 → T005 → T006 → T007 (each builds on the previous within the same component)

---

## Parallel Example: Phase 2 (Foundational)

```
Launch in parallel:
  T001 — Add Guest type + update RsvpSubmitRequest in src/types/rsvp.ts
  T002 — Extend AttendanceFormData + update submitRsvp in src/services/rsvpApi.ts
```

## Parallel Example: Phase 6 (Polish)

```
Launch in parallel:
  T011 — Accessibility: touch target + aria-label on trash-can button
  T012 — Mobile layout verification at 375px
Then sequentially:
  T013 — npm test && npm run lint
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (T001, T002 in parallel)
2. Complete Phase 3: User Story 1 (T003 → T004 → T005 → T006 → T007)
3. **STOP and VALIDATE**: Follow quickstart.md test scenarios manually
4. Demo to stakeholder before continuing to US2/US3

### Incremental Delivery

1. Phase 2 → Phase 3 (US1): Core add-guest flow working end-to-end
2. Phase 4 (US2): Confirm single-invite guests are unaffected
3. Phase 5 (US3): Validate remove flow and validation at scale
4. Phase 6: Polish and ship

---

## Notes

- All changes are in 4 files: `src/types/rsvp.ts`, `src/services/rsvpApi.ts`, `src/components/RsvpLookup.tsx`, `api/rsvp-submit.ts`
- `RsvpLookup.tsx` is the primary file — most tasks touch it; keep sequential within a session
- The `guests[]` payload change in T001/T002 is a **breaking change** on the stub endpoint — no live data is at risk
- `useFieldArray` is already in the installed react-hook-form package; no new dependencies needed
- Refer to `specs/008-multi-guest-rsvp/quickstart.md` for exact code patterns for T003 and T006
