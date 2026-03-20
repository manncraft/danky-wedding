# API Contract: RSVP Lookup (v2 — with Secret Validation)

**Endpoint**: `POST /api/rsvp`
**Version**: stub + secret auth
**Feature**: 004-qr-secret-auth
**Supersedes**: `003-rsvp-backend-stub/contracts/rsvp-lookup.md`

---

## Request

**Method**: `POST`
**Path**: `/api/rsvp`
**Content-Type**: `application/json`

### Headers

| Header | Required | Description |
|---|---|---|
| `Content-Type` | Yes | Must be `application/json` |
| `X-Invite-Secret` | Yes | The invite secret from the guest's QR code URL parameter |

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

## Responses

### 200 OK — match(es) found

```json
{
  "status": "found",
  "matches": [
    { "full_name": "Jane Smith", "max_guests": 3 }
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

### 400 Bad Request — invalid input

```json
{ "error": "name is required" }
```

### 401 Unauthorised — missing or invalid secret

```json
{ "error": "unauthorised" }
```

Returned when `X-Invite-Secret` is absent, empty, or does not match the configured secret. The response body deliberately reveals no information about what is wrong.

### 405 Method Not Allowed

```json
{ "error": "method not allowed" }
```

### 500 Internal Server Error

```json
{ "error": "internal server error" }
```

---

## Validation Order

The backend MUST validate in this order:

1. Method check → 405 if not POST
2. Secret check → 401 if `X-Invite-Secret` missing or invalid
3. Body validation → 400 if `name` missing or empty
4. Lookup → 200 with `found` or `not_found`

Secret validation MUST occur before any business logic to prevent data leakage to unauthorised callers.

---

## Frontend Behaviour Contract

| State | Trigger | UI |
|---|---|---|
| Valid secret, found | `status: "found"` | Show match(es) |
| Valid secret, not found | `status: "not_found"` | Show "not found" message |
| No secret on page load | `secret === null` at mount | Show "use your invite" gate screen — do not render the lookup form |
| 401 from backend | HTTP 401 response | Show "use your invite" gate screen — same as no-secret state, clear sessionStorage |
| Other backend error | HTTP 4xx/5xx (non-401) | Show "something went wrong, try again" |

The "use your invite" message (401 and no-secret states) MUST be visually distinct from the general error message.

---

## QR Code URL Format

The invite link embedded in each QR code follows this pattern:

```
https://<domain>/?s=<secret>
```

The `s` query parameter carries the secret. The frontend reads this on page load.
