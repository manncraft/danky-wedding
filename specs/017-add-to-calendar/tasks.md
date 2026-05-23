# Tasks: Add to Calendar Button

**Input**: Design documents from `/specs/017-add-to-calendar/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Not requested — no test tasks generated.  
**Organization**: Tasks grouped by user story (US1 = Google Calendar, US2 = Apple/Outlook).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm existing project is ready — no new packages or config required.

- [x] T001 Confirm `npm run dev` (from `frontend/`) serves the landing page with the Date & Time section visible

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the `AddToCalendar` component skeleton and wire it into the `DateAndTime` section. Both user stories depend on this foundation.

**⚠️ CRITICAL**: US1 and US2 cannot be implemented until this phase is complete.

- [x] T002 Create `src/components/AddToCalendar.tsx` with hardcoded event constants (`title`, `dtStartUtc`, `dtEndUtc`, `location`), a button labelled "Add to Calendar", and a `useState<boolean>` controlling dropdown visibility
- [x] T003 Add `useRef` + `useEffect` outside-click handler to `src/components/AddToCalendar.tsx` so the dropdown closes when the user clicks anywhere outside it
- [x] T004 Import and render `<AddToCalendar />` at the bottom of the `<section>` in `src/components/sections/DateAndTime.tsx`, below the existing `<p>` tags

**Checkpoint**: Foundation ready — the button appears in the Date & Time section and opens/closes an empty dropdown.

---

## Phase 3: User Story 1 — Google Calendar (Priority: P1) 🎯 MVP

**Goal**: Guest clicks "Add to Calendar" → selects Google Calendar → Google Calendar opens in a new tab with the wedding event pre-filled.

**Independent Test**: Click "Add to Calendar", click "Google Calendar" → new browser tab opens at `calendar.google.com` showing event titled "Becky & Daniel's Wedding" on 12 January 2027, 3:00pm–10:00pm, with the Markovina Vineyard Estate address.

### Implementation for User Story 1

- [x] T005 [US1] Add `buildGoogleCalendarUrl()` pure function inside `src/components/AddToCalendar.tsx` that constructs the Google Calendar URL using `URLSearchParams` with `action=TEMPLATE`, `text`, `dates` (`20270112T020000Z/20270112T090000Z`), and `location` from event constants
- [x] T006 [US1] Add a "Google Calendar" list item to the dropdown in `src/components/AddToCalendar.tsx` that calls `window.open(buildGoogleCalendarUrl(), '_blank', 'noopener,noreferrer')` and sets open state to false on click

**Checkpoint**: User Story 1 fully functional — Google Calendar integration independently verifiable.

---

## Phase 4: User Story 2 — Apple Calendar / Outlook (Priority: P2)

**Goal**: Guest clicks "Add to Calendar" → selects Apple Calendar or Outlook → a `.ics` file downloads containing the wedding event with correct details.

**Independent Test**: Click "Add to Calendar", click "Apple Calendar" → `.ics` file downloads; open it → calendar app shows "Becky & Daniel's Wedding" on 12 January 2027, 3:00pm–10:00pm, location Markovina Vineyard Estate. Repeat for "Outlook" — same file, same result.

### Implementation for User Story 2

- [x] T007 [US2] Add `buildIcsContent()` pure function inside `src/components/AddToCalendar.tsx` that returns a valid RFC 5545 VCALENDAR string using event constants; escape commas in `LOCATION` as `\,`; use `DTSTART:20270112T020000Z` and `DTEND:20270112T090000Z`
- [x] T008 [US2] Add `downloadIcs()` function inside `src/components/AddToCalendar.tsx` that creates a `Blob` with type `text/calendar;charset=utf-8`, triggers download via a temporary `<a download="becky-and-daniels-wedding.ics">` element, then calls `URL.revokeObjectURL()`
- [x] T009 [US2] Add "Apple Calendar" and "Outlook" list items to the dropdown in `src/components/AddToCalendar.tsx`, each calling `downloadIcs()` and setting open state to false on click

**Checkpoint**: User Stories 1 AND 2 both independently functional — all three calendar services work.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Layout verification and code quality.

- [ ] T010 Open the site in browser dev tools at 375px width; confirm the "Add to Calendar" button and dropdown are fully visible with no horizontal overflow and no content overlap (SC-004)
- [x] T011 Run `npm run lint` from the project root and resolve any TypeScript errors in `src/components/AddToCalendar.tsx` and `src/components/sections/DateAndTime.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — **BLOCKS both user stories**
- **Phase 3 (US1)**: Depends on Phase 2 only — no dependency on US2
- **Phase 4 (US2)**: Depends on Phase 2 only — no dependency on US1; can start in parallel with US1
- **Phase 5 (Polish)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Independent after Foundational — no dependency on US2
- **User Story 2 (P2)**: Independent after Foundational — no dependency on US1

### Within Each User Story

- T005 before T006 (need the URL builder before the dropdown wires it up)
- T007 and T008 before T009 (need ICS builder and download function before dropdown wires them up)

### Parallel Opportunities

- T007 and T008 can be implemented in parallel (T007 = pure function, T008 = download function; both in the same file but non-overlapping edits)
- Phase 3 (US1) and Phase 4 (US2) can be worked in parallel if two developers are available

---

## Parallel Example: Phase 4 (US2)

```
# T007 and T008 touch different logical sections of AddToCalendar.tsx:
Task T007: "Add buildIcsContent() function"        → pure data function at top of file
Task T008: "Add downloadIcs() function"            → download utility at top of file
Task T009: "Add Apple Calendar + Outlook options"  → JSX dropdown (depends on T007 + T008)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational — button + dropdown skeleton wired into DateAndTime
3. Complete Phase 3: User Story 1 — Google Calendar
4. **STOP and VALIDATE**: Open Google Calendar tab with correct event details
5. Merge / deploy if Google Calendar alone meets the MVP bar

### Incremental Delivery

1. Setup + Foundational → Button appears on page
2. US1 → Google Calendar works → MVP deliverable
3. US2 → Apple Calendar + Outlook work → Full feature complete
4. Polish → Layout and lint clean

---

## Notes

- All event data is compile-time constants in `AddToCalendar.tsx` — no API calls
- ICS file works for both Apple Calendar and Outlook; no separate file needed
- `window.open(..., 'noopener,noreferrer')` is required for security on external links
- Line endings in the ICS string must be `\r\n` (CRLF) per RFC 5545 — use `\r\n` in the template literal
