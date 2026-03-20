# Research: RSVP Lookup Screen

## Decision: Form Validation Library

**Decision**: Install `react-hook-form` now, even though this is a dummy screen.

**Rationale**: The constitution locks `react-hook-form` as the form management
layer for this project. Introducing it here on a 2-field form is low-risk and
means the real RSVP form (with dynamic plus-one fields via `useFieldArray`) is
built on the same foundation. Switching later would require rewriting this screen.

**Alternatives considered**: Plain HTML5 `required` + React state (rejected — the
constitution has already made this decision; deferring it creates throwaway work).

**Setup**: `npm install react-hook-form`

---

## Decision: View Navigation (State vs Router)

**Decision**: Manage the landing ↔ RSVP switch with a single piece of React state
in `App.tsx` (`'landing' | 'rsvp-lookup'`). No routing library.

**Rationale**: There are only two screens right now. Adding React Router for two
views would be over-engineering (Principle IV). State-based navigation is trivially
replaceable with a router later if the app grows.

**Alternatives considered**: React Router v7 (rejected — premature for 2 screens;
revisit when auth/deep-linking is needed).

---

## Decision: RSVP Button in Nav

**Decision**: Pass an `onRsvpClick` callback prop into `Nav`. `App.tsx` owns the
view state and passes the setter down.

**Rationale**: `Nav` is a presentational component; it should not own navigation
state. This keeps the component boundary clean and avoids prop-drilling problems
at this scale.

---

## Decision: Stub Response on Valid Submit

**Decision**: On valid submission, replace the form with a simple inline message:
*"Thanks — we'll look you up shortly!"* (placeholder copy, clearly not real).

**Rationale**: Minimal, honest, and clearly a placeholder. The real behaviour
(lookup result) will replace this in the backend integration feature.

---

## Decision: No Tests

**Decision**: No automated tests for this feature.

**Rationale**: Not requested in the spec. UI skeleton verified manually via
Vercel preview (QA by product owner).
