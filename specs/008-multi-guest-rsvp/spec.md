# Feature Specification: Multi-Guest RSVP

**Feature Branch**: `008-multi-guest-rsvp`
**Created**: 2026-03-20
**Status**: Draft
**Input**: User description: "if the max guests is more than 1, add an option to rsvp for other guests in the same party/group. ask are you rsvping for anyone else?, then provide an add guest button. each guest added should add a section to the form with detailed questions about that guest (for now just dietary requirements). Once the max guests (including the primary guests) is hit, remove the add guest button. each guest section should have an option to remove that guest, probably a trash can icon."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add Additional Guests to RSVP (Priority: P1)

A guest with a max party size greater than 1 is filling out the RSVP form. After completing their own details, they see the static label "Are you RSVPing for anyone else?" above an "Add Guest" button and can add other guests in their party by clicking it. Each additional guest gets their own form section where dietary requirements can be entered. The primary guest can remove any added guest using a trash can icon. Once the total number of guests (primary + added) reaches the allowed maximum, the "Add Guest" button disappears.

**Why this priority**: This is the core feature — without it, guests with multiple spots in their party cannot RSVP on behalf of their group, which would result in incomplete attendance data.

**Independent Test**: Can be fully tested by loading the RSVP form for an invitation with max guests > 1, adding one or more guests, and verifying dietary fields appear per guest and the form submits correctly.

**Acceptance Scenarios**:

1. **Given** a guest whose invitation allows 2 or more guests, **When** they reach the "Are you RSVPing for anyone else?" section of the RSVP form, **Then** an "Add Guest" button is visible
2. **Given** the "Add Guest" button is visible, **When** the guest clicks it, **Then** a new guest section appears with a dietary requirements field and a remove (trash can) button
3. **Given** the total number of guests (primary + added) equals the maximum allowed, **When** the form is displayed, **Then** the "Add Guest" button is hidden
4. **Given** an added guest section is visible, **When** the guest clicks the trash can icon on that section, **Then** the section is removed from the form and the "Add Guest" button reappears if below the maximum
5. **Given** all guest sections are filled out, **When** the form is submitted, **Then** dietary requirements for all guests (primary and additional) are included in the submission

---

### User Story 2 - Single-Guest Invitation (No Extra Guest Option) (Priority: P2)

A guest whose invitation allows exactly 1 person fills out the RSVP form. They should not see any "Are you RSVPing for anyone else?" prompt or "Add Guest" button, as their party size cannot exceed 1.

**Why this priority**: Ensures the feature is conditional — guests with a single-person invite have a simpler, uncluttered form.

**Independent Test**: Can be fully tested by loading the RSVP form for an invitation with max guests = 1 and confirming no multi-guest UI elements are shown.

**Acceptance Scenarios**:

1. **Given** a guest whose invitation allows exactly 1 guest, **When** the RSVP form is displayed, **Then** no "Are you RSVPing for anyone else?" question or "Add Guest" button appears

---

### User Story 3 - Add and Remove Multiple Guests (Priority: P3)

A guest with a party of 4 adds 3 additional guests one at a time, then removes one of them, then adds another back. The form correctly tracks the count and shows/hides the "Add Guest" button accordingly.

**Why this priority**: Validates the dynamic add/remove flow works correctly at higher party sizes and with mixed add/remove sequences.

**Independent Test**: Can be tested by simulating add and remove actions in sequence for a large party size and verifying button visibility and form section count.

**Acceptance Scenarios**:

1. **Given** a max party of 4 and 3 guests already added, **When** the form is displayed, **Then** the "Add Guest" button is hidden
2. **Given** a max party of 4 and 3 guests already added, **When** one guest is removed, **Then** the "Add Guest" button reappears
3. **Given** a max party of 4 and 2 guests already added, **When** the guest adds another, **Then** the total guest count reaches 3 (primary + 2 added) and the "Add Guest" button remains visible

