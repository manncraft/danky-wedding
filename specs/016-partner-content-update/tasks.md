# Tasks: Partner Content Update

**Input**: Design documents from `/specs/016-partner-content-update/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, quickstart.md ✅

**Tests**: Not requested — content-only feature.

**Organization**: Tasks grouped by user story. All new section components (US1) can be created in parallel. Hero update (US3) is independent.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to

---

## Phase 1: Setup

**Purpose**: No external setup needed — no new dependencies or config changes required.

- [x] T001 Confirm `src/components/sections/` directory exists and note the 4 files to delete: `Travel.tsx`, `Schedule.tsx`, `Registry.tsx`, `Housekeeping.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Remove misaligned components and clean App.tsx before any new components are added. App.tsx must compile cleanly after this phase.

**⚠️ CRITICAL**: Must complete before any user story work begins.

- [x] T002 Delete `src/components/sections/Travel.tsx`
- [x] T003 [P] Delete `src/components/sections/Schedule.tsx`
- [x] T004 [P] Delete `src/components/sections/Registry.tsx`
- [x] T005 [P] Delete `src/components/sections/Housekeeping.tsx`
- [x] T006 Remove all imports and JSX usage of `Travel`, `Schedule`, `Registry`, and `Housekeeping` from `src/App.tsx`, leaving the `<main>` block with only `<Hero />` so the app still compiles and renders

**Checkpoint**: `npm run dev` must load without errors; only the hero section renders in the page body

---

## Phase 3: User Story 1 - Guest Reads Full Event Details (Priority: P1) 🎯 MVP

**Goal**: All seven content sections appear on the page in the correct order with copy matching `docs/content.md`.

**Independent Test**: Load the page, scroll through all sections, confirm each bold header from `content.md` has a corresponding section with correct text and no bracket placeholders.

### Implementation for User Story 1

