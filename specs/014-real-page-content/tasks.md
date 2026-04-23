# Tasks: Add Real Page Content

**Input**: Design documents from `/specs/014-real-page-content/`  
**Prerequisites**: plan.md ✅, spec.md ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4)

---

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: Clean up hidden sections from the page and nav before updating content. Avoids broken nav links pointing to unmounted sections during implementation.

**⚠️ CRITICAL**: Must complete before any user story work begins.

- [ ] T001 Remove `<Housekeeping />` and `<Registry />` renders (and unused imports) from `src/App.tsx`
- [ ] T002 Remove `Housekeeping` and `Registry` `<li>` nav links from `src/components/Nav.tsx`

**Checkpoint**: Nav only shows links for sections with confirmed content (Schedule, Travel, Dress Code). Hidden sections show no placeholder text.

---

## Phase 2: User Story 1 — Guest Reads Core Wedding Details (Priority: P1) 🎯 MVP

**Goal**: Hero section shows real couple names, wedding date, and venue name.

**Independent Test**: Open the landing page — confirm "Becky & Daniel", "Tuesday 12th January 2027", and "Markovina Vineyard Estate" are displayed with no square brackets.

- [ ] T003 [US1] Replace all placeholder content in `src/components/sections/Hero.tsx` with: names "Becky & Daniel", date "Tuesday 12th January 2027", venue "Markovina Vineyard Estate"

**Checkpoint**: Hero section fully displays real content. No other section needs to be updated for this story to be independently valid.

---

## Phase 3: User Story 2 — Guest Understands the Day's Schedule (Priority: P2)

**Goal**: Schedule section shows arrival guidance and key times with no placeholder text.

**Independent Test**: Navigate to `#schedule` — confirm arrival (no earlier than 2:30pm), ceremony start (3:00pm), and reception end (10:00pm) are shown.

- [ ] T004 [P] [US2] Replace placeholder content in `src/components/sections/Schedule.tsx` with: arrival no earlier than 2:30pm, ceremony at 3:00pm, reception ends at 10:00pm

**Checkpoint**: Schedule section fully displays real times. No additional milestones needed.

---

## Phase 4: User Story 3 — Guest Finds Travel and Venue Information (Priority: P3)

**Goal**: Travel section shows address, a working map link, and parking/taxi notes.

**Independent Test**: Navigate to `#travel` — confirm address, a working Google Maps link, parking note, and taxi note are all present.

- [ ] T005 [P] [US3] Replace placeholder content in `src/components/sections/Travel.tsx` with:
  - Address: "84 Old Railway Road, Kumeū 0892"
  - Map link: `https://maps.app.goo.gl/ftf9UaBvExe9XRNJ9` labelled "Open in Google Maps"
  - Parking: "Available onsite. Cars may be left overnight and collected by 11am the following day."
  - Taxi/Uber: "Available in the area. We recommend booking ahead — they can be difficult to get at short notice in Kumeu."

**Checkpoint**: Travel section fully displays real content with a working map link.

---

## Phase 5: User Story 4 — Guest Reads Dress Code (Priority: P4)

**Goal**: Dress Code section shows "Semi-formal" with no placeholder text. (Housekeeping is hidden; Registry is hidden — both deferred to a future chat.)

**Independent Test**: Navigate to `#dress-code` — confirm "Semi-formal" is displayed. Confirm Housekeeping and Registry sections are not visible anywhere on the page.

- [ ] T006 [P] [US4] Replace placeholder content in `src/components/sections/DressCode.tsx` with dress code: "Semi-formal"

**Checkpoint**: Dress Code shows real content. No bracket placeholders remain on any visible section of the page.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Remaining FR not tied to a landing page section.

- [ ] T007 Remove the `placeholder` attribute value from the song suggestion input in `src/components/RsvpLookup.tsx` line 337 (FR-007 — leave as empty string or remove attribute entirely)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: No dependencies — start immediately
- **User Story phases (Phase 2–5)**: All depend on Phase 1 completion; can then run **in parallel** (T003–T006 are all different files)
- **Polish (Phase 6)**: Independent of all phases — can run at any time

### User Story Dependencies

- **US1 (P1)**: Independent after Phase 1
- **US2 (P2)**: Independent after Phase 1
- **US3 (P3)**: Independent after Phase 1
- **US4 (P4)**: Independent after Phase 1
- **US5 (P5 — Registry)**: Deferred; no tasks this iteration

### Parallel Opportunities

After Phase 1 completes, T003, T004, T005, T006 can all be executed in parallel — they each touch a different file with no shared dependencies.

---

## Parallel Example: After Phase 1

```
# All four section updates can run simultaneously:
Task T003: Update src/components/sections/Hero.tsx
Task T004: Update src/components/sections/Schedule.tsx
Task T005: Update src/components/sections/Travel.tsx
Task T006: Update src/components/sections/DressCode.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Foundational — ~2 tasks)
2. Complete T003 (Hero section)
3. **STOP and VALIDATE**: Open page, confirm Hero shows real content
4. Proceed to remaining sections

### Incremental Delivery

1. Phase 1 → Nav and App cleaned up
2. T003 (Hero) → most visible section live ✅
3. T004 (Schedule) → guests can plan timing ✅
4. T005 (Travel) → guests can navigate to venue ✅
5. T006 (Dress Code) → guests know what to wear ✅
6. T007 (Song field) → RSVP form polished ✅

---

## Deferred (future chats)

- **Housekeeping section**: Re-add `<Housekeeping />` to `src/App.tsx` and nav link to `src/components/Nav.tsx` once content confirmed
- **Registry section**: Re-add `<Registry />` to `src/App.tsx` and nav link to `src/components/Nav.tsx` once content confirmed
- **Dress Code examples**: Add guidance text to `src/components/sections/DressCode.tsx` once examples confirmed

---

## Notes

- [P] tasks = different files, no dependencies between them
- [Story] label maps each task to its user story for traceability
- Total tasks: **7** (T001–T007)
- No test tasks — not requested in spec
- Commit after T001+T002, then after each section update
