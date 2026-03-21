# Data Model: RSVP Sheet Persistence

**Feature**: 009-rsvp-sheet-persistence | **Date**: 2026-03-21

---

## Entities

### RsvpRow

One row written to the RSVPs Google Sheet. Represents a single person (primary guest or plus-one).

| Field | Type | Values | Source | Notes |
|---|---|---|---|---|
| `timestamp` | string (ISO 8601) | e.g. `"2026-03-21T14:32:00.000Z"` | Vercel function, at submission time | Same value for all rows in one submission |
| `guest_name` | string | Non-empty | `guests[n].name` from request | |
| `attending` | string | `"yes"` / `"no"` | `attending` boolean → string | Same value for all rows in one submission |
| `dietary` | string | Free text or `""` | `guests[n].dietary ?? ""` | Empty string when not provided |
| `type` | string | `"Primary"` / `"Plus-One"` | `guests[n].type` (capitalised) | |
| `invite_source` | string | Non-empty | `guests[0].name` (primary guest) | Same for all rows in one submission |
| `is_child` | string | `""` (this iteration) | Deferred | Future feature will populate |
| `age_range` | string | `""` (this iteration) | Deferred | Future feature will populate |
| `seating_needs` | string | `""` (this iteration) | Deferred | Future feature will populate |
| `safety_ack` | string | `""` (this iteration) | Deferred | Future feature will populate |

**Column order in sheet** (fixed, left-to-right):
`timestamp` → `guest_name` → `attending` → `dietary` → `type` → `invite_source` → `is_child` → `age_range` → `seating_needs` → `safety_ack`

---

### GasWriteRequest

Payload POSTed from the Vercel function to the GAS web app.

```json
{
  "secret": "<GAS_SECRET>",
  "rows": [
    {
      "timestamp": "2026-03-21T14:32:00.000Z",
      "guest_name": "Alice Johnson",
      "attending": "yes",
      "dietary": "vegetarian",
      "type": "Primary",
      "invite_source": "Alice Johnson",
      "is_child": "",
      "age_range": "",
      "seating_needs": "",
      "safety_ack": ""
    },
    {
      "timestamp": "2026-03-21T14:32:00.000Z",
      "guest_name": "Bob Smith",
      "attending": "yes",
      "dietary": "",
      "type": "Plus-One",
      "invite_source": "Alice Johnson",
      "is_child": "",
      "age_range": "",
      "seating_needs": "",
      "safety_ack": ""
    }
  ]
}
```

**Constraints**:
- `secret` must be present and match `GAS_SECRET` script property
- `rows` must be a non-empty array
- Every row must have all 10 fields (empty string for deferred, never `null` or `undefined`)
- All rows in one request share the same `timestamp` and `invite_source`

---

### GasWriteResponse

JSON body returned by the GAS `doPost` handler. HTTP status is always 200 (GAS limitation).

**Success**:
```json
{ "status": "ok", "rowsWritten": 2 }
```

**Error**:
```json
{ "error": "unauthorised" }
{ "error": "invalid payload" }
{ "error": "Sheet write failed: <message>" }
```

---

## Flattening Rules

The Vercel function transforms the incoming `RsvpSubmitRequest` into `RsvpRow[]` before calling GAS:

```
RsvpSubmitRequest { attending: boolean, guests: Guest[] }
  → if attending = false  →  [primary row only, attending="no"]
  → if attending = true   →  [primary row, ...plus-one rows], attending="yes" on all
```

- `invite_source` = `guests[0].name` on every row
- `type`: `guests[0].type === 'primary'` → `"Primary"`, else `"Plus-One"` (capitalised)
- `attending`: boolean → `"yes"` / `"no"` string (human-readable in sheet)
- `timestamp`: `new Date().toISOString()` set once at start of Vercel function, reused for all rows

---

## Google Sheets Layout

### Invites sheet (unchanged)

| A | B |
|---|---|
| Full Name | Max Guests |
| Alice Johnson | 2 |
| ... | ... |

### RSVPs sheet (new)

| timestamp | guest_name | attending | dietary | type | invite_source | is_child | age_range | seating_needs | safety_ack |
|---|---|---|---|---|---|---|---|---|---|
| 2026-03-21T14:32:00Z | Alice Johnson | yes | vegetarian | Primary | Alice Johnson | | | | |
| 2026-03-21T14:32:00Z | Bob Smith | yes | | Plus-One | Alice Johnson | | | | |
| 2026-03-21T15:10:00Z | Carol White | no | | Primary | Carol White | | | | |

**Notes**:
- Row 1 is the header row (created automatically by GAS if absent)
- Rows are append-only; no row is ever modified or deleted
- A declined guest (row 3 above) produces exactly one row