- [x] T007 [P] [US1] Create `src/components/sections/DateAndTime.tsx` — render an `<h2>` "Date & Time" heading, then "Tuesday 12th January 2027", "Ceremony begins at 3pm.", and "Please arrive no earlier than 2:30pm." (no RSVP sentence, no Add to Calendar)
- [x] T008 [P] [US1] Create `src/components/sections/Venue.tsx` — render an `<h2>` "Venue" heading, then "Markovina Vineyard Estate", "84 Old Railway Road, Kumeū 0892", and an "Open in Google Maps" anchor using the existing URL from the deleted `Travel.tsx`: `https://maps.app.goo.gl/ftf9UaBvExe9XRNJ9` (target blank, rel noopener noreferrer)
- [x] T009 [P] [US1] Create `src/components/sections/ParkingTransportation.tsx` — render an `<h2>` "Parking & Transportation" heading, then the two paragraphs from `content.md`: the overnight parking note and the taxi/rideshare booking warning (use partner's exact wording)
- [x] T010 [P] [US1] Update `src/components/sections/DressCode.tsx` — replace current minimal content with: `<h2>` "Dress Code" heading; "Semi-formal." paragraph; the summer garden / comfortable footwear context sentence; an "Examples:" label; then below it two side-by-side columns using a CSS grid (e.g. `grid grid-cols-2`) — left column lists clothing items (Button-up shirt and dress pants, Colourful midi or maxi dress, Dressy separates), right column lists footwear items (Dress shoes, loafers, Sandals, dressy flats, Wedges or block heels); columns must be side by side at 375px viewport width and above
- [x] T011 [P] [US1] Create `src/components/sections/DietaryRestrictions.tsx` — render an `<h2>` "Dietary Restrictions" heading and a single paragraph: "Please let us know of any dietary restrictions when you RSVP."
- [x] T012 [P] [US1] Create `src/components/sections/Gifts.tsx` — render an `<h2>` "Gifts" heading and the exact wishing well paragraph from `content.md`: "Your company on our special day is all we need. However, should you wish to contribute to our honeymoon, we will have a wishing well at the venue."
- [x] T013 [P] [US1] Create `src/components/sections/Timeline.tsx` — render an `<h2>` "Timeline" heading and a list of all six entries: 2:30pm Guests arrive, 3:00pm Ceremony begins, 3:30pm Canapes & cocktails, 5:45pm Dinner, 9:30pm Bar closes, 10:00pm Reception ends
- [x] T014 [US1] Import and render all seven new/updated section components in `src/App.tsx` in this exact order inside the landing `<main>` block: `<DateAndTime />`, `<Venue />`, `<ParkingTransportation />`, `<DressCode />`, `<DietaryRestrictions />`, `<Gifts />`, `<Timeline />` (depends on T007–T013)

**Checkpoint**: Page shows all seven sections in order with correct copy; no bracket placeholders visible; dress code examples are in two side-by-side columns at mobile width

---

## Phase 4: User Story 2 - Guest Uses the Google Maps Link (Priority: P2)

**Goal**: The Google Maps link in the Venue section opens the correct venue location.

**Independent Test**: Click "Open in Google Maps" in the Venue section and confirm it navigates to Markovina Vineyard Estate.

**Note**: The Maps link is implemented as part of T008. This phase is a focused verification step.

### Implementation for User Story 2

- [x] T015 [US2] Verify `src/components/sections/Venue.tsx` — confirm the anchor href is exactly `https://maps.app.goo.gl/ftf9UaBvExe9XRNJ9`, has `target="_blank"` and `rel="noopener noreferrer"`, and the link text reads "Open in Google Maps" (depends on T008)

**Checkpoint**: Clicking the Maps link from a mobile browser opens the correct venue pin

---

## Phase 5: User Story 3 - Guest Sees Names, Date and Venue in Hero (Priority: P3)

**Goal**: The hero displays exactly "Becky & Daniel" and "12 January 2027 | Markovina Vineyard Estate" — nothing else.

**Independent Test**: Load the page and confirm the hero contains only those two elements with no additional text.

### Implementation for User Story 3

- [x] T016 [US3] Update `src/components/sections/Hero.tsx` — replace current content with: `<h1>` "Becky & Daniel"; a single subtitle `<p>` reading "12 January 2027 | Markovina Vineyard Estate"; no other child elements

**Checkpoint**: Hero shows exactly two text elements; no date on separate line; no standalone venue line

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T017 [P] Run `npm run lint` and fix any lint errors across all created/modified files
- [x] T018 [P] Run `npm test` and confirm no regressions
- [x] T019 Visually verify the full page at 375px viewport width: all seven sections render correctly, two-column dress code layout is side by side, no raw bracket placeholders anywhere, sections appear in the order: DateAndTime → Venue → ParkingTransportation → DressCode → DietaryRestrictions → Gifts → Timeline
- [x] T020 Confirm deleted files (`Travel.tsx`, `Schedule.tsx`, `Registry.tsx`, `Housekeeping.tsx`) no longer exist in `src/components/sections/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS all story work
- **Phase 3 (US1)**: Depends on Phase 2; T007–T013 are all parallel; T014 depends on T007–T013
- **Phase 4 (US2)**: Depends on T008 (Venue.tsx) being complete
- **Phase 5 (US3)**: Independent of Phases 3–4; depends only on Phase 2
- **Phase 6 (Polish)**: Depends on Phases 3–5 complete

### User Story Dependencies

- **US1 (P1)**: Unblocked after Phase 2 — no dependency on US2 or US3
- **US2 (P2)**: Unblocked after T008 — contained entirely within Venue.tsx
- **US3 (P3)**: Unblocked after Phase 2 — independent of US1 and US2

### Parallel Opportunities

- T002–T005 (deletions): all parallel
- T007–T013 (new/updated section components): all parallel — each is a different file
- T016 (Hero): parallel with T007–T013 — different file
- T017–T018 (lint + test): parallel with each other after all implementation complete

---

## Parallel Example: User Story 1

```
# All section component tasks can run simultaneously:
T007 — Create DateAndTime.tsx
T008 — Create Venue.tsx
T009 — Create ParkingTransportation.tsx
T010 — Update DressCode.tsx
T011 — Create DietaryRestrictions.tsx
T012 — Create Gifts.tsx
T013 — Create Timeline.tsx

# Then once all above complete:
T014 — Wire all into App.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational — delete old files, clean App.tsx (T002–T006)
3. Complete Phase 3: Create all 7 sections, wire App.tsx (T007–T014)
4. **STOP and VALIDATE**: Page shows all sections with correct content
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → app compiles with hero only
2. US1 → all seven sections with correct content (MVP)
3. US2 → Maps link verified
4. US3 → Hero updated to final format
5. Polish → lint, tests, mobile check

---

## Notes

- All copy must be taken verbatim from `docs/content.md`
- The Google Maps URL is preserved from the deleted `Travel.tsx`: `https://maps.app.goo.gl/ftf9UaBvExe9XRNJ9`
- Dress code two-column layout must work at 375px — use `grid-cols-2` or equivalent
- Do not add RSVP deadline sentence or Add to Calendar to `DateAndTime.tsx` — both are deferred
