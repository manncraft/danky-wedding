# Contract: GAS doPost — RSVP Write

**Layer**: Google Apps Script (`gas/guest-lookup.gs` — new `doPost` handler added)
**Caller**: Vercel function `api/rsvp-submit.ts` only (not called by browser directly)

---

## Overview

A new `doPost(e)` handler is added to the existing GAS script. It authenticates the caller, validates the payload, ensures the RSVPs sheet and header row exist, and writes all submitted rows atomically via a single `setValues()` call.

---

## Request

The GAS web app receives a standard HTTP POST. The body is a JSON string in `e.postData.contents`.

```json
{
  "secret": "<GAS_SECRET>",
  "rows": [
    {
      "timestamp":    "2026-03-21T14:32:00.000Z",
      "guest_name":   "Alice Johnson",
      "attending":    "yes",
      "dietary":      "vegetarian",
      "type":         "Primary",
      "invite_source":"Alice Johnson",
      "is_child":     "",
      "age_range":    "",
      "seating_needs":"",
      "safety_ack":   ""
    }
  ]
}
```

| Field | Type | Required | Rules |
|---|---|---|---|
| `secret` | string | yes | Must match `GUEST_SECRET` script property |
| `rows` | array | yes | 1–N items; order preserved in sheet |
| `rows[*].timestamp` | string | yes | ISO 8601; same value for all rows in request |
| `rows[*].guest_name` | string | yes | Non-empty |
| `rows[*].attending` | string | yes | `"yes"` or `"no"` |
| `rows[*].dietary` | string | yes | May be `""` |
| `rows[*].type` | string | yes | `"Primary"` or `"Plus-One"` |
| `rows[*].invite_source` | string | yes | Non-empty (primary guest name) |
| `rows[*].is_child` | string | yes | `""` in this iteration |
| `rows[*].age_range` | string | yes | `""` in this iteration |
| `rows[*].seating_needs` | string | yes | `""` in this iteration |
| `rows[*].safety_ack` | string | yes | `""` in this iteration |

---

## Response

HTTP status is always **200** (GAS limitation). Success vs error is determined by the response body.

### Success

```json
{ "status": "ok", "rowsWritten": 2 }
```

### Error — Unauthorised

```json
{ "error": "unauthorised" }
```

Returned when `secret` does not match `GUEST_SECRET` script property.

### Error — Invalid payload

```json
{ "error": "invalid payload" }
```

Returned when body cannot be parsed or `rows` is missing/empty.

### Error — Sheet write failure

```json
{ "error": "Sheet write failed: <detail>" }
```

Returned when the Sheets API call throws. The Vercel function treats any `error` field as a failure.

---

## GAS Handler Behaviour

```
doPost(e):
  1. Parse e.postData.contents as JSON
  2. Validate secret === PropertiesService.getScriptProperties().getProperty('GUEST_SECRET')
     → on mismatch: return { error: 'unauthorised' }
  3. Validate rows is a non-empty array
     → on invalid: return { error: 'invalid payload' }
  4. Get or create 'RSVPs' sheet
  5. If sheet has 0 rows: write header row
     ['timestamp','guest_name','attending','dietary','type','invite_source',
      'is_child','age_range','seating_needs','safety_ack']
  6. Build 2D array: rows.map(r => [r.timestamp, r.guest_name, r.attending,
       r.dietary, r.type, r.invite_source, r.is_child, r.age_range,
       r.seating_needs, r.safety_ack])
  7. sheet.getRange(lastRow + 1, 1, data.length, 10).setValues(data)
     → on exception: return { error: 'Sheet write failed: ' + e.message }
  8. return { status: 'ok', rowsWritten: rows.length }
```

---

## CORS

The GAS web app is called only from the Vercel serverless function (server-to-server). No CORS headers are required on the GAS side; CORS is handled by the Vercel proxy for browser requests (as per Constitution Principle III).

---

## Script Properties

| Property | Used for |
|---|---|
| `GUEST_SECRET` | Authenticates both `doGet` (guest lookup) and `doPost` (RSVP write) |

No new script properties required.
