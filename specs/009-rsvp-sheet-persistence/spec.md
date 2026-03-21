# Feature Specification: RSVP Sheet Persistence

**Feature Branch**: `009-rsvp-sheet-persistence`
**Created**: 2026-03-20
**Status**: Draft
**Input**: User description: "i want to add persistence of the rsvp submission into the google sheet"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Guest Submits RSVP and Every Person is Saved as Their Own Row (Priority: P1)

A wedding guest completes the RSVP form — including attendance, dietary requirements, and any plus-ones — and submits it. Upon submission, each person covered by the RSVP (the primary submitter and every plus-one) is written as a separate row in the RSVPs sheet, so the couple and caterers can count heads without manual unflattening.

**Why this priority**: This is the core value of the feature. One row per person is the mandated format; without it, headcount and catering vendor exports are unusable.

**Independent Test**: Submit an RSVP for one primary guest and two plus-ones. Open the Google Sheet and confirm three separate rows appear, each with the correct data and one clearly marked as "Primary" and the others as "Plus-One".

**Acceptance Scenarios**:

1. **Given** a guest submits with attendance "yes", dietary notes, and two plus-ones, **When** the form is submitted, **Then** the RSVPs sheet gains three new rows — one for the primary guest (type: Primary) and one for each additional member (type: Plus-One) — all sharing the same `invite_source` and timestamp.
2. **Given** a guest submits with attendance "no" and no additional guests, **When** submission completes, **Then** exactly one row is appended for the primary guest with attendance "no" and the Plus-One rows are omitted entirely.
3. **Given** a network or sheet error occurs during save, **When** the guest submits, **Then** they see a clear error message, their form data is preserved so they can retry, and no partial rows are written to the sheet (all-or-nothing write).

---

### User Story 2 - Couple and Caterers Can Read the Sheet Directly (Priority: P2)

The wedding couple (and eventually the catering vendor) opens the RSVPs sheet and immediately sees one row per person with all the fields needed for planning — name, dietary, guest type, age range, seating needs, and more — without any manual transformation.

**Why this priority**: Non-technical stakeholders rely on the sheet directly. Unreadable or incomplete data defeats the entire purpose of persistence.

**Independent Test**: After several RSVP submissions (including ones with plus-ones), open the sheet and confirm each person occupies exactly one row with all required catering columns present and correctly labelled.

**Acceptance Scenarios**:

1. **Given** multiple RSVPs have been submitted, **When** the couple opens the RSVPs sheet, **Then** each person appears as a separate row with columns: `timestamp`, `guest_name`, `attending`, `dietary`, `type`, `invite_source`, `is_child`, `age_range`, `seating_needs`, `safety_ack`.
2. **Given** a primary guest "Alice" submitted with one plus-one "Bob", **When** the caterer reads the sheet, **Then** both rows have `invite_source = "Alice"`, making it immediately clear that Bob is Alice's guest.
3. **Given** the RSVPs sheet is empty when the first submission arrives, **When** that submission is processed, **Then** the header row is created automatically with all required column labels before the first data row is written.

---

### User Story 3 - Re-submissions Append Without Overwriting (Priority: P3)

If a guest submits the form more than once (e.g., to update dietary requirements), the new submission appends fresh rows to the sheet rather than overwriting the old ones. The couple can identify the latest entry by timestamp and handle deduplication manually as needed.

**Why this priority**: Automated deduplication is explicitly out of scope per project principles; the append-only log and manual sheet management is the intended model.

**Independent Test**: Submit the same primary guest name twice with different dietary values. Confirm two sets of rows appear in the sheet, both timestamped, with the later set clearly the most recent.

**Acceptance Scenarios**:

1. **Given** a guest has previously submitted an RSVP, **When** they submit again with updated details, **Then** a new set of rows is appended to the sheet for all persons in the new submission, timestamped, and the original rows remain untouched.

---

### Edge Cases

