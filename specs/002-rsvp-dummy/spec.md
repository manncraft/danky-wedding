# Feature Specification: RSVP Lookup Screen

**Feature Branch**: `002-rsvp-dummy`
**Created**: 2026-03-20
**Status**: Draft
**Input**: User description: "RSVP nav button opens a lookup screen — name input and Find Invite button, no backend"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Navigate to RSVP Lookup from Nav (Priority: P1)

A guest on the landing page taps the "RSVP" button in the sticky nav and is
taken to a lookup screen that asks for their name.

**Why this priority**: The nav button is the only entry point. Nothing else works
without it.

**Independent Test**: Tap RSVP in the nav; confirm the lookup screen appears and
the landing page sections are no longer visible.

**Acceptance Scenarios**:

1. **Given** a guest is on the landing page, **When** they tap "RSVP" in the nav,
   **Then** the RSVP lookup screen is displayed.
2. **Given** the lookup screen is open, **When** the guest taps back/close,
   **Then** they are returned to the landing page.

---

### User Story 2 — Enter Name and Find Invite (Priority: P2)

A guest on the lookup screen enters their first and last name and taps
"Find Invite". At this stage no backend call is made — the button simply
acknowledges the input.

**Why this priority**: This is the core interaction of the screen. Validates the
form shape before backend integration.

**Independent Test**: Enter a name and tap Find Invite; confirm the button
responds. Submit with empty name; confirm an inline error appears.

**Acceptance Scenarios**:

1. **Given** the lookup screen is shown, **When** the guest views it, **Then**
   they see a first name field, a last name field, and a "Find Invite" button.
2. **Given** both name fields are filled, **When** the guest taps "Find Invite",
   **Then** a placeholder response is shown (e.g., a "Searching..." or stub
   message) with no network request made.
3. **Given** either name field is empty, **When** the guest taps "Find Invite",
   **Then** an inline validation error is shown on the empty field(s).

---

### Edge Cases

- The lookup screen MUST render correctly at 320 px width with no horizontal
  overflow.
- Tapping "Find Invite" MUST NOT trigger any network requests at this stage.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The sticky nav MUST include an "RSVP" button that navigates to the
  RSVP lookup screen.
- **FR-002**: The RSVP lookup screen MUST be a distinct view — landing page
  sections are hidden while the lookup screen is shown (no full page reload).
- **FR-003**: The lookup screen MUST include a back/close control that returns
  the guest to the landing page.
- **FR-004**: The lookup screen MUST include a first name field, a last name
  field, and a "Find Invite" button.
- **FR-005**: Both name fields MUST be required — tapping "Find Invite" with
  either field empty MUST show an inline validation error on the empty field(s).
- **FR-006**: Tapping "Find Invite" with valid input MUST show a placeholder
  stub response. No data is sent to any backend.
- **FR-007**: The lookup screen MUST be mobile-responsive (no horizontal overflow
  at 320 px).

### Assumptions

- This is a UI skeleton only. The real lookup (searching the Invites sheet) is
  a future feature.
- Routing between landing page and lookup screen is handled via simple React
  state (show/hide), not a routing library.
- The stub response on a valid submission can be as simple as a "We're looking
  for your invite..." message — no loading spinner required at this stage.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The RSVP lookup screen is reachable from the nav in one tap from
  any scroll position on the landing page.
- **SC-002**: A guest can reach the stub response from a cold page load in under
  30 seconds with no instructions.
- **SC-003**: Tapping "Find Invite" triggers zero network requests (verifiable in
  browser DevTools network tab).
- **SC-004**: The lookup screen renders correctly at 320 px width with no
  horizontal overflow.
- **SC-005**: Inline validation errors appear on empty fields without a page
  reload and are visible without scrolling.
