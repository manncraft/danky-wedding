# Feature Specification: Guest Song Suggestions

**Feature Branch**: `013-song-suggestions`
**Created**: 2026-04-22
**Status**: Draft
**Input**: User description: "I want to ask each guest for song suggestions they would like to hear at the wedding"

## Clarifications

### Session 2026-04-22

- Q: Should guests who RSVP as "not attending" be shown the song suggestion field? → A: No — only show to guests marked as attending.
- Q: Where should the song suggestion be recorded in Google Sheets? → A: New "Song Suggestion" column on the existing per-person row in the RSVPs sheet.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Submit Song Suggestions During RSVP (Priority: P1)

A guest completing their RSVP is prompted to suggest one song they'd like to hear at the wedding. They type a single free-text value (song and/or artist — whatever they know). Upon submitting the RSVP, their suggestion is saved alongside their attendance response.

**Why this priority**: This is the core ask — capturing a song suggestion from each guest as part of the RSVP flow.

**Independent Test**: Can be fully tested by a guest filling out the RSVP form, entering a song suggestion, submitting, and verifying it is recorded.

**Acceptance Scenarios**:

1. **Given** a guest is on the RSVP form, **When** they type a song suggestion into the single field, **Then** it is included when the RSVP is submitted.
2. **Given** a guest chooses not to suggest a song, **When** they submit their RSVP, **Then** the RSVP is accepted successfully with no song entry.
3. **Given** a guest marks themselves as "not attending", **When** they view the RSVP form, **Then** the song suggestion field is not shown.

---

### User Story 2 - Song Suggestions Visible in Wedding Planner Sheet (Priority: P2)

The couple (or wedding planner) can see all song suggestions submitted by guests in the Google Sheets RSVP data, with each suggestion attributed to the guest who submitted it.

**Why this priority**: Collecting suggestions is only useful if they are accessible to whoever is planning the music. This closes the loop on the feature.

**Independent Test**: Can be tested by submitting an RSVP with a song suggestion and verifying it appears in the Google Sheet attributed to the correct guest.

**Acceptance Scenarios**:

1. **Given** a guest has submitted a song suggestion, **When** the couple opens the RSVPs sheet, **Then** the suggestion text is visible alongside the guest's name.
2. **Given** a guest submitted no song suggestion, **When** the couple views the sheet, **Then** the song column for that guest is blank.

---

### User Story 3 - Additional Party Members Can Also Suggest Songs (Priority: P3)

When a guest RSVPs for multiple members of their party (using the multi-guest RSVP feature), each additional party member can also provide their own song suggestion.

**Why this priority**: Extends the feature to cover the multi-guest RSVP scenario already supported by the application.

**Independent Test**: Can be tested by RSVPing for 2+ guests and verifying each person's suggestion is recorded separately in the sheet.

**Acceptance Scenarios**:

1. **Given** a guest is RSVPing for themselves and a partner, **When** each person enters a song suggestion, **Then** both are saved attributed to their respective names.
2. **Given** an additional party member leaves their song field blank, **When** the primary guest submits, **Then** only the primary guest's suggestion is recorded; the omission is not an error.

---

### Edge Cases

- What happens when a guest submits an unusually long suggestion (e.g., 500+ characters)?
- How does the system handle special characters or non-Latin script in the suggestion field?
- A guest marks themselves attending, enters a song suggestion, then changes their attendance to "not attending" before submitting — the song suggestion should be discarded.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The RSVP form MUST include a single free-text field per guest for a song suggestion (song title, artist, or both — guest's choice), shown only when that guest is marked as attending.
- **FR-002**: The song suggestion field MUST be optional — attending guests can submit the RSVP without filling it in.
- **FR-003**: The song suggestion field MUST enforce a maximum length of 200 characters.
- **FR-004**: The song suggestion MUST be saved and persisted when the RSVP is submitted.
- **FR-005**: The song suggestion MUST be attributed to the specific named guest (primary or additional party member) who entered it.
- **FR-006**: Song suggestion data MUST be written as a new "Song Suggestion" column on the guest's existing per-person row in the Google Sheets RSVPs sheet.
- **FR-007**: When RSVPing for multiple party members, each party member MUST have their own song suggestion field.

### Key Entities

- **Song Suggestion**: A single free-text entry per guest (max 200 characters), associated with a named guest's RSVP record.
- **RSVP Record**: The existing record of a guest's attendance response, extended to include one optional song suggestion per person.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Guests can add a song suggestion within the existing RSVP flow without navigating to a separate page or form.
- **SC-002**: All song suggestions submitted are retrievable in the Google Sheets data within moments of RSVP submission.
- **SC-003**: 100% of submitted song suggestions are correctly attributed to the named guest in the sheet.
- **SC-004**: Guests can complete the RSVP without entering a song suggestion with no error.

## Assumptions

- One suggestion per guest — there is no "add another" functionality.
- The single field accepts any free text; no validation against a music database or structured format.
- Song suggestions are collected once at RSVP time; there is no mechanism to update after submission.
- The existing Google Sheets `RSVPs` tab is used to store song data; a new "Song Suggestion" column is appended to each existing per-person row.
