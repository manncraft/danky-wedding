# Contract: GAS Web App Endpoint

**Consumer**: Vercel `/api/rsvp` serverless function (server-side only — never the browser)
**Provider**: Google Apps Script web app (`gas/guest-lookup.gs`)

---

## Request

```
GET {GAS_ENDPOINT_URL}?secret={GAS_SECRET}
```

| Parameter | Location | Required | Description |
|---|---|---|---|
| `secret` | Query string | Yes | Must match the `GUEST_SECRET` script property set in GAS |

No request body. No special headers required.

---

## Response

**HTTP status**: Always `200 OK` (GAS limitation — errors are signalled in the body)

**Content-Type**: `application/json`

### Success

```json
{
  "guests": [
    { "full_name": "Alice Johnson", "max_guests": 2 },
    { "full_name": "María García", "max_guests": 4 }
  ]
}
```

- `guests` is always an array (never null on success)
- Array may be empty `[]` if the `Invites` sheet has no data rows
- `full_name` is the raw sheet value (trimmed of leading/trailing whitespace by GAS)
- `max_guests` is a positive integer; GAS defaults to `1` for blank/non-numeric cells

### Failure

```json
{ "error": "unauthorised" }
{ "error": "Sheet \"Invites\" not found" }
{ "error": "failed to read sheet: <message>" }
```

- The `error` key is present and the `guests` key is absent on all failure paths
- HTTP status is still `200`

---

## Error Detection (Vercel function responsibility)

The Vercel function MUST treat the GAS call as failed if ANY of these are true:

1. The HTTP fetch throws (network error, DNS failure, TCP timeout)
2. The response body contains an `error` key
3. The response body `guests` field is absent or `null`

Either condition alone triggers a `502` response to the browser.

---

## Authentication

| Secret | Where stored | Never appears in |
|---|---|---|
| `GAS_SECRET` (Vercel env) | Vercel environment variables | Client code, repo, browser requests |
| `GUEST_SECRET` (GAS property) | GAS Script Properties | Repo, client code, any log output |

These two names refer to the same value — `GAS_SECRET` is the Vercel-side name, `GUEST_SECRET` is the GAS-side name. They must match.

---

## Timeout

The Vercel function enforces a timeout via `GAS_TIMEOUT_MS` (default `6000` ms). If the GAS fetch does not complete within this window, the request is aborted and the function returns a `502` to the browser.
