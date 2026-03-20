# Feature Specification: GAS Google Sheet Guest Data Integration

**Feature Branch**: `005-gas-sheet-integration`
**Created**: 2026-03-20
**Status**: Draft
**Input**: User description: "Next, let's hook into our Google sheet with GAS for fetching guest data. How do we structure that? I suspect I'll need to manually copy the app script and set up the sheet myself, but maybe you should keep a copy of the script in the repo for posterity"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Guest Looks Up Their Record From Live Sheet (Priority: P1)

A wedding guest navigates to the RSVP page, enters their name, and the system returns their real allowance (max guests) drawn from the couple's Google Sheet rather than hard-coded data. The couple can add, update, or remove guests in the sheet and the site reflects changes without any code deployment.

**Why this priority**: This is the core value of the feature — replacing canned data with real guest data. Without it, the RSVP flow is useless for actual guests.

**Independent Test**: Set up a sheet with at least one real guest name, deploy the GAS script, wire the Vercel function to it, submit that guest's name in the RSVP form, and verify the correct `max_guests` value is returned.

**Acceptance Scenarios**:

1. **Given** a guest name exists in the `Invites` sheet, **When** the guest submits their name on the RSVP lookup page, **Then** the system returns their full name and correct guest allowance.
2. **Given** a guest name does NOT exist in the sheet, **When** the guest submits their name, **Then** the system returns a "not found" response.
3. **Given** the couple updates a guest's `max_guests` value in the sheet, **When** that guest next submits a lookup request, **Then** the updated value is returned without any code change or redeployment.

---

### User Story 2 — Couple Manages Guest List in Google Sheets (Priority: P2)

The couple (and their designated helpers) maintain the canonical guest list directly in a Google Sheet. Adding, editing, or removing a guest row immediately affects what guests see on the site. No developer involvement is needed for routine guest list maintenance.

**Why this priority**: Admin usability is the second most important goal — the sheet is the couple's primary operational interface.

**Independent Test**: Add a new guest row to the `Invites` sheet, look up that guest's name in the RSVP form, and verify they are found.

**Acceptance Scenarios**:

1. **Given** the couple adds a new row to the `Invites` sheet, **When** that new guest submits their name in the RSVP form, **Then** they are found with the correct allowance.
2. **Given** the couple deletes a guest row from the sheet, **When** that guest later tries to look up their name, **Then** they receive a "not found" response.

---

### User Story 3 — GAS Script Is Version-Controlled for Reference (Priority: P3)

A developer (or the couple) can find the authoritative GAS script in the repository, understand what it does, and re-deploy it if the original script is lost or the project is handed to someone else. The repo acts as the single source of truth for the script logic.

**Why this priority**: Operational continuity. GAS scripts are not in source control by default; keeping a copy in the repo prevents catastrophic loss and makes onboarding new helpers possible.

**Independent Test**: Check out the repo on a fresh machine, find the GAS script file, follow its setup instructions, deploy it, and successfully run a guest lookup through the full stack.

**Acceptance Scenarios**:

1. **Given** the GAS script file exists in the repo, **When** a developer reads it, **Then** the deployment steps and sheet structure are documented clearly enough to set up without external help.
2. **Given** the script is deployed fresh from the repo copy, **When** the Vercel function calls it, **Then** guest lookups succeed correctly.

---

### Edge Cases

