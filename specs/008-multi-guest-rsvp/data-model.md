# Data Model: Multi-Guest RSVP

**Branch**: `008-multi-guest-rsvp` | **Date**: 2026-03-20

## Entities

### Guest (new)

A single person in the RSVP submission. Both the primary guest and any additional party members are represented as `Guest` records in the same array.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | `string` | Yes | Full name; required for all guests (primary and plus-ones) |
| `dietary` | `string` | No | Free-text dietary requirements; empty string treated as no requirements |
| `type` | `'primary' \| 'plus-one'` | Yes | Distinguishes the submitting guest from additional party members |

**Constraints**:
- Exactly one `Guest` with `type: 'primary'` per submission (always index 0)
- At most `max_guests - 1` guests with `type: 'plus-one'`
- `name` is required for all guests; plus-one names are not validated against the guest list

---

### RsvpSubmitRequest (updated — API request payload)

Sent from client to `POST /api/rsvp-submit`.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `attending` | `boolean` | Yes | Applies to the whole party; `false` = declining |
| `guests` | `Guest[]` | Yes | Always at least one element (the primary guest). Additional guests present only when `attending: true`. |

**Validation rules**:
- `attending`: boolean
- `guests`: non-empty array; `guests[0].type` must be `'primary'`; `guests[0].name` must be non-empty
- `guests[1..].type` must be `'plus-one'`; `name` must be non-empty; not validated against guest list
- Array length must not exceed `max_guests` (client-enforced via button visibility; advisory in stub)
- When `attending: false`, `guests` contains only the primary guest element

---

### AttendanceFormData (updated — frontend form state)

The react-hook-form state shape for the attendance step.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `attending` | `'true' \| 'false'` | Yes | Radio button value as string |
| `dietary` | `string` | No | Primary guest's dietary requirements |
| `additionalGuests` | `{ name: string; dietary?: string }[]` | No | Managed by `useFieldArray`; cleared when declining; `name` required per element |

**State transitions**:
- `attending` changes `'true' → 'false'`: `additionalGuests` array cleared via `replace([])`
- `attending` changes `'false' → 'true'`: array starts empty; "Add Guest" button appears if `max_guests > 1`
- "Add Guest" clicked: `append({ dietary: '' })`
- Trash-can clicked on index `i`: `remove(i)`

**Serialisation to RsvpSubmitRequest**:

```
attending        → attending (boolean)
dietary          → guests[0].dietary
additionalGuests → guests[1..] with type: 'plus-one'
guest.full_name  → guests[0].name
```

---

### MatchedGuest (existing — unchanged)

| Field | Type | Notes |
|-------|------|-------|
| `full_name` | `string` | Guest's full name from Invites sheet |
| `max_guests` | `number` | Maximum party size; drives Add Guest button visibility |

---

## Relationships

```
MatchedGuest (1) ──── provides max_guests ───→ AttendanceFormData.additionalGuests (0..max_guests-1)
AttendanceFormData ──── serialises to ───→ RsvpSubmitRequest
RsvpSubmitRequest.guests (1..max_guests) ──── contains ───→ Guest
```

---

## Sheet row mapping (future GAS integration)

Each `Guest` in `guests[]` maps to one row in the `RSVPs` sheet:

| Sheet column | Source |
|---|---|
| `guest_name` | `guest.name` (all guests) |
| `dietary` | `guest.dietary` |
| `type` | `guest.type` (`'primary'` → "Primary", `'plus-one'` → "Plus-One") |
| `invite_source` | `guests[0].name` (primary guest name, same for all rows in the submission) |
| `attending` | top-level `attending` field |
| `timestamp` | server-generated at write time |
