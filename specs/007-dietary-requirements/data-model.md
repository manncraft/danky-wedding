# Data Model: Add Dietary Requirements Field

**Branch**: `007-dietary-requirements` | **Date**: 2026-03-20

## Changed Entities

### RsvpSubmitRequest (extended)

Existing type in `src/types/rsvp.ts`. One field added:

| Field | Type | Required | Validation | Notes |
|---|---|---|---|---|
| `guest_name` | `string` | Yes | Non-empty after trim | Existing field |
| `attending` | `boolean` | Yes | Must be boolean | Existing field |
| `dietary` | `string` | No | Optional; trimmed server-side; omitted if attending is false | **New field** |

**TypeScript diff** (`src/types/rsvp.ts`):
```typescript
export interface RsvpSubmitRequest {
  guest_name: string
  attending: boolean
  dietary?: string   // NEW
}
```

---

### sessionStorage persisted value (`rsvp_result`)

The shape stored in sessionStorage after a successful RSVP submission:

| Field | Type | Notes |
|---|---|---|
| `guest` | `MatchedGuest` | Existing |
| `attending` | `boolean` | Existing |
| `dietary` | `string \| undefined` | **New** — stored so the confirmation page can reference it if needed in future |

No schema change to `MatchedGuest` itself.

---

## State Transitions

### Dietary field visibility

```
attending === 'true'  →  dietary field VISIBLE, value editable
attending === 'false' →  dietary field HIDDEN, value cleared to ''
(no attending selected) → dietary field HIDDEN
```

### Form submission payload

```
attending = true  → payload includes: { guest_name, attending: true, dietary: string | undefined }
attending = false → payload includes: { guest_name, attending: false }
                    (dietary field omitted entirely)
```

---

## No new persistence

The backend stub (`api/rsvp-submit.ts`) continues to return `{ status: 'ok' }` without writing to Google Sheets. The `dietary` value flows through the API layer and is available for the GAS integration (feature 005) to consume in a future iteration.
