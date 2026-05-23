# Feature Specification: Partner Content Update

**Feature Branch**: `016-partner-content-update`  
**Created**: 2026-05-23  
**Status**: Draft  
**Input**: User description: "Incorporate partner-provided markdown content (docs/content.md) into the existing wedding landing page."

## Clarifications

### Session 2026-05-23

- Q: Where does the "Details section" fit — is it a new named component, or do the bold headings in `content.md` map to existing/new sections independently? → A: "Details" is not a section name; it just marks where the hero ends and body content begins. The bold headings (**Date & Time**, **Venue**, **Parking & Transportation**, **Dress Code**, **Dietary Restrictions**, **Gifts**, **Timeline**) are the content blocks to incorporate, and their mapping to page sections is an implementation decision.
- Q: Should page sections map 1:1 to the bold headers in `content.md`, creating/deleting components as needed? → A: Yes — each bold header becomes its own section component. Old components that don't align (**Travel**, **Schedule**, **Registry**, **Housekeeping**) must be replaced or deleted.
- Q: Should the hero render date and venue as a single combined line (`12 January 2027 | Markovina Vineyard Estate`) or as two separate lines? → A: Single combined line with pipe separator, matching the partner's content exactly.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Guest Reads Full Event Details (Priority: P1)

A guest visits the wedding website and wants to know everything they need to prepare for the day: when to arrive, what to wear, how to get there, and how the day will run.

**Why this priority**: This is the primary purpose of the wedding information page — guests need accurate, complete information before the event. Incomplete or placeholder text erodes trust and may cause confusion on the day.

**Independent Test**: Can be fully tested by loading the landing page and verifying all sections display the correct text from `docs/content.md` with no placeholder brackets remaining (except for known deferred items like the RSVP deadline date).

**Acceptance Scenarios**:

1. **Given** a guest opens the landing page, **When** they scroll below the hero, **Then** they see seven sections in order: Date & Time, Venue, Parking & Transportation, Dress Code, Dietary Restrictions, Gifts, Timeline.
2. **Given** a guest reads the Timeline section, **When** they review the day, **Then** they see all six entries: 2:30pm Guests arrive, 3:00pm Ceremony begins, 3:30pm Canapes & cocktails, 5:45pm Dinner, 9:30pm Bar closes, 10:00pm Reception ends.
3. **Given** a guest reads the Dress Code section, **When** they want outfit inspiration, **Then** they see the semi-formal description, summer garden context, comfortable footwear note, and the two lists of clothing and shoe examples.
4. **Given** a guest reads the Gifts section, **When** they want to know about gifts, **Then** they see the wishing well message exactly as written by the partner.

---

### User Story 2 - Guest Uses the Google Maps Link (Priority: P2)

A guest on mobile wants to navigate to the venue directly from the page.

**Why this priority**: The venue is in a semi-rural area (Kumeū); easy navigation reduces the chance of guests getting lost.

**Independent Test**: Can be tested by clicking the Google Maps link and confirming it opens the correct venue location.

**Acceptance Scenarios**:

1. **Given** a guest is on the Venue section, **When** they tap "Open in Google Maps", **Then** they are taken to the correct venue location (link already exists and must be preserved).

---

### User Story 3 - Guest Sees Names, Date and Venue in Hero (Priority: P3)

A guest glances at the hero section and immediately sees whose wedding it is, the date, and where it is being held.

**Why this priority**: The hero is the first impression — it should confirm the guest is in the right place with the core three facts: couple, date, venue. Nothing more.

**Independent Test**: Can be tested by checking the hero section displays "Becky & Daniel" and "12 January 2027 | Markovina Vineyard Estate" — with no additional details.

**Acceptance Scenarios**:

1. **Given** a guest loads the page, **When** they view the hero, **Then** they see "Becky & Daniel" and "12 January 2027 | Markovina Vineyard Estate" — and nothing else.
2. **Given** a guest views the hero, **When** they look for ceremony time or arrival guidance, **Then** those details are NOT in the hero (they appear in the page body below).

