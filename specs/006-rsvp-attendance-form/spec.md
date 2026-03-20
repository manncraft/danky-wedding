# Feature Specification: RSVP Attendance Form

**Feature Branch**: `006-rsvp-attendance-form`
**Created**: 2026-03-20
**Status**: Draft
**Input**: User description: "add the proper rsvp form now. at first, we will focus on the primary guest whose name is returned from the backend. We'll keep dietary requirements, song requests, and additional guests out of scope, and focus on whether they're attending or not"

## Context

The following is already implemented and out of scope for this feature:

- QR code authentication and the invite secret gate (004)
- Guest name lookup via first + last name search against the Google Sheet (002, 003, 005)
- The lookup result screen showing the matched guest name(s) (003)

This feature picks up from the point where a guest's name has been confirmed by the lookup — i.e. a matched name is shown on screen — and adds the ability to submit an attendance decision.

## Clarifications

### Session 2026-03-20

- Q: After the lookup result confirms a match, how does the attendance form appear? → A: Inline on the same screen, below or replacing the lookup result (no page navigation).
- Q: Where should the attendance decision be stored? → A: Stubbed response from the Vercel backend — no real persistence in this iteration.
- Q: If a guest revisits the RSVP page after submitting, what should they see? → A: Same session — show the confirmation screen again (session state). New session (refresh or re-scan QR) — show the fresh lookup form.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Submit Attendance Decision (Priority: P1)

After the guest lookup confirms a match, the attendance form appears inline on the same screen — the lookup result transitions to reveal the attendance options without any page navigation. The matched guest name is shown and the guest selects either "Attending" or "Not Attending" and submits.

**Why this priority**: This is the core deliverable — capturing whether the guest will attend. Nothing else in this feature has value without it.

**Independent Test**: Can be fully tested by simulating a confirmed guest lookup result, observing the attendance form appear inline, selecting an attendance option, submitting, and verifying the decision is recorded and a confirmation is shown.

**Acceptance Scenarios**:

1. **Given** the guest lookup has returned a confirmed match, **When** the match is confirmed, **Then** the attendance form appears inline on the same screen (no page navigation), showing the matched guest name and the two attendance options.
2. **Given** the attendance form is displayed, **When** the guest selects "Attending" and submits, **Then** their attendance is recorded and they see a confirmation message.
3. **Given** the attendance form is displayed, **When** the guest selects "Not Attending" and submits, **Then** their decline is recorded and they see an acknowledgement message.
4. **Given** the attendance form is displayed, **When** the guest attempts to submit without selecting an option, **Then** the form does not submit and a clear validation error is shown.

---

### User Story 2 - View Confirmation After Submission (Priority: P2)

After submitting, the guest sees a confirmation that reflects their name and what they chose, displayed inline on the same screen.

**Why this priority**: Guests need reassurance their response was captured. Without confirmation, some will submit multiple times.

**Independent Test**: Can be tested by submitting any valid attendance decision and verifying the confirmation appears inline showing the correct name and decision.

**Acceptance Scenarios**:

1. **Given** a guest submits "Attending", **When** the confirmation appears, **Then** it shows their name and confirms they are attending.
2. **Given** a guest submits "Not Attending", **When** the confirmation appears, **Then** it shows their name and confirms their decline was noted.

---

### Edge Cases

- What happens if the attendance submission fails (e.g. backend unavailable)? The guest should see an error message inline and be able to retry without losing their selection.
- If the guest navigates within the same session after submitting, they see the confirmation screen again (no re-submission).
- If the guest refreshes the page or re-scans their QR code (new session), they are shown the fresh lookup form from the beginning.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: After a successful guest lookup, the attendance form MUST appear inline on the same screen without page navigation, showing the matched guest name and two mutually exclusive options: attending or not attending.
- **FR-002**: The guest MUST be required to select an attendance option before submitting.
- **FR-003**: Upon successful submission, the Vercel backend MUST accept the attendance decision and return a success response. Actual persistence is out of scope for this iteration (stubbed).
- **FR-004**: Upon successful submission, the guest MUST see a confirmation inline on the same screen showing their name and the decision they submitted.
- **FR-005**: If submission fails, the guest MUST see an error message inline and be able to retry.
- **FR-006**: Dietary requirements, song requests, and additional guest fields are explicitly OUT OF SCOPE and MUST NOT appear on this form.

### Key Entities

- **RSVP Response**: The payload sent to the backend — guest name and attendance decision (attending / not attending). Not persisted in this iteration; the backend stubs a success response.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A guest can go from confirmed lookup result to submitted RSVP in under 30 seconds.
- **SC-002**: The form prevents submission without an attendance selection in 100% of cases.
- **SC-003**: Every successful submission is followed by a confirmation shown inline, displaying the guest's name and decision.

## Assumptions

- The matched guest name from the lookup result (already implemented) is passed directly into the attendance form — no second lookup is needed.
- The attendance decision is submitted to a new Vercel backend endpoint that returns a stub success response. No real persistence (Google Sheet write or otherwise) is in scope for this iteration.
- Within the same session, the submitted RSVP state is held in memory — navigating back shows the confirmation again, not the form.
- A page refresh or new QR scan starts a fresh session; no prior RSVP state is restored (consistent with the stub backend having no persistence).
