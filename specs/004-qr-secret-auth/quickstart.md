# Quickstart: QR Code Secret Validation

**Feature**: 004-qr-secret-auth
**Last updated**: 2026-03-20

---

## Prerequisites

- `vercel dev` workflow already set up (see `003-rsvp-backend-stub/quickstart.md`)
- Vercel CLI installed and logged in

---

## Local Setup

1. Create `.env.local` in the project root (already git-ignored):

   ```
   INTERNAL_SECRET=dev-secret-local-only
   ```

   Use any value for local development. The real secret (set in Vercel dashboard) must be a random 16+ character string.

2. Start the dev server:

   ```bash
   vercel dev
   ```

---

## Generating a Production Secret

When deploying to Vercel, set `INTERNAL_SECRET` in the Vercel dashboard (Settings → Environment Variables). Use a securely random value:

```bash
# Generate a suitable secret (run once, save the output):
node -e "console.log(require('crypto').randomBytes(20).toString('hex'))"
```

Set this value in Vercel for Production, Preview, and Development environments.

---

## QR Code Link Format

The invite links embedded in printed QR codes must include the secret as a query parameter:

```
https://your-domain.vercel.app/?s=<INTERNAL_SECRET value>
```

Example (with placeholder secret):
```
https://danky-wedding.vercel.app/?s=a3f9c2e8b1d047e6a5f2c39d8b0e1472
```

---

## Testing the Validation Manually

### Valid secret (happy path)

```bash
# With correct secret
curl -X POST http://localhost:3000/api/rsvp \
  -H "Content-Type: application/json" \
  -H "X-Invite-Secret: dev-secret-local-only" \
  -d '{"name": "Alice Johnson"}'
# Expected: 200 with match
```

### Missing secret → 401

```bash
curl -X POST http://localhost:3000/api/rsvp \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice Johnson"}'
# Expected: 401 {"error":"unauthorised"}
```

### Wrong secret → 401

```bash
curl -X POST http://localhost:3000/api/rsvp \
  -H "Content-Type: application/json" \
  -H "X-Invite-Secret: wrong-value" \
  -d '{"name": "Alice Johnson"}'
# Expected: 401 {"error":"unauthorised"}
```

### Frontend: no secret in URL

Open `http://localhost:3000` (no `?s=` param).
Expected: "Use your invite" gate screen — RSVP form not accessible.

### Frontend: valid secret in URL

Open `http://localhost:3000/?s=dev-secret-local-only`.
Expected: Normal RSVP lookup screen visible.

### Frontend: refresh with secret still in URL

1. Open `http://localhost:3000/?s=dev-secret-local-only`
2. Refresh the page
3. Expected: Still on RSVP screen — secret restored from `sessionStorage`
