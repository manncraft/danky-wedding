# Quickstart: RSVP Backend Stub

**Feature**: 003-rsvp-backend-stub
**Last updated**: 2026-03-20

---

## Prerequisites

- Node.js 18+
- Vercel CLI installed globally: `npm install -g vercel`
- Logged in to Vercel: `vercel login`

---

## Running Locally

Because this feature adds a Vercel serverless function, the local dev command changes from `npm run dev` to `vercel dev`.

```bash
vercel dev
```

This starts a single server at `http://localhost:3000` that:
- Serves the Vite frontend (with hot reload)
- Routes `POST /api/rsvp` to the serverless function handler
- Simulates the Vercel production routing environment

> **Note**: `npm run dev` (Vite only) will not serve the function. Use `vercel dev` when developing or testing the RSVP lookup flow.

---

## Testing the Endpoint Manually

```bash
# Single match
curl -X POST http://localhost:3000/api/rsvp \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice Johnson"}'

# Multiple matches (shared surname)
curl -X POST http://localhost:3000/api/rsvp \
  -H "Content-Type: application/json" \
  -d '{"name": "J Smith"}'

# Not found
curl -X POST http://localhost:3000/api/rsvp \
  -H "Content-Type: application/json" \
  -d '{"name": "Nobody Here"}'

# Validation error (empty name)
curl -X POST http://localhost:3000/api/rsvp \
  -H "Content-Type: application/json" \
  -d '{"name": ""}'
```

---

## Project Structure (this feature)

```text
api/
└── rsvp.ts              ← Vercel serverless function (POST /api/rsvp)

src/
├── types/
│   └── rsvp.ts          ← Shared TypeScript types (GuestRecord, LookupResponse)
├── services/
│   └── rsvpApi.ts       ← Frontend API client (calls POST /api/rsvp)
└── components/
    └── RsvpLookup.tsx   ← Updated: replaces stub with real API call + 3 UI states
```

---

## Key Behaviours to Verify Manually

1. Enter "Alice Johnson" → single result shown with party size
2. Enter "J Smith" → two results listed; tap one to select
3. Enter "Unknown Person" → "not found" message (not an error)
4. Submit empty form → inline validation error, no API call made
5. (Simulate error) Temporarily break the function → "try again" error message shown, not "not found"
