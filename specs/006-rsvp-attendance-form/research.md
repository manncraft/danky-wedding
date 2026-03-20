# Research: RSVP Attendance Form

**Branch**: `006-rsvp-attendance-form` | **Date**: 2026-03-20

No NEEDS CLARIFICATION items were present in the technical context. All decisions are straightforward extensions of existing patterns.

---

## Decision 1: View state extension strategy

**Decision**: Extend the existing `ViewState` discriminated union in `RsvpLookup.tsx` rather than introducing a separate component or state manager.

**Rationale**: The existing `ViewState` pattern (`form | loading | select | confirmed | not_found | error`) already drives the entire RSVP flow. Adding `rsvp-submitted` as one more variant is consistent with this pattern, minimises new code surface, and keeps all RSVP UI in one component.

**Alternatives considered**:
- Separate `RsvpAttendanceForm` component with its own state — rejected; creates coordination overhead between two stateful components for a flow that is inherently sequential.
- New top-level `View` variant in `App.tsx` (`rsvp-lookup | rsvp-form | rsvp-confirmed`) — rejected; overengineered for a feature that is a sub-step of the existing lookup flow.

---

## Decision 2: `confirmed` state doubles as the attendance form

**Decision**: The existing `confirmed` view state (which already shows the matched guest name) will be updated to display the attendance form inline, replacing the "RSVP flow coming soon." placeholder. No new `rsvp-form` intermediate state is introduced.

**Rationale**: The spec says "the attendance form appears inline … the lookup result transitions to reveal the attendance options." The `confirmed` state already holds the `MatchedGuest` and is already displayed when a single or selected match is confirmed. Reusing it avoids a no-op state transition.

**Alternatives considered**:
- Add a separate `rsvp-form` state that `confirmed` transitions into — rejected; adds an extra `setView` call with no UX benefit since the spec says they appear together.

---

## Decision 3: New `POST /api/rsvp-submit` endpoint (separate from `/api/rsvp`)

**Decision**: Introduce a new Vercel function at `api/rsvp-submit.ts`, separate from the existing `api/rsvp.ts` lookup endpoint.

**Rationale**: Lookup (`/api/rsvp`) and submit (`/api/rsvp-submit`) have different request shapes and different future evolution paths (lookup will stay read-only against the Sheet; submit will eventually write). Separating them avoids a method-dispatch pattern in a single function and keeps each function focused.

**Alternatives considered**:
- Reuse `/api/rsvp` with a `POST` body field to distinguish action — rejected; the existing endpoint already uses `POST` for lookup, creating ambiguity.
- Add a `PUT /api/rsvp` — rejected; Vercel function routing maps one file per path by convention.

---

## Decision 4: Zod validation on new endpoint

**Decision**: Use Zod to validate the request body in `api/rsvp-submit.ts`, consistent with the constitution's locked stack.

**Rationale**: The constitution mandates Zod for schema-first validation. The new endpoint has two fields (`guest_name: string`, `attending: boolean`); a minimal Zod schema costs three lines and provides type-safe parsing.

---

## Decision 5: Session state via React in-memory state (no sessionStorage)

**Decision**: The `rsvp-submitted` state (post-submission confirmation) is held only in React component memory. No sessionStorage entry is written.

**Rationale**: Per the clarified spec, a page refresh or new QR scan should show the fresh lookup form — which is exactly what happens when React state resets. No additional sessionStorage logic needed.
