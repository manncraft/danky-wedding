# Data Model: RSVP Backend Stub

**Feature**: 003-rsvp-backend-stub
**Date**: 2026-03-20

---

## Entities

### GuestRecord

Represents a single invited guest as stored in the canned data set.

| Field | Type | Description | Constraints |
|---|---|---|---|
| `full_name` | string | Guest's display name (original casing) | Non-empty; used for display only |
| `normalised_name` | string | Pre-normalised form for matching | Lowercase, diacritics stripped, non-alphanumeric removed |
| `first_initial` | string | First character of first name, normalised | Single lowercase letter |
| `last_name_normalised` | string | Normalised last name | Lowercase, diacritics stripped |
| `max_guests` | number | Maximum number of people in this guest's party (including themselves) | Integer ≥ 1 |

**Notes**:
- `normalised_name`, `first_initial`, and `last_name_normalised` are derived at startup from `full_name` and stored alongside it to avoid re-computing on every request.
- `full_name` is the only field returned to the frontend; normalised fields are internal to the backend.

---

### LookupRequest

The payload sent from the frontend to `POST /api/rsvp`.

| Field | Type | Description | Constraints |
|---|---|---|---|
| `name` | string | Raw name input as typed by the guest | Non-empty after trim |

---

### LookupResponse

The payload returned by `POST /api/rsvp`.

| Field | Type | Description |
|---|---|---|
| `status` | `"found"` \| `"not_found"` | Whether one or more records matched |
| `matches` | `MatchedGuest[]` | Array of matched guests; empty when `status = "not_found"` |

### MatchedGuest

A single item in the `LookupResponse.matches` array.

| Field | Type | Description |
|---|---|---|
| `full_name` | string | Guest's display name (original casing) |
| `max_guests` | number | Maximum party size for this guest |

---

## Canned Data Set Requirements

The static data set MUST include:

| Scenario | Example | Purpose |
|---|---|---|
| Unique last name | "Alice Johnson" (max 2) | Tests single-match path |
| Shared last name, different initial | "Jane Smith" (max 3), "John Smith" (max 1) | Tests multi-match / selectable list |
| No match | (not stored) | Tests not-found path via absence |

A minimum of 3 additional records of any variety is recommended to make the data feel realistic.

---

## Matching Rules

Given a raw input string from the guest:

1. **Normalise** the input (trim, lowercase, strip diacritics, strip non-alphanumeric except spaces, collapse spaces).
2. **Parse**: If the normalised input contains a space, split on the first space into `[inputFirstPart, ...inputLastParts]`. The last word(s) form the last-name token; the first character of `inputFirstPart` is the first-initial token.
3. **Match**:
   - Last name MUST match exactly (normalised comparison).
   - If a first-initial token is present, the guest's `first_initial` MUST equal that token.
   - If only a single word is provided (no space), match on last name alone.
4. Return all records that satisfy the match criteria.
