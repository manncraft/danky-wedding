# Contract: POST /api/rsvp-submit

**Version**: 2.0.0 (extends v1.0.0 from 009-rsvp-sheet-persistence)
**Changed**: Added `bringing_children` optional field

## Request

**Method**: POST
**Path**: `/api/rsvp-submit`
**Headers**:
- `Content-Type: application/json`
- `X-Invite-Secret: {secret}` — required; the shared invite secret from the QR URL

**Body**:

```json
{
  "attending": true,
  "guests": [
    { "name": "Alice Smith", "type": "primary", "dietary": "vegan" },
    { "name": "Bob Smith", "type": "plus-one" }
  ],
  "bringing_children": true
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `attending` | boolean | yes | Whether the primary guest is attending |
| `guests` | array | yes | At least one guest; first must be `type: "primary"` |
| `guests[].name` | string | yes | Non-empty guest name |
| `guests[].type` | `"primary" \| "plus-one"` | yes | Guest classification |
| `guests[].dietary` | string | no | Dietary requirements |
| `bringing_children` | boolean | no | True if any plus-ones are children; absent or false otherwise |

**Validation rules**:
- `attending` must be boolean
- `guests` must be non-empty array
- `guests[0].type` must be `"primary"`
- All `guests[].name` must be non-empty strings
- `bringing_children` is optional; defaults to `false` if absent

## Response

**200 OK**:
```json
{ "status": "ok" }
```

**400 Bad Request**:
```json
{ "error": "Invalid request body" }
```

**401 Unauthorized**:
```json
{ "error": "Unauthorized" }
```

**500 Internal Server Error**:
```json
{ "error": "Failed to save RSVP" }
```

## Sheet Row Mapping

`bringing_children` is written to column 11 of the RSVPs sheet:
- Primary guest row: `'yes'` if `bringing_children === true`, `'no'` if `false`
- Plus-one rows: `''` (empty — field is per-submission, not per-person)
