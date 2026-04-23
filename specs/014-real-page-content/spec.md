# Feature Specification: Add Real Page Content

**Feature Branch**: `014-real-page-content`  
**Created**: 2026-04-23  
**Status**: Draft  
**Input**: User description: "I want to add some real content to the page now. So this is a generic spec we will build on over a few chats"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Guest Reads Core Wedding Details (Priority: P1)

A guest visits the landing page and immediately sees the couple's names, wedding date, and venue — the fundamental facts they need to know the event is real and to plan around.

**Why this priority**: Without real names, date, and venue, the site is indistinguishable from a template. This is the foundation everything else builds on.

**Independent Test**: Can be fully tested by opening the landing page and confirming the Hero section shows real names, a real date, and a real venue name with no placeholder brackets.

**Acceptance Scenarios**:

1. **Given** a guest opens the landing page, **When** they view the Hero section, **Then** the couple's actual names are displayed with no square-bracket placeholders
2. **Given** a guest opens the landing page, **When** they view the Hero section, **Then** the actual wedding date and venue name are shown

---

### User Story 2 - Guest Understands the Day's Schedule (Priority: P2)

A guest reads the Schedule section and understands what's happening and when — ceremony start, reception, and any key moments they need to know about.

**Why this priority**: Guests need this to plan travel and attendance. It's one of the most-read sections of any wedding website.

**Independent Test**: Can be fully tested by navigating to the Schedule section and confirming it lists real times and event names with no placeholder text.

**Acceptance Scenarios**:

1. **Given** a guest reads the Schedule section, **When** they scan the content, **Then** they can see that guests should arrive no earlier than 2:30pm, the ceremony starts at 3:00pm, and the reception ends at 10:00pm

---

### User Story 3 - Guest Finds Travel and Venue Information (Priority: P3)

A guest reads the Travel section and has everything they need to get to the venue — address, map link, and any transport or parking notes.

**Why this priority**: Practical logistics. Guests who can't find the venue can't attend.

**Independent Test**: Can be fully tested by navigating to the Travel section and verifying a real address and working map link are present with no placeholder text.

**Acceptance Scenarios**:

1. **Given** a guest visits the Travel section, **When** they read it, **Then** a real venue address is shown
2. **Given** a guest visits the Travel section, **When** they tap the map link, **Then** they are taken to a working navigation link for the venue
3. **Given** a guest needs transport info, **When** they read the section, **Then** any relevant parking, shuttle, or public transport notes are present

---

### User Story 4 - Guest Reads Dress Code and Housekeeping Notes (Priority: P4)

A guest reads the Dress Code and Housekeeping sections and knows what to wear and any practical notes (e.g. phone-free ceremony, accessibility, kids policy).

**Why this priority**: Important context but not as time-sensitive as schedule or travel.

**Independent Test**: Can be fully tested by reading the Dress Code section and confirming a real dress code is shown. Housekeeping content is still pending and that section will be hidden until confirmed.

**Acceptance Scenarios**:

1. **Given** a guest reads the Dress Code section, **When** they look for guidance, **Then** a clear dress code description is present (e.g. "Black tie", "Cocktail", "Smart casual")
2. **Given** a guest reads the Housekeeping section, **When** they look for notes, **Then** at least one practical note relevant to guests is present

---

### User Story 5 - Guest Views Registry or Wishing Well Details (Priority: P5)

A guest reads the Registry section and understands how the couple would like to receive gifts, whether via a registry link, a wishing well, or a preference for no gifts.

**Why this priority**: Useful but guests can attend without it. Lowest priority and details may not be finalised early.

**Independent Test**: Can be fully tested by reading the Registry section and confirming it contains real information or an explicit no-gifts statement.

**Acceptance Scenarios**:

1. **Given** a guest reads the Registry section, **When** they look for gift guidance, **Then** the section contains real information (a link, wishing well instructions, or an explicit no-gifts note) with no placeholder text

---

### Edge Cases

- If a section's content is not yet finalised, it should be hidden from the page rather than showing placeholder text
- Long venue addresses or event names must wrap cleanly on narrow mobile screens (≤ 390px)
- External links (map, registry) must point to real, working destinations before publishing

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Hero section MUST display the couple's real names, wedding date, and venue name with no square-bracket placeholders
  - Names: **Becky & Daniel**
  - Date: **Tuesday 12th January 2027**
  - Venue: **Markovina Vineyard Estate**
- **FR-002**: The Schedule section MUST display at least the ceremony start time and reception end time
  - Guest arrival: **no earlier than 2:30pm**
  - Ceremony starts: **3:00pm**
  - Reception ends: **10:00pm**
  - No additional milestones to be shown
- **FR-003**: The Travel section MUST display the venue's real address and a working navigation map link
  - Address: **84 Old Railway Road, Kumeū 0892**
  - Map link: **https://maps.app.goo.gl/ftf9UaBvExe9XRNJ9**
  - Parking: **Available onsite. Cars may be left overnight and collected by 11am the following day.**
  - Taxis/Uber: **Available in the area, but guests are advised to book ahead — they can be difficult to get at short notice in Kumeu.**
- **FR-004**: The Dress Code section MUST display a clear, human-readable dress code description
  - Dress code: **Semi-formal**
  - Examples/guidance: [NEEDS CONTENT — to be provided soon]
- **FR-005**: The Housekeeping section MUST display at least one practical note relevant to attending guests
  - Content: [NEEDS CONTENT — to be provided in a future chat]
- **FR-006**: The Registry section MUST display real gift guidance (registry link, wishing well instructions, or an explicit no-gifts statement)
  - Content: [NEEDS CONTENT — to be confirmed]
- **FR-007**: The song suggestion field in the RSVP form MUST have no placeholder text (empty)
- **FR-008**: No section visible to guests MUST contain text enclosed in square brackets
- **FR-009**: All content MUST render correctly and be legible on a 390px wide mobile viewport


### Key Entities

- **Section**: A named content block on the landing page (Hero, Schedule, Travel, Dress Code, Registry, Housekeeping). Each has a heading and one or more content items.
- **Content Value**: A specific piece of real information (name, date, time, address, URL, description) that replaces a placeholder.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All visible landing page sections show real content — zero square-bracket placeholders remain on the published page
- **SC-002**: A first-time visitor can identify the couple's names, wedding date, and venue within 5 seconds of opening the page
- **SC-003**: All text content is readable and correctly formatted on a 390px wide mobile screen with no horizontal overflow
- **SC-004**: Every external link on the page (map, registry) resolves to a real, working destination

## Assumptions

- Content will be provided incrementally across multiple conversations; sections with confirmed content will be updated first
- Ceremony and reception are both held at Markovina Vineyard Estate — one venue, one address
- Schedule times are wall-clock local times, not countdowns
- Registry details may not be finalised in the first iteration — the Registry section can be hidden or updated separately once confirmed