- What happens when the Google Sheet is temporarily unavailable or credentials are invalid? The guest sees an error, the form retains all entered data, and no rows are written.
- What if only some rows in a multi-person submission can be written (partial failure)? The entire write MUST be treated as failed — no partial rows are committed.
- What if an plus-one's name or dietary field is blank? The row is still written with the blank value; blank is valid, absent is not.
- What if the sheet already has a header row from a prior run? The system MUST detect its presence and skip re-creating it rather than duplicating the header.
- What constitutes a "mystery guest"? Any row in the RSVPs sheet that has no `invite_source` value. Zero such rows is a hard success criterion.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST write one row per person to the RSVPs sheet for every RSVP submission — the primary guest and each plus-one each get their own row. Exception: if the primary guest declines (`attending = no`), only one row is written for the primary guest; no plus-one rows are written.
- **FR-002**: Each row MUST include all of the following fields: `timestamp`, `guest_name`, `attending`, `dietary`, `type` (Primary or Plus-One), `invite_source`, `is_child`, `age_range`, `seating_needs`, `safety_ack`. A guest who declines still produces a row with `attending = no`.
- **FR-003**: Every plus-one row MUST record the primary guest's name as `invite_source`, explicitly identifying whose guest they are. The primary guest's own row MUST also carry the same `invite_source` value so all rows from the same submission are grouped.
- **FR-004**: The RSVPs sheet MUST be append-only — existing rows MUST never be modified or deleted by the system.
- **FR-005**: The sheet write MUST be atomic with respect to the submission: either all rows for a submission are written, or none are (no partial writes).
- **FR-006**: If the RSVPs sheet has no header row, the system MUST create one automatically with the correct column labels before writing the first data row.
- **FR-007**: System MUST return a clear, user-visible error message if the sheet write fails, and MUST NOT clear form contents or navigate away, allowing the guest to retry.
- **FR-008**: System MUST NOT require any additional guest action beyond clicking the existing submit button for data to be persisted.
- **FR-010**: On a successful sheet write, the system MUST navigate the guest to the existing confirmation screen — the post-submit flow is unchanged from the current behaviour.
- **FR-009**: Zero rows with a blank `invite_source` ("mystery guests") MUST be written under any circumstance.

### Key Entities

- **RSVP Submission**: The complete response from one form submission — primary guest details plus zero or more plus-ones.
- **Person Row**: A single row in the RSVPs sheet representing one individual (either the primary guest or a plus-one), with all catering schema fields populated.
- **invite_source**: The primary guest's name, recorded on every row in the submission — including the primary guest's own row. On plus-one rows this explicitly identifies whose guest they are; on the primary row it anchors the group. Enables the couple to reconstruct a full party from the flat per-person log.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of successfully submitted RSVPs result in the correct number of rows (one per person) appearing in the RSVPs sheet within 5 seconds of the guest clicking submit.
- **SC-002**: All ten required fields (`timestamp`, `guest_name`, `attending`, `dietary`, `type`, `invite_source`, `is_child`, `age_range`, `seating_needs`, `safety_ack`) are present in every written row.
- **SC-003**: Zero rows in the RSVPs sheet have a blank `invite_source` — no mystery guests.
- **SC-004**: Guests who encounter a save error can retry without refreshing or re-entering data, and their full submission is persisted on retry.
- **SC-005**: The couple and caterers can derive accurate headcount and dietary counts directly from the sheet with no manual data transformation.

## Clarifications

### Session 2026-03-21

- Q: Does this feature include adding the missing form fields (`is_child`, `age_range`, `seating_needs`, `safety_ack`) or is it persistence-only for currently collected fields? → A: Persistence-only. Missing fields written as blank; form fields deferred to a future feature.
- Q: Should `attending` be an explicit column in the RSVPs sheet, and do "no" RSVPs still produce a row? → A: Yes — `attending` is a required column; a "no" RSVP still writes a row with `attending = no`.
- Q: When a primary guest declines, are plus-one rows also written with `attending = no`? → A: No — a declined submission produces exactly one row (the primary guest); no plus-one rows are written.
- Q: Canonical term for non-primary guests — "plus-one" or "plus-one"? → A: Plus-one (matches `type` column value and constitution language).
- Q: What should the guest experience after a successful sheet write? → A: Navigate to the existing confirmation screen (no change to current post-submit flow).

## Assumptions

- The Google Sheet and Google Apps Script integration established in feature 005 are the delivery mechanism; this feature defines what data is written and the row-per-person shape, extending that integration.
- Sheet credentials and configuration continue to be managed via environment variables on the backend.
- **Confirmed scope boundary**: This feature is persistence-only. It wires up sheet writes for the fields the form currently collects. The four catering fields not yet on the form (`is_child`, `age_range`, `seating_needs`, `safety_ack`) are written as blank values; adding them to the form is explicitly deferred to a future feature.
- Automated deduplication is out of scope per project principles — the couple handles duplicate submissions manually using timestamps.
- The QR secret authentication gating the RSVP form is unchanged by this feature.