---

### Edge Cases

- What happens when a guest removes all added guests? The "Are you RSVPing for anyone else?" label and "Add Guest" button remain visible.
- What happens if the primary guest changes their attendance answer from attending to not attending after adding guests? All added guest sections are hidden (and discarded from the submission); they reappear if the primary guest switches back to attending.
- What happens if max guests is exactly 1? The multi-guest section is entirely hidden.
- What happens if a guest leaves a dietary requirements field blank for an added guest? The field is optional; a blank value is submitted as no dietary requirements.
- What if the guest submits the form with partially-completed additional guest sections? Each added guest section's dietary field is optional, so incomplete sections are valid.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The multi-guest section (including the "Are you RSVPing for anyone else?" label and "Add Guest" button) MUST only appear when the invitation's maximum guest count is greater than 1 AND the primary guest has indicated they are attending
- **FR-002**: The RSVP form MUST display the text "Are you RSVPing for anyone else?" as a static label directly above the "Add Guest" button (no yes/no toggle or radio input)
- **FR-003**: Users MUST be able to add additional guests by clicking an "Add Guest" button, with each click adding one new guest section to the form
- **FR-004**: Each additional guest section MUST contain a name field (required) and a dietary requirements field, and be visually delineated from adjacent sections (no section label or number required)
- **FR-005**: Each additional guest section MUST include a remove control (trash can icon) that, when activated, removes that guest section from the form
- **FR-006**: The "Add Guest" button MUST be hidden once the total number of guests (1 primary + added guests) equals the maximum allowed party size
- **FR-007**: The "Add Guest" button MUST reappear if a previously added guest is removed and the total drops below the maximum
- **FR-008**: On form submission, dietary requirements for all guests (primary and additional) MUST be included in the submitted data
- **FR-009**: Additional guest dietary requirements fields MUST be optional (not required for form submission)
- **FR-010**: Additional guest name fields MUST be required; the form MUST NOT submit if any added guest section has an empty name field. Names are not validated against the guest list.

### Key Entities

- **Primary Guest**: The person filling out the form; always present; has their own dietary requirements field (existing feature)
- **Additional Guest**: A member of the same party added by the primary guest; has a required name field and an optional dietary requirements field; can be removed before submission; name is not validated against the guest list
- **Party**: The group of guests associated with a single invitation; has a maximum size defined by the invitation

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A guest with a multi-person invitation can add all allowed additional guests and submit the form without encountering errors
- **SC-002**: The "Add Guest" button is never visible when the party is at maximum capacity, preventing over-submission
- **SC-003**: Removing a guest section always correctly recalculates the remaining capacity and updates button visibility without a page reload
- **SC-004**: Guests with single-person invitations see no multi-guest UI elements — the form is identical to the pre-feature version for them
- **SC-005**: A submitted RSVP with additional guests includes a name and dietary data for every guest in the party

## Clarifications

### Session 2026-03-20

- Q: Does "Are you RSVPing for anyone else?" act as a yes/no toggle, or is it static label text above the "Add Guest" button? → A: Static label text above the "Add Guest" button — no yes/no selection required
- Q: Should the multi-guest section appear when the primary guest declines attendance? → A: Hide multi-guest section when primary guest declines attendance
- Q: Should added guest sections be labelled (e.g., "Guest 2", "Guest 3") and renumber on removal? → A: No labels needed; sections are visually delineated only

## Assumptions

- The maximum guest count per invitation is already known and accessible within the RSVP form (established in prior features)
- Additional guest sections only collect dietary requirements for now; the spec assumes more fields will be added in future iterations but does not require them here
- The primary guest's own dietary requirements field (from feature 007) is separate from and independent of additional guest sections
- Additional guest names are collected but not validated against the guest list — any non-empty string is accepted
- The form does not persist partially-added guest sections if the page is refreshed; users must re-add guests after a reload
