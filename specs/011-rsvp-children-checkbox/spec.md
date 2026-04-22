# Feature Specification: RSVP Children Checkbox

**Feature Branch**: `011-rsvp-children-checkbox`
**Created**: 2026-03-26
**Status**: Draft
**Input**: User description: "as part of the RSVP form I want to ask guests if any of their additional guests are children. This should be a checkbox at the end of the form, and should only show up if there is one or more additional guest/plus one has been added. When the checkbox is ticked/true, show a housekeeping message detailing hazards on site (pond, vendor tables with fragile equipment and extension cords, etc.) and telling guests that children must be supervised at all times. This checkbox value should be saved to the google sheet as bringing children"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Guest RSVPs with children among their party (Priority: P1)

A guest who is bringing one or more additional guests (plus-ones) completes the RSVP form. Near the end of the form, after adding their additional guests, they see a checkbox asking whether any of their additional guests are children. They tick the checkbox, and a safety notice appears informing them of site hazards (a pond, vendor tables with fragile equipment and extension cords) and requiring that children be supervised at all times. The guest acknowledges this by leaving the box ticked and submits their RSVP. The form records that they are bringing children.

**Why this priority**: This is the core feature — collecting the children information and surfacing the safety message ensures guests are informed and the couple has accurate attendance data.

**Independent Test**: Can be fully tested by adding an additional guest on the RSVP form, ticking the "bringing children" checkbox, and verifying the safety message appears and the submission records the value correctly.

**Acceptance Scenarios**:

1. **Given** a guest has added at least one additional guest to their RSVP, **When** they view the end of the form, **Then** a "bringing children" checkbox is visible.
2. **Given** the "bringing children" checkbox is visible, **When** the guest ticks it, **Then** a safety/housekeeping message appears describing site hazards (pond, vendor tables with fragile equipment and extension cords) and instructing that children must be supervised at all times.
3. **Given** the guest submits with the "bringing children" checkbox ticked, **When** the RSVP is recorded, **Then** the Google Sheet row for that primary guest includes "bringing children: true" (or equivalent affirmative value).
4. **Given** the guest submits with the "bringing children" checkbox unticked, **When** the RSVP is recorded, **Then** the Google Sheet row records "bringing children: false" (or equivalent negative value).

---

### User Story 2 - Guest RSVPs without any additional guests (Priority: P2)

A guest fills out the RSVP form but does not add any additional guests (no plus-ones). In this case the "bringing children" checkbox does not appear at all, keeping the form clean and relevant.

**Why this priority**: The checkbox must be hidden when there are no additional guests — showing it would be confusing and irrelevant.

**Independent Test**: Can be tested by completing an RSVP with only the primary guest and verifying the "bringing children" checkbox is absent from the form.

**Acceptance Scenarios**:

1. **Given** a guest has not added any additional guests, **When** they view the RSVP form, **Then** the "bringing children" checkbox is not displayed.
2. **Given** a guest previously had additional guests and then removed all of them, **When** all additional guests are removed, **Then** the "bringing children" checkbox disappears from the form.

---

### User Story 3 - Guest adds additional guests after initially having none (Priority: P3)

A guest starts the RSVP form without adding extra guests, then later adds one or more. As soon as the first additional guest is added, the "bringing children" checkbox becomes visible.

**Why this priority**: The conditional visibility must respond dynamically as guests modify their party size during form completion.

**Independent Test**: Can be tested by adding a plus-one mid-flow and verifying the checkbox appears without requiring a page reload.

**Acceptance Scenarios**:

1. **Given** a guest starts with no additional guests, **When** they add their first additional guest, **Then** the "bringing children" checkbox becomes visible immediately.
2. **Given** a guest has the checkbox visible with one additional guest, **When** they tick the checkbox then remove all additional guests, **Then** the checkbox disappears and the ticked state is reset.

---

### Edge Cases

- What happens if a guest removes all additional guests after having ticked the "bringing children" checkbox? The checkbox should disappear and the value should reset to unchecked (not submitted as true).
- What happens if the "bringing children" checkbox value is absent from an older submission payload? The sheet should record a blank or false value without erroring.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The "bringing children" checkbox MUST only be displayed when one or more additional guests have been added to the RSVP form.
- **FR-002**: The checkbox MUST be positioned at the end of the RSVP form, after the additional guests section.
- **FR-003**: When the "bringing children" checkbox is ticked, the form MUST immediately display a safety/housekeeping message that includes: mention of a pond on site, vendor tables with fragile equipment and extension cords, and an instruction that children must be supervised at all times.
- **FR-004**: The safety message MUST only be visible while the "bringing children" checkbox is in a ticked state.
- **FR-005**: When all additional guests are removed, the "bringing children" checkbox MUST be hidden and its value reset to unchecked.
- **FR-006**: The value of the "bringing children" checkbox MUST be submitted as part of the RSVP payload and saved to the Google Sheet under a column named "Bringing Children".
- **FR-007**: The Google Sheet MUST record the "bringing children" value for every RSVP submission (true/yes if ticked, false/no if unticked or not applicable).

### Key Entities

- **RSVP Submission**: The primary guest's RSVP record, extended with a "bringing children" boolean field.
- **Additional Guests**: One or more plus-ones added by the primary guest; their presence controls visibility of the "bringing children" checkbox.
- **Safety/Housekeeping Message**: An informational notice displayed conditionally when children are indicated, covering site-specific hazards.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Guests with additional guests can complete the updated RSVP form without any extra steps beyond the optional children checkbox.
- **SC-002**: The "bringing children" checkbox appears in 100% of RSVP form sessions where at least one additional guest has been added.
- **SC-003**: The safety message is displayed in 100% of cases where the checkbox is ticked, and absent in 100% of cases where it is unticked.
- **SC-004**: 100% of RSVP submissions are correctly reflected in the Google Sheet "Bringing Children" column.
- **SC-005**: Guests without additional guests never see the checkbox, resulting in zero false impressions that children-related questions apply to solo attendees.

## Assumptions

- The RSVP form already supports adding additional (plus-one) guests (feature 008) and persisting data to Google Sheets (feature 009).
- "Bringing children" is a single boolean field — there is no requirement to count how many children or capture their names.
- The "bringing children" value applies to the primary guest's row in the Google Sheet; it is not recorded per additional guest.
- The housekeeping message is informational only — guests do not need to explicitly agree to or sign off on it beyond having the checkbox ticked.
- The checkbox label will be something like "One or more of my additional guests are children" — exact wording can be refined during implementation.
