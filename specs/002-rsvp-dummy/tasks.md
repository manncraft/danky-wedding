---
description: "Task list for RSVP lookup screen"
---

# Tasks: RSVP Lookup Screen

**Input**: Design documents from `/specs/002-rsvp-dummy/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, quickstart.md ✅

**Tests**: Not requested — manual QA via Vercel preview per quickstart.md.

---

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)

---

## Phase 1: Setup

**Purpose**: Install react-hook-form.

- [ ] T001 Install react-hook-form: run `npm install react-hook-form`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add view state to `App.tsx` and update `Nav.tsx` with the RSVP
button. Both user stories depend on this.

**⚠️ CRITICAL**: Phases 3 and 4 depend on this phase being complete.

- [ ] T002 Update `src/App.tsx` to add `view` state typed as `'landing' | 'rsvp-lookup'` (default `'landing'`); pass `onRsvpClick={() => setView('rsvp-lookup')}` to `<Nav>`; conditionally render `<main>` sections when `view === 'landing'` and a placeholder `<div>RSVP</div>` when `view === 'rsvp-lookup'`
- [ ] T003 Update `src/components/Nav.tsx` to accept `onRsvpClick: () => void` prop and render an "RSVP" button in the nav bar that calls it on click; apply Tailwind classes consistent with the existing nav style

**Checkpoint**: Nav shows RSVP button; clicking it swaps the view. Back to landing
by refreshing (stub only — back control comes in Phase 3).

---

## Phase 3: User Story 1 — Navigate to RSVP Lookup from Nav (Priority: P1) 🎯 MVP

**Goal**: RSVP button in nav opens the lookup screen; a back control returns to
the landing page.

**Independent Test**: Tap RSVP → lookup screen appears. Tap back → landing page
with all sections returns.

### Implementation for User Story 1

- [ ] T004 [US1] Create `src/components/RsvpLookup.tsx` — accepts `onBack: () => void` prop; renders a screen-level container with a back/close button that calls `onBack`, a heading ("Find Your Invite"), and placeholder `<p>Form goes here</p>`; apply basic Tailwind layout classes
- [ ] T005 [US1] Update `src/App.tsx` to replace the placeholder `<div>RSVP</div>` with `<RsvpLookup onBack={() => setView('landing')} />`

**Checkpoint**: US1 fully functional — RSVP button opens lookup screen, back
button returns to landing. Form content comes in US2.

---

## Phase 4: User Story 2 — Enter Name and Find Invite (Priority: P2)

**Goal**: The lookup screen shows a react-hook-form form with first name, last
name, and Find Invite button. Valid submit shows stub message; empty fields show
inline errors.

**Independent Test**: Fill both fields → tap Find Invite → stub message shown,
zero network requests. Leave a field empty → tap Find Invite → inline error
visible on the empty field.

### Implementation for User Story 2

- [ ] T006 [US2] Update `src/components/RsvpLookup.tsx` to replace the placeholder paragraph with a `useForm` form containing: a labelled first name input (`firstName`, required), a labelled last name input (`lastName`, required), and a "Find Invite" submit button; register both fields with `react-hook-form` `register` and mark both as `required`
- [ ] T007 [US2] Add inline validation error messages to `src/components/RsvpLookup.tsx` — display `errors.firstName.message` beneath the first name field and `errors.lastName.message` beneath the last name field when present; use `formState: { errors }` from `useForm`
- [ ] T008 [US2] Add submit handler to `src/components/RsvpLookup.tsx` — `onSubmit` receives valid form data and sets local `submitted` state to `true`; when `submitted` is true, replace the form with the stub message: "Thanks — we'll look you up shortly!" No fetch or network call of any kind.

**Checkpoint**: US1 and US2 both independently functional.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [ ] T009 Apply Tailwind responsive layout classes to `src/components/RsvpLookup.tsx` — form fields and buttons MUST be full-width on mobile (320 px), inputs should have adequate padding, errors should be clearly readable
- [ ] T010 Run `npm run build` and confirm zero TypeScript errors and zero lint errors
- [ ] T011 QA: push branch, open Vercel preview, verify all 6 items in the quickstart.md QA checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1; blocks Phases 3 and 4
- **US1 (Phase 3)**: Depends on Phase 2 — T004 and T005 are sequential
- **US2 (Phase 4)**: Depends on Phase 3 (RsvpLookup component must exist)
- **Polish (Phase 5)**: Depends on Phase 4

### Within Each Phase

- T002 and T003 can run in parallel (different files)
- T004 → T005 sequential (App.tsx imports RsvpLookup)
- T006 → T007 → T008 sequential (each builds on the previous within RsvpLookup)

---

## Parallel Opportunities

```bash
# Phase 2 — both files are independent:
T002: Update App.tsx with view state
T003: Update Nav.tsx with RSVP button
```

---

## Implementation Strategy

### MVP (User Story 1 Only)

1. T001: Install react-hook-form
2. T002 + T003: Foundational (parallel)
3. T004 + T005: US1 nav + back
4. **STOP and VALIDATE**: RSVP button opens screen, back returns to landing

### Full Delivery

1. Setup + Foundational → nav button works
2. US1 → screen navigation working
3. US2 → form with validation and stub response
4. Polish → responsive + build clean

---

## Notes

- [P] tasks touch different files — safe to parallelise
- `onRsvpClick` and `onBack` are the only props crossing component boundaries
- `submitted` state lives inside `RsvpLookup` — App.tsx does not need to know
- `npm run build` must pass before marking T010 complete
