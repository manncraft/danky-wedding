# API Contract: RSVP Lookup

**Endpoint**: `POST /api/rsvp`
**Version**: stub (canned data)
**Feature**: 003-rsvp-backend-stub

---

## Request

**Method**: `POST`
**Path**: `/api/rsvp`
**Content-Type**: `application/json`

### Body

```json
{
  "name": "Jane Smith"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Raw name as typed by the guest. Non-empty after trim. |

---

## Response

**Content-Type**: `application/json`

### 200 OK — match(es) found

```json
{
  "status": "found",
  "matches": [
    { "full_name": "Jane Smith", "max_guests": 3 },
    { "full_name": "John Smith", "max_guests": 1 }
  ]
}
```

### 200 OK — no match

```json
{
  "status": "not_found",
  "matches": []
}
```

**Note**: A "not found" result is a valid, successful response — not an error. The HTTP status is `200` in both cases.

### 400 Bad Request — invalid input

Returned when `name` is missing or empty after trimming.

```json
{
  "error": "name is required"
}
```

### 405 Method Not Allowed

Returned for any method other than `POST`.

```json
{
  "error": "method not allowed"
}
```

### 500 Internal Server Error

Returned on unexpected failures.

```json
{
  "error": "internal server error"
}
```

---

## Matching Semantics

1. Input is normalised: trimmed, lowercased, diacritics stripped, non-alphanumeric characters (except spaces) removed.
2. If input contains a space, the last word is the last-name token; the first character of the first word is the first-initial token.
3. Last name is matched exactly (normalised). First initial is matched when present.
4. Single-word input matches on last name only.

**Examples**:

| Input | Matches |
|---|---|
| `"Jane Smith"` | All guests with normalised last name `"smith"` and first initial `"j"` |
| `"j smith"` | Same as above |
| `"Smith"` | All guests with normalised last name `"smith"` |
| `"josé garcía"` | Guests with normalised last name `"garcia"` and first initial `"j"` |
| `"unknown"` | Empty matches array; status `"not_found"` |

---

## Frontend Behaviour Contract

The frontend MUST handle all response states:

| State | Trigger | UI |
|---|---|---|
| Single match | `status: "found"`, `matches.length === 1` | Show guest name + party size; proceed to next step |
| Multiple matches | `status: "found"`, `matches.length > 1` | Show selectable list; guest taps their name |
| Not found | `status: "not_found"` | Show friendly "not found" message with prompt to try again |
| Backend error | HTTP 4xx/5xx or network failure | Show "something went wrong, please try again" — distinct from not-found |

---

## Future Evolution

This contract will be extended (not replaced) when the GAS integration is added:
- The request shape remains identical.
- The response shape remains identical.
- Only the backend implementation (canned data → live Google Sheets lookup) changes.
- Auth (shared secret) will be added as a required header or query parameter in the next iteration.
