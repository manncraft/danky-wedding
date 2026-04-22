# Data Model: RSVP Children Checkbox

**Branch**: `011-rsvp-children-checkbox` | **Date**: 2026-03-26

## Entities & Fields

### AttendanceFormData (frontend form state)

Extends the existing shape with one new optional field:

| Field | Type | Required | Notes |
|---|---|---|---|
| attending | `'true' \| 'false'` | yes | existing |
| dietary | `string` | no | existing |
| additionalGuests | `{ name: string; dietary?: string }[]` | yes | existing |
| bringingChildren | `boolean` | no | **NEW** — defaults to `false`; only relevant when `additionalGuests.length > 0` |

**Validation**: `bringingChildren` has no validation rule — it is an optional acknowledgement checkbox.

---

### RsvpSubmitRequest (Vercel function request payload)

Extends the existing shape with one new optional field:

| Field | Type | Required | Notes |
|---|---|---|---|
| attending | `boolean` | yes | existing |
| guests | `Guest[]` | yes | existing |
| bringing_children | `boolean` | no | **NEW** — `true` if checkbox was ticked; absent or `false` otherwise |

---

### RsvpRow (sheet row — one row per person)

Extends the existing 10-column shape with one new column:

| Column | Field | Type | Notes |
|---|---|---|---|
| 1 | timestamp | `string` | existing |
| 2 | guest_name | `string` | existing |
| 3 | attending | `'yes' \| 'no'` | existing |
| 4 | dietary | `string` | existing |
| 5 | type | `'Primary' \| 'Plus-One'` | existing |
| 6 | invite_source | `string` | existing |
| 7 | is_child | `string` | existing (reserved, currently empty) |
| 8 | age_range | `string` | existing (reserved, currently empty) |
| 9 | seating_needs | `string` | existing (reserved, currently empty) |
| 10 | safety_ack | `string` | existing (reserved, currently empty) |
| 11 | bringing_children | `string` | **NEW** — `'yes'` on primary guest row if ticked; `'no'` on primary guest row if unticked; `''` on plus-one rows |

**Rationale for column 11 placement**: `bringing_children` is a per-submission field. Only the primary guest's row receives `'yes'` or `'no'`; all plus-one rows receive `''` to avoid ambiguity.

---

## State Transitions

### Checkbox visibility

```
additionalGuests.length === 0  →  checkbox HIDDEN, value reset to false
additionalGuests.length >= 1   →  checkbox VISIBLE
```

### Safety message visibility

```
bringingChildren === false  →  safety message HIDDEN
bringingChildren === true   →  safety message VISIBLE
```

### Value reset on guest removal

```
fields.length drops to 0  →  setValue('bringingChildren', false) via useEffect
```

---

## Sheet Impact

- GAS `doPost` handler updated from 10-column writes to 11-column writes.
- Header row (written only on first-ever sheet write) updated to include `'bringing_children'` as the 11th header.
- Existing rows in the sheet are unaffected (Google Sheets handles ragged rows gracefully).