---

### Edge Cases

- The RSVP deadline placeholder (`XXXX`) in the partner's content is intentionally deferred — the page must not display the raw placeholder; omit the RSVP deadline sentence entirely until the date is known.
- The "Add to Calendar" button referenced in the partner's content is a deferred feature — omit it from this update rather than show a broken placeholder.
- On very narrow viewports the two-column dress code layout may stack to a single column to remain readable, but on any typical mobile screen (375px+) the two columns must appear side by side.
- The existing `Registry.tsx`, `Housekeeping.tsx`, `Travel.tsx`, and `Schedule.tsx` components do not align with the bold headers in `content.md` and must be deleted.
- The existing `DressCode.tsx` component keeps its name as it aligns directly with the **Dress Code:** header.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Hero section MUST display the couple's names ("Becky & Daniel") and below it a single combined subtitle line "12 January 2027 | Markovina Vineyard Estate" — matching the partner's content exactly. No other content belongs in the hero.
- **FR-001b**: A **Date & Time** section MUST display the ceremony start time ("Ceremony begins at 3pm") and arrival guidance ("Please arrive no earlier than 2:30pm").
- **FR-002**: A **Venue** section MUST display the venue name ("Markovina Vineyard Estate"), street address ("84 Old Railway Road, Kumeū 0892"), and a working "Open in Google Maps" link.
- **FR-003**: A **Parking & Transportation** section MUST display the parking note (cars may be left overnight, collected by 11am) and the taxi/rideshare warning (book before ready to leave; difficult to get at short notice in Kumeū).
- **FR-004**: A **Dress Code** section MUST display the semi-formal label, the summer garden / comfortable footwear context sentence, a "for example" label, and below it the clothing examples and footwear examples rendered as two columns side by side.
- **FR-005**: A **Dietary Restrictions** section MUST display: "Please let us know of any dietary restrictions when you RSVP."
- **FR-006**: A **Gifts** section MUST display the partner's exact wishing well message: "Your company on our special day is all we need. However, should you wish to contribute to our honeymoon, we will have a wishing well at the venue."
- **FR-007**: A **Timeline** section MUST display all six entries in chronological order: 2:30pm Guests arrive, 3:00pm Ceremony begins, 3:30pm Canapes & cocktails, 5:45pm Dinner, 9:30pm Bar closes, 10:00pm Reception ends.
- **FR-008**: The existing `Travel.tsx`, `Schedule.tsx`, `Registry.tsx`, and `Housekeeping.tsx` components MUST be deleted and replaced by the above sections.
- **FR-009**: No raw bracket placeholders or `XXXX` values MUST appear on the rendered page.
- **FR-010**: The "Add to Calendar" action MUST NOT be implemented in this iteration — omit it entirely.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The page body contains exactly seven sections in this order: Date & Time, Venue, Parking & Transportation, Dress Code, Dietary Restrictions, Gifts, Timeline.
- **SC-002**: All six timeline entries appear in the Timeline section in chronological order.
- **SC-003**: The Dress Code section shows clothing examples and footwear examples in two columns side by side, each with at least three items visible.
- **SC-004**: Zero raw bracket placeholders appear anywhere in the rendered page.
- **SC-005**: The wishing well message in the Gifts section matches the partner's exact wording.
- **SC-006**: The Hero section displays "Becky & Daniel" as the heading and "12 January 2027 | Markovina Vineyard Estate" as a single subtitle line — and nothing else.

## Assumptions

- The "Add to Calendar" and RSVP deadline features are separate concerns and will not be addressed in this iteration.
- The existing Google Maps URL (currently in `Travel.tsx`) is already correct — it will be moved to the new `Venue.tsx` component unchanged.
- The two-column dress code layout is a firm requirement: clothing examples and footwear examples must appear side by side in two columns below the "for example" text.
- No new dependencies are required — this is a content-only update to existing React components.
