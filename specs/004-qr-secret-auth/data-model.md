# Data Model: QR Code Secret Validation

**Feature**: 004-qr-secret-auth
**Date**: 2026-03-20

---

## Entities

### Invite Secret (server-side only)

A single scalar value stored in server-side configuration. Never sent to the client.

| Attribute | Description |
|---|---|
| Value | Random alphanumeric string, minimum 16 characters |
| Storage | Server-side environment variable (`INTERNAL_SECRET`) |
| Scope | Shared across all guests — one value for the entire event |
| Expiry | None; remains valid until manually rotated |

---

### Session Access State (client-side)

The frontend's in-memory and sessionStorage representation of whether the current session has a valid secret.

| Attribute | Type | Description |
|---|---|---|
| `secret` | `string \| null` | The raw secret value read from the URL, or `null` if not present |
| `source` | `"url" \| "session"` | Whether the secret was read from the current URL or restored from sessionStorage |

**State transitions**:
1. Page loads → read `?s=` from URL → if found, store in `sessionStorage` and set `secret`
2. Page loads → no `?s=` in URL → check `sessionStorage` → if found, restore `secret`
3. Page loads → neither URL nor `sessionStorage` → `secret = null` → show gate screen
4. Backend returns 401 → treat as invalid secret → show gate screen (clear `sessionStorage`)

---

## Request / Response Changes to Existing Contract

This feature adds a required header to the existing `POST /api/rsvp` contract.

### Modified: `POST /api/rsvp`

**New required header**:

| Header | Value | Required |
|---|---|---|
| `X-Invite-Secret` | The invite secret from the guest's QR code link | Yes |

**New error response (401)**:

```json
{ "error": "unauthorised" }
```

The 401 response is returned when:
- `X-Invite-Secret` header is absent
- `X-Invite-Secret` value does not match `INTERNAL_SECRET`

All other existing request/response behaviour (body, 200/400/405 responses) is unchanged.