- What happens when the GAS endpoint is unavailable (network error, script quota exceeded, or misconfigured URL)? The lookup page must display a clear error message and not crash.
- What happens when the GAS response takes longer than the configured timeout? The Vercel function aborts the request and returns a service-error; the guest sees a clear message rather than an indefinite hang.
- What happens when the `Invites` sheet has blank rows interspersed between guest rows? Blank rows must be skipped silently.
- What happens when a guest's name contains diacritics, hyphens, or non-ASCII characters in the sheet? The lookup must normalise both sides before matching so "María García" and "maria garcia" both resolve.
- What happens when the GAS secret is wrong or missing? GAS returns an `{"error": "..."}` body; the Vercel function detects this (error key present, or guests field absent/null) and returns a service error — no guest data is exposed.
- What happens when GAS returns HTTP 200 but with a null or missing `guests` field (e.g., script crash, unexpected response shape)? The Vercel function MUST treat this as a fatal error, not as an empty guest list.
- What happens when `max_guests` is left blank or non-numeric in the sheet? The system must default safely (e.g., treat as 1) rather than returning invalid data.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST read guest data from the `Invites` tab of the configured Google Sheet on every lookup request.
- **FR-002**: The GAS web app endpoint MUST be authenticated with a dedicated `GAS_SECRET` passed as a query parameter. This secret is entirely separate from `INTERNAL_SECRET` (the guest invite secret) and MUST NOT be derived from or shared with it. Requests without the correct `GAS_SECRET` MUST be rejected.
- **FR-003**: The Vercel lookup function MUST call the GAS endpoint to retrieve the guest list, then apply name-normalisation and matching locally.
- **FR-004**: Name matching MUST be case-insensitive, diacritic-insensitive, and trimmed; a guest searching "Maria Garcia" MUST match a sheet row named "María García".
- **FR-005**: If the GAS endpoint is unreachable, returns a response body containing an `error` key, or returns a response in which the `guests` field is missing or null, the Vercel function MUST treat the call as failed and return a service-error response to the client; the client MUST display a user-friendly error message. Both conditions are checked; either alone is sufficient to trigger the error path.
- **FR-006**: Blank rows in the sheet MUST be silently skipped during data processing.
- **FR-007**: A `max_guests` cell that is blank or non-numeric MUST be treated as a default of 1.
- **FR-008**: The GAS script file MUST be stored in the repository (e.g., `gas/guest-lookup.gs`) with setup instructions embedded as comments.
- **FR-009**: The GAS script and Vercel function MUST NOT expose the full guest list to the client; only the matching guest's own record is returned.
- **FR-011**: The Vercel function MUST abort the GAS fetch and return a service-error if no response is received within the timeout window. The timeout MUST be configurable via the `GAS_TIMEOUT_MS` environment variable and MUST default to 6000 ms when that variable is absent or unset.

- **FR-010**: `GAS_ENDPOINT_URL`, `GAS_SECRET`, and `GAS_TIMEOUT_MS` MUST be stored as server-side environment variables and MUST NOT appear in client-side code or the repository. `GAS_SECRET` and `INTERNAL_SECRET` are distinct credentials protecting different trust boundaries (backend data access vs. guest site access) and MUST be independently managed.

### Key Entities

- **Invite record**: A single guest's entry in the `Invites` sheet. Key attributes: `Full Name` (string), `Max Guests` (positive integer). The sheet row is the authoritative source; no copy is persisted elsewhere.
- **GAS Web App**: A deployed Google Apps Script acting as an HTTP data endpoint. Reads the `Invites` sheet and returns all invite records as JSON to authenticated callers. Managed outside the repo (manually deployed), but the script source is version-controlled.
- **Vercel Lookup Function**: The API proxy that holds secrets, calls the GAS web app, performs name matching, and returns only the matched guest's record to the browser.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every guest name present in the `Invites` sheet can be found via the RSVP lookup form, with zero false negatives for correctly-spelled names.
- **SC-002**: Adding or updating a guest row in the sheet is reflected in the next lookup request without any code change, redeployment, or developer action.
- **SC-003**: When the GAS endpoint is unavailable, guests see an intelligible error message within the normal page flow rather than a blank screen or unhandled exception.
- **SC-004**: Zero guest list data is exposed to the browser beyond the single matched record — confirmed by inspecting network responses for any lookup.
- **SC-005**: A developer can re-deploy the GAS script from the repo copy alone, following only the instructions in that file, without consulting any external documentation.

## Clarifications

### Session 2026-03-20

- Q: How should the Vercel backend authenticate to GAS — reuse the guest invite secret or use a separate credential? → A: Dedicated `GAS_SECRET` env var, completely separate from `INTERNAL_SECRET`.
- Q: How does the Vercel function detect a failed or rejected GAS response, given GAS always returns HTTP 200? → A: Dual check — presence of an `error` key in the response body, OR a missing/null `guests` field; either condition is treated as a fatal data-source error.
- Q: Should the Vercel function enforce a timeout on the GAS fetch, and if so how? → A: Configurable via `GAS_TIMEOUT_MS` env var; defaults to 6000 ms if the variable is absent or unset.

## Assumptions

- The couple will manually create the Google Sheet, add the `Invites` tab, populate it with guest data, and deploy the GAS script following the in-file instructions.
- Sheet column layout: Column A = `Full Name`, Column B = `Max Guests`, Row 1 = header (skipped).
- The GAS web app will be deployed with "Execute as: Me" and "Who has access: Anyone" — the shared secret is the only access control mechanism, per the project constitution.
- Guest list size is small enough (hundreds, not thousands) that fetching all records on every request and matching in memory is acceptable without caching.
- The existing name-normalisation logic in the Vercel function (`normaliseName`) is already correct; this feature wires a live data source to that logic, it does not change the matching algorithm.
- GAS imposes a daily execution quota. For a wedding-scale guest list with modest traffic, this quota will not be reached.
