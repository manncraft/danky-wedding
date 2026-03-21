# Contract: POST /api/rsvp-submit

**Layer**: Vercel Serverless Function (`api/rsvp-submit.ts`)
**Change type**: Behaviour change — existing endpoint, no interface change

---

## Overview

The endpoint interface is **unchanged**. This feature adds the sheet-write side-effect inside the existing handler. Callers do not need to update.

---

## Request

```
POST /api/rsvp-submit
Content-Type: application/json
X-Invite-Secret: <INTERNAL_SECRET>
```

```json
{
  "attending": true,
  "guests": [
    { "name": "Alice Johnson", "dietary": "vegetarian", "type": "primary" },
    { "name": "Bob Smith",     "dietary": "",            "type": "plus-one" }
  ]
}
```

| Field | Type | Required | Rules |
|---|---|---|---|
| `attending` | boolean | yes | `true` = attending, `false` = declining |
| `guests` | array | yes | Non-empty; first element must have `type = "primary"` |
| `guests[*].name` | string | yes | Non-empty |
| `guests[*].dietary` | string | no | Defaults to `""` |
| `guests[*].type` | `"primary"` \| `"plus-one"` | yes | Exactly one `"primary"` at index 0 |

---

## Responses

### 200 OK — Success

```json
{ "status": "ok" }
```

Sheet write completed; all rows persisted. Guest is navigated to confirmation screen by frontend.

### 400 Bad Request — Validation failure

```json
{ "error": "invalid request body" }
```

Returned for: missing `attending`, empty `guests`, missing `type`, empty name.

### 401 Unauthorised

```json
{ "error": "unauthorised" }
```

Returned when `X-Invite-Secret` header is missing or does not match `INTERNAL_SECRET`.

### 502 Bad Gateway — GAS write failure

```json
{ "error": "failed to save RSVP" }
```

Returned when the GAS endpoint returns an error or times out. The frontend must display a user-visible error message and preserve form contents so the guest can retry.

### 405 Method Not Allowed

Returned for non-POST requests.

---

## Side Effects (new in this feature)

After successful validation, the handler:

1. Generates a shared `timestamp` (`new Date().toISOString()`).
2. Flattens `guests` into `RsvpRow[]` per the rules in `data-model.md`.
3. POSTs `GasWriteRequest` to `GAS_ENDPOINT_URL` with a timeout of `GAS_TIMEOUT_MS`.
4. On GAS error or timeout → returns 502.
5. On GAS success → returns 200 `{ status: "ok" }`.

---

## Environment Variables (no changes)

| Variable | Used for |
|---|---|
| `INTERNAL_SECRET` | Validates `X-Invite-Secret` header |
| `GAS_ENDPOINT_URL` | GAS web app URL (doPost + doGet at same URL) |
| `GAS_SECRET` | Included in POST body to authenticate with GAS |
| `GAS_TIMEOUT_MS` | Abort timeout for GAS call (default 6000ms) |
