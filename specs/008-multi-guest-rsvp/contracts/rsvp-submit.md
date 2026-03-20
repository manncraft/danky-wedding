# Contract: POST /api/rsvp-submit

**Feature**: 008-multi-guest-rsvp (replaces 006/007 baseline)
**Date**: 2026-03-20

## Overview

Accepts an RSVP submission for a guest party as a flat array of guests. All guests — primary and additional — are represented uniformly. Returns a stub success response. No persistence in this iteration.

## Request

**Method**: `POST`
**Path**: `/api/rsvp-submit`

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Content-Type` | Yes | `application/json` |
| `X-Invite-Secret` | Yes | Shared invite secret from QR code / sessionStorage |

### Body

```json
{
  "attending": true,
  "guests": [
    { "name": "Alice Johnson", "dietary": "vegetarian", "type": "primary" },
    { "dietary": "nut allergy", "type": "plus-one" },
    { "dietary": "", "type": "plus-one" }
  ]
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `attending` | `boolean` | Yes | `true` = attending; `false` = declining. Applies to the whole party. |
| `guests` | `object[]` | Yes | Non-empty array. Always contains at least the primary guest at index 0. |
| `guests[].name` | `string` | Yes | Full name. Required for all guests. Plus-one names are not validated against the guest list. |
| `guests[].dietary` | `string` | No | Dietary requirements. Omit or empty string if none. |
| `guests[].type` | `'primary' \| 'plus-one'` | Yes | Exactly one `'primary'` at index 0; all others `'plus-one'`. |

**Constraints**:
- `guests[0].type` must be `'primary'`
- When `attending: false`, `guests` contains only the primary guest (no plus-ones)
- Array length must not exceed the invitation's `max_guests`

### Not-attending example

```json
{
  "attending": false,
  "guests": [
    { "name": "Bob Smith", "type": "primary" }
  ]
}
```

### Single guest, attending, no dietary

```json
{
  "attending": true,
  "guests": [
    { "name": "Carol White", "type": "primary" }
  ]
}
```

## Validation notes

- `guests[].name` is required for **all** guests including plus-ones; server returns 400 if any `name` is missing or empty
- Plus-one names are accepted as-is — no lookup against the Invites sheet is performed

## Response

### 200 OK

```json
{ "status": "ok" }
```

Returned for all valid requests (stub — no persistence in this iteration).

### 400 Bad Request

```json
{ "error": "guests[0].name is required" }
```

Returned when required fields are missing or types are wrong.

### 401 Unauthorized

```json
{ "error": "Unauthorized" }
```

Returned when `X-Invite-Secret` header is absent or does not match the server-side secret.

### 405 Method Not Allowed

Returned for non-POST requests.

## Changelog

| Version | Feature | Change |
|---------|---------|--------|
| 006 | 006-rsvp-attendance-form | Initial stub: `{ guest_name, attending }` |
| 007 | 007-dietary-requirements | Added top-level `dietary` field |
| 008 | 008-multi-guest-rsvp | **Breaking**: replaced top-level fields with flat `guests[]` array; `attending` remains top-level |
