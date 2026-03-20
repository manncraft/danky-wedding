# Feature Specification: RSVP Backend Stub

**Feature Branch**: `003-rsvp-backend-stub`
**Created**: 2026-03-20
**Status**: Draft
**Input**: User description: "let's add basic backend to the rsvp lookup. Eventually this call will check the Google sheet using GAS, but for now it just responds with some canned responses, perhaps a couple of options based on what name is input. No auth yet, that's next"

## Clarifications

### Session 2026-03-20

- Q: When a guest types a name, how should the lookup match against records? → A: Full match on last name; first-initial match on first name (case-insensitive throughout).
- Q: What fields should each canned guest record contain when returned to the frontend? → A: Guest full name and maximum party size only. No party member list needed; no identical-name edge case to handle.
- Q: If the backend is unavailable, what should the frontend show? → A: Friendly error message with a "try again" prompt — do not conflate with "not found".
- Q: How should the frontend address the lookup endpoint across environments? → A: Relative URL (e.g. `/api/rsvp`) — frontend and backend deploy together on Vercel, so no environment variable or configuration needed.
- Q: When multiple matches are returned, how does the guest pick the right one? → A: Show a selectable list — guest taps/clicks their name to proceed.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Guest Looks Up RSVP by Name (Priority: P1)

A wedding guest navigates to the RSVP page, types their name (first name and last name), and submits the form. The system queries a backend service which returns matching guest records showing their name and how many people they can bring. The guest confirms they found the right record and proceeds.

**Why this priority**: This is the core flow the entire RSVP feature depends on. Without a working name lookup, nothing else functions.

**Independent Test**: Can be fully tested by submitting a known first-initial and last name combination and verifying the correct guest name and party size are returned.

**Acceptance Scenarios**:

1. **Given** a guest submits "J Smith", **When** the lookup is performed, **Then** the system returns all guests whose last name is exactly "Smith" and whose first name starts with "J", each with their full name and max party size.
2. **Given** two guests share the last name "Smith" but have different first initials (e.g. "Jane Smith" and "John Smith"), **When** a guest submits "J Smith", **Then** both records are displayed as a selectable list so the guest can tap/click their own name.
3. **Given** a guest submits "jane smith" (all lowercase), **When** the lookup is performed, **Then** the system still returns "Jane Smith" with their party size (case-insensitive matching).
4. **Given** a guest submits only a last name with no first name or initial, **When** the lookup is performed, **Then** the system returns all guests with that surname.

---

### User Story 2 - Guest Name Not Found (Priority: P2)

A guest types a name that does not match any record. The system clearly informs them that no match was found, with a prompt to try again or contact the couple.

**Why this priority**: Poor error handling erodes guest confidence. A clear "not found" message prevents confusion and provides a path forward.

**Independent Test**: Submit a name with no match (e.g. "Z Zzunknown") and verify a clear, friendly not-found response is returned.

**Acceptance Scenarios**:

1. **Given** a guest submits a name with no matching canned record, **When** the lookup is performed, **Then** the system returns a clear "not found" response — no crash, no blank screen.
2. **Given** a guest submits an empty or whitespace-only name, **When** the form is submitted, **Then** the system rejects the request with a validation message before even calling the backend.

---

### Edge Cases

- What happens when the name input contains special characters or very long strings?
- If the backend is unavailable or returns an unexpected error, the frontend MUST display a friendly "something went wrong, please try again" message — distinct from the "not found" state.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST expose a lookup endpoint that accepts a guest name as input and returns zero or more matching guest records.
- **FR-002**: The lookup endpoint MUST match on last name (exact, case-insensitive) and, when a first name or initial is provided, also filter by first-name initial (case-insensitive). If only a last name is provided, all guests with that surname are returned.
- **FR-003**: The endpoint MUST return a structured response containing: match status, and for each match — guest full name and maximum party size.
- **FR-004**: The endpoint MUST return a clear "not found" response (not an error) when no names match.
- **FR-005**: The canned data set MUST include at least: one unique last-name match, and at least two guests sharing a last name but with different first initials (to exercise the multi-match path).
- **FR-006**: The frontend MUST call the new backend endpoint instead of any existing stub or hardcoded data.
- **FR-007**: No authentication is required to call the lookup endpoint at this stage.
- **FR-008**: The frontend MUST distinguish between a "not found" response and a backend error, displaying a friendly "try again" message for the latter.

### Key Entities

- **Guest**: A named individual invited to the wedding. Has a full name (first + last) and a maximum party size.
- **Lookup Response**: The result of a name query — contains a list of zero or more matching Guest records and a status (found / not found).
- **Canned Data Set**: A static, in-memory collection of Guest records used in place of a live data source for this iteration.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A guest name lookup completes and displays results within 1 second under normal conditions.
- **SC-002**: All canned name scenarios (unique match, shared-surname multi-match, no match) return the correct response 100% of the time.
- **SC-003**: The frontend correctly reflects all three response states (single match, multiple matches, not found) without crashing.
- **SC-004**: Submitting an empty name never reaches the backend — blocked entirely on the client side.

## Assumptions

- The canned data set will be hard-coded in the backend for now; no database or external service is involved.
- No two guests share the exact same full name, so collision handling is not required.
- "Multiple matches" means two or more guests sharing the same last name and first initial.
- Party size is the only guest attribute needed at this stage; dietary requirements and song requests come later.
- The backend serverless function and the frontend are part of the same Vercel project, so the frontend calls the endpoint via a relative URL (e.g. `/api/rsvp`) with no environment-specific configuration required.
- Authentication and authorisation are explicitly out of scope for this feature and will be addressed in the next iteration.
