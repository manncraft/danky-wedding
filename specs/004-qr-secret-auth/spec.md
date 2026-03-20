# Feature Specification: QR Code Secret Validation

**Feature Branch**: `004-qr-secret-auth`
**Created**: 2026-03-20
**Status**: Draft
**Input**: User description: "add secret validation — backend rejects calls without secret embedded in QR code on invites"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Guest Arrives via Invite QR Code (Priority: P1)

A wedding guest scans the QR code printed on their physical invitation. The QR code opens the wedding site with a secret embedded in the link. The guest experiences the normal RSVP flow with no additional steps — the secret is validated silently in the background and never exposed to the guest.

**Why this priority**: This is the expected path for every invited guest. It must work flawlessly and transparently — any friction here directly impacts RSVP completion.

**Independent Test**: Open the site using a valid invite link (with the correct secret). Verify the RSVP lookup screen is accessible and backend calls succeed. The guest sees no indication that any validation is occurring.

**Acceptance Scenarios**:

1. **Given** a guest opens the site via a QR code link containing the correct secret, **When** the page loads, **Then** the site functions normally and the guest can proceed to the RSVP lookup without any additional prompt.
2. **Given** a guest has already loaded the site with a valid secret, **When** they submit a name lookup, **Then** the backend accepts the request and returns the appropriate result.
3. **Given** the secret is correctly embedded in the link, **When** the guest navigates between pages or refreshes, **Then** access is maintained without requiring the guest to re-scan or re-enter anything.

---

### User Story 2 - Visitor Arrives Without a Valid Invite Link (Priority: P2)

Someone accesses the site directly (e.g., by typing the URL, clicking a shared screenshot link, or opening a link where the secret was stripped). They are shown a clear, friendly message explaining they need to use the link from their physical invitation.

**Why this priority**: Prevents unauthorised access to the RSVP lookup and guest data. Also provides a helpful path forward for guests who genuinely lost their invite link.

**Independent Test**: Open the site URL without the secret parameter. Verify a friendly "use your invite" message is displayed and the RSVP lookup is not accessible. Verify that manually appending a wrong secret also triggers this message.

**Acceptance Scenarios**:

1. **Given** a visitor opens the site without any secret in the link, **When** the page loads, **Then** they see a friendly message explaining they need to use the QR code from their physical invitation — they cannot access the RSVP lookup.
2. **Given** a visitor opens the site with an incorrect or tampered secret, **When** they attempt to use the RSVP lookup, **Then** the backend rejects the request and the frontend shows the same "use your invite" message.
3. **Given** a visitor is blocked by the invalid-access screen, **When** they later scan a valid QR code, **Then** they gain access to the site normally.

---

### Edge Cases

- What happens if a guest shares their QR code link with someone else? (Accepted and intentional — the shared secret is a convenience gate, not a per-person credential.)
- What if the QR code link is posted publicly (e.g., on social media)? The secret should not be trivially guessable; it must be a sufficiently random value.
- What happens if the stored secret is accidentally changed after invites are printed? All printed QR codes become invalid — this is an operational risk, not a system failure.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The backend MUST reject any request that does not include the correct secret, returning a clear rejection response.
- **FR-002**: The backend MUST accept requests that include a secret matching the configured value, and reject all others — including those with no secret, an empty secret, or an incorrect value.
- **FR-003**: The secret MUST be transmitted with every request from the frontend to the backend without any action required from the guest.
- **FR-004**: The secret value MUST be stored in a secure, server-side configuration that is not exposed in client-side code or source control.
- **FR-005**: The frontend MUST read the secret from the invite link when the page loads and retain it for the duration of the session.
- **FR-006**: If no valid secret is present when the page loads, the frontend MUST display a friendly "use your invite link" message and prevent access to the RSVP lookup entirely.
- **FR-007**: If the backend rejects a request due to an invalid secret, the frontend MUST display the same "use your invite link" message — not a generic error.
- **FR-008**: The secret MUST be a randomly generated, sufficiently unpredictable value (not a dictionary word or sequential number).

### Key Entities

- **Invite Secret**: A shared, single-value secret embedded in every QR code. Has no expiry. The same secret is used for all guests. Not per-person.
- **Session Access State**: The frontend's knowledge of whether a valid secret was found in the current link. Either valid (secret present and accepted) or invalid (missing or rejected).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of requests reaching the backend without the correct secret are rejected.
- **SC-002**: A guest arriving via a valid QR code link experiences zero additional steps compared to the previous (no-auth) flow.
- **SC-003**: A visitor without a valid link sees a clear explanation within the normal page load time — no blank screen, no confusing error.
- **SC-004**: The secret value is not present in any committed source file, build output, or client-side bundle.

## Assumptions

- One shared secret is used for all guests — there is no per-guest or per-invite unique token.
- The secret does not expire; it remains valid until manually rotated (which would invalidate all printed QR codes — a conscious operational decision).
- The secret is embedded as a URL query parameter in the QR code link (e.g., `?s=...`). The exact parameter name is an implementation detail.
- "Sufficient randomness" means at least 16 characters of alphanumeric random characters — not a recognisable word or date.
- The friendly "use your invite" screen is informational only; it does not offer a way to recover or re-send the invite link (the couple handles that manually).
- This feature applies to the RSVP backend. Static pages (schedule, venue info) do not require the secret.
