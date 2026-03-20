# Contract: POST /api/rsvp-submit

**Branch**: `007-dietary-requirements` | **Date**: 2026-03-20

## Change Summary

One optional field (`dietary`) added to the request body. All existing fields and behaviour unchanged.

---

## Request

**Method**: `POST`
**Path**: `/api/rsvp-submit`

### Headers

| Header | Value | Required |
|---|---|---|
| `Content-Type` | `application/json` | Yes |
| `X-Invite-Secret` | `<invite secret>` | Yes |

### Body

```json
{
  "guest_name": "Jane Smith",
  "attending": true,
  "dietary": "vegetarian, no nuts"
}
```

| Field | Type | Required | Rules |
|---|---|---|---|
| `guest_name` | string | Yes | Non-empty after trim |
| `attending` | boolean | Yes | Must be boolean |
| `dietary` | string | No | Optional; trimmed server-side; only meaningful when `attending` is `true`; omit or pass `""` when not attending |

---

## Responses

### 200 OK — submission accepted

```json
{ "status": "ok" }
```

### 400 Bad Request — validation failure

```json
{ "error": "<reason>" }
```

Possible reasons (existing + new):
- `"guest_name is required"` — missing or empty after trim
- `"attending must be a boolean"` — wrong type
- `"dietary must be a string"` — `dietary` present but not a string *(new)*

### 401 Unauthorized — bad or missing secret

```json
{ "error": "unauthorised" }
```

---

## Backwards Compatibility

- `dietary` is optional — existing callers that omit it continue to work without change.
- The response shape is unchanged.
