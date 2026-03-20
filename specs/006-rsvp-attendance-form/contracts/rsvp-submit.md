# API Contract: POST /api/rsvp-submit

**Feature**: 006-rsvp-attendance-form
**Date**: 2026-03-20
**Status**: Stub (no persistence)

---

## Endpoint

```
POST /api/rsvp-submit
```

---

## Authentication

All requests must include the invite secret in the `X-Invite-Secret` header (same mechanism as `POST /api/rsvp`). The value must match the `INTERNAL_SECRET` environment variable on Vercel.

| Header | Required | Description |
|--------|----------|-------------|
| `X-Invite-Secret` | Yes | Invite secret extracted from QR code URL param |
| `Content-Type` | Yes | Must be `application/json` |

---

## Request Body

```json
{
  "guest_name": "Jane Smith",
  "attending": true
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `guest_name` | string | Yes | Non-empty; full name as returned by the lookup |
| `attending` | boolean | Yes | `true` = attending, `false` = not attending |

---

## Responses

### 200 OK — Submission accepted

```json
{ "status": "ok" }
```

*Note*: In this stub iteration, the decision is not persisted. The 200 response confirms the backend received and accepted the payload.

### 400 Bad Request — Invalid body

```json
{ "error": "Invalid request body" }
```

Returned when `guest_name` is missing/empty or `attending` is not a boolean.

### 401 Unauthorized — Missing or invalid secret

```json
{ "error": "Unauthorized" }
```

Returned when `X-Invite-Secret` is absent or does not match `INTERNAL_SECRET`.

### 405 Method Not Allowed

Returned for any method other than `POST`.

---

## Example (fetch)

```typescript
const response = await fetch('/api/rsvp-submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Invite-Secret': secret,
  },
  body: JSON.stringify({ guest_name: 'Jane Smith', attending: true }),
})
```

---

## Future Evolution

When persistence is added (future feature), this endpoint will write a row to the `RSVPs` Google Sheet via GAS. The request and response contract will remain unchanged; only the backend implementation changes.
