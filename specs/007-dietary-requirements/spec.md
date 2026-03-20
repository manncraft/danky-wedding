# Feature Specification: Add Dietary Requirements Field

**Feature Branch**: `007-dietary-requirements`
**Created**: 2026-03-20
**Status**: Draft
**Input**: User description: "add a dietary requirements input to the rsvp form. very simple free-text field, no need for a lookup or a radio or anything"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Attending Guest Enters Dietary Requirements (Priority: P1)

A guest who has indicated they are attending can optionally type any dietary requirements or restrictions in a free-text field that appears below the attendance confirmation. They might enter things like "vegetarian", "nut allergy", or "no pork please". The field is optional — guests without requirements leave it blank.

**Why this priority**: Collecting dietary information is the entire purpose of this feature, and it only makes sense for guests who are attending.

**Independent Test**: Can be fully tested by selecting "attending" on the RSVP form, entering text in the dietary field, submitting, and verifying the value is captured and submitted alongside the rest of the RSVP data.

**Acceptance Scenarios**:

1. **Given** a guest has indicated they are attending, **When** the form updates, **Then** the dietary requirements field is visible
2. **Given** a guest has indicated they are attending, **When** they type their dietary requirements, **Then** the text is accepted and submitted with the RSVP
3. **Given** a guest has indicated they are attending, **When** they leave the dietary field blank, **Then** the form submits successfully without requiring that field
4. **Given** a guest has indicated they are NOT attending, **When** the form updates, **Then** the dietary requirements field is not visible
5. **Given** a guest has submitted their RSVP with dietary info, **When** the submission is received, **Then** the dietary requirements text is included in the submitted data

---

### Edge Cases

- When a guest switches from attending to not attending after having typed dietary requirements, the field disappears and its text is cleared immediately; if they switch back to attending the field reappears empty
- What happens when a guest enters a very long string (e.g., several sentences of detail)?
- What happens when a guest enters only whitespace in the dietary field?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The RSVP form MUST display the dietary requirements field only when the guest has indicated they are attending
- **FR-002**: The dietary requirements field MUST be hidden (and its value excluded from submission) when the guest indicates they are not attending
- **FR-003**: The dietary requirements field MUST be optional — the form MUST submit successfully when left blank by an attending guest
- **FR-004**: The dietary requirements field MUST accept any free-text content the guest provides
- **FR-005**: The dietary requirements value MUST be included in the RSVP submission payload when the guest is attending
- **FR-006**: The field label MUST clearly communicate its purpose to guests (e.g., "Dietary requirements or restrictions")
- **FR-007**: If a guest switches from attending to not attending, any previously entered dietary text MUST be cleared immediately and MUST NOT be submitted

### Key Entities

- **RSVP Submission**: Existing entity extended with an optional `dietaryRequirements` string field (free-form text, present only when guest is attending, may be empty)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The dietary requirements field is visible if and only if the guest has indicated they are attending
- **SC-002**: Guests can enter dietary requirements without leaving the RSVP form or performing any additional steps
- **SC-003**: The RSVP form submits successfully with or without dietary information entered by an attending guest
- **SC-004**: Dietary requirements text entered by the guest appears verbatim in the submitted RSVP data

## Clarifications

### Session 2026-03-20

- Q: When a guest switches from attending to not attending after typing dietary requirements, what should happen to the text? → A: Clear the field — typed text is erased when attendance is toggled off

## Assumptions

- The attendance indicator already exists on the RSVP form; this feature adds conditional display logic to it
- Additional fields to be shown only for attending guests (mentioned as future work) will follow the same conditional display pattern established here
- There is no maximum length enforced beyond what a normal text input accepts by default
- Whitespace-only entries are treated as empty (no dietary requirements)
- No changes to the confirmation screen are required to display the dietary info back to the guest
- The backend will pass through the new field without additional processing in this iteration
