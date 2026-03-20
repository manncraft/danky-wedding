# Data Model: RSVP Attendance Form

**Branch**: `006-rsvp-attendance-form` | **Date**: 2026-03-20

No persistent storage is introduced in this feature. This document captures the new in-flight payload types and view state additions.

---

## New TypeScript Types (`src/types/rsvp.ts`)

### `RsvpSubmitRequest`

The payload sent from the frontend to `POST /api/rsvp-submit`.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `guest_name` | `string` | Non-empty | Full name as returned by the lookup |
| `attending` | `boolean` | Required | `true` = attending, `false` = not attending |

```typescript
interface RsvpSubmitRequest {
  guest_name: string
  attending: boolean
}
```

### `RsvpSubmitResponse`

The response from `POST /api/rsvp-submit` on success.

| Field | Type | Notes |
|-------|------|-------|
| `status` | `'ok'` | Always `'ok'` in this stub iteration |

```typescript
interface RsvpSubmitResponse {
  status: 'ok'
}
```

---

## Updated `ViewState` (`src/components/RsvpLookup.tsx`)

One new variant added to the existing discriminated union:

```typescript
type ViewState =
  | { kind: 'form' }
  | { kind: 'loading' }
  | { kind: 'select'; matches: MatchedGuest[] }
  | { kind: 'confirmed'; guest: MatchedGuest }          // ← existing; now renders attendance form
  | { kind: 'not_found' }
  | { kind: 'error' }
  | { kind: 'rsvp-submitted'; guest: MatchedGuest; attending: boolean }  // ← NEW
```

### State Transitions

```
form → loading → select → confirmed → (submitting) → rsvp-submitted
                        ↘ confirmed  (single match, no select step)
```

- `confirmed`: displays matched guest name + attendance form (Attending / Not Attending)
- `rsvp-submitted`: displays inline confirmation with guest name and decision; no further transitions in this iteration

### Session Lifecycle

- All states are in-memory React state
- Page refresh resets state to `form` (fresh lookup)
- `rsvp-submitted` state persists only within the current React session (no sessionStorage)

---

## Existing Types (unchanged)

```typescript
// Carried forward from 003/005 — no changes
interface MatchedGuest {
  full_name: string
  max_guests: number
}

interface LookupResponse {
  status: 'found' | 'not_found'
  matches: MatchedGuest[]
}
```
