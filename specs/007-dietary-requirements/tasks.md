# Tasks: Add Dietary Requirements Field

**Input**: Design documents from `/specs/007-dietary-requirements/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Organization**: Single user story — tasks proceed types → backend → frontend → polish.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US1]**: User Story 1 — Attending Guest Enters Dietary Requirements

---

## Phase 1: Foundational (Blocking Prerequisite)

**Purpose**: Update the shared type definition that all other tasks depend on.

**⚠️ CRITICAL**: All Phase 2 tasks depend on this.

- [ ] T001 Add `dietary?: string` to `RsvpSubmitRequest` interface in `src/types/rsvp.ts`

**Checkpoint**: Type definition in place — backend and frontend tasks can now proceed in parallel.

---

## Phase 2: User Story 1 — Attending Guest Enters Dietary Requirements (Priority: P1) 🎯 MVP

**Goal**: Guest sees a free-text dietary field when attending; field is hidden and cleared when not attending; value is included in the submission payload.

**Independent Test**: Select "Attending", type a dietary requirement, submit — verify field appears, value clears on toggle to "Not Attending", and payload includes `dietary` on submission.

### Implementation

- [ ] T002 [P] [US1] Validate optional `dietary` field (type check + server-side trim) in `api/rsvp-submit.ts`
- [ ] T003 [P] [US1] Add `dietary?: string` parameter to `submitRsvp()` and include it in the request body (attending-only) in `src/services/rsvpApi.ts`
- [ ] T004 [US1] Register `dietary` field, add `ATTENDING_GATED_FIELDS` constant + `useEffect` to clear on toggle, and render `<input>` conditionally when `attendingValue === 'true'` in `src/components/RsvpLookup.tsx` (depends on T001, T003)
- [ ] T005 [US1] Pass `dietary` value from form data to `submitRsvp()` call in `src/components/RsvpLookup.tsx` (depends on T004)

**Checkpoint**: Full end-to-end flow works — dietary field appears for attending guests, clears on toggle, and value reaches the API.

---

## Phase 3: Polish & Cross-Cutting Concerns

- [ ] T006 Run `npm run lint` and fix any type errors introduced by the new field
- [ ] T007 Manually verify all scenarios in `quickstart.md` (attend → type → toggle → submit)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: No dependencies — start immediately
- **User Story 1 (Phase 2)**: T002 and T003 can start as soon as T001 is done (parallel); T004 depends on T001 + T003; T005 depends on T004
- **Polish (Phase 3)**: Depends on all Phase 2 tasks complete

### Task Dependency Graph

```
T001 (types)
  ├── T002 [P] (api validation)
  ├── T003 [P] (service layer)
  │     └── T004 (frontend component)
  │           └── T005 (wire submit call)
  └── [T004 also depends here]
              └── T006, T007 (polish)
```

### Parallel Opportunities

```bash
# After T001 completes, launch in parallel:
Task T002: Validate dietary in api/rsvp-submit.ts
Task T003: Add dietary param to submitRsvp() in src/services/rsvpApi.ts
```

---

## Implementation Strategy

### MVP (this feature is a single story — complete all phases)

1. Complete T001 (types) — unblocks everything
2. Complete T002 + T003 in parallel — backend and service layer
3. Complete T004 → T005 — frontend wiring
4. Complete T006 + T007 — lint and manual verification

**Total tasks**: 7 across 3 phases
**Parallel opportunities**: T002 ∥ T003 after T001

---

## Notes

- No new files are created — all tasks modify existing files
- No test tasks generated (none requested in spec)
- `ATTENDING_GATED_FIELDS` constant in T004 is the extension point for future attending-gated fields
- Commit after T001 and again after T005 to keep changes reviewable
