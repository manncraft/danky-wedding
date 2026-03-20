# Implementation Plan: QR Code Secret Validation

**Branch**: `004-qr-secret-auth` | **Date**: 2026-03-20 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/004-qr-secret-auth/spec.md`

## Summary

Add a shared-secret guard to the RSVP flow. The secret is embedded in every printed QR code as a URL query parameter (`?s=`). The frontend reads it on load, stores it in `sessionStorage`, and forwards it as an `X-Invite-Secret` header on every call to `POST /api/rsvp`. The backend validates the header against `INTERNAL_SECRET` (Vercel environment variable) and returns 401 for missing or incorrect values. Guests without a valid secret see a friendly "use your invite" screen instead of the RSVP form.

## Technical Context

**Language/Version**: TypeScript 5.9
**Primary Dependencies**: React 19, Vite 8, Tailwind CSS v4, react-hook-form 7, `@vercel/node`
**Storage**: `sessionStorage` (client-side, tab-scoped); Vercel Environment Variable (server-side)
**Testing**: Manual via `vercel dev` + curl
**Target Platform**: Vercel (Node.js serverless) + browser SPA
**Project Type**: Web application (SPA + serverless API)
**Performance Goals**: No measurable impact — secret check is a single string comparison
**Constraints**: Secret MUST NOT appear in client bundle, source control, or server logs
**Scale/Scope**: Same as 003 — ~100 wedding guests

## Constitution Check

| Principle | Status | Notes |
|---|---|---|
| I. Guest-First, Mobile-First UX | ✅ Pass | Valid-secret path is fully transparent to guests — zero extra steps. Gate screen is informational only. |
| II. Zero-Cost Serverless Architecture | ✅ Pass | No new infrastructure. `INTERNAL_SECRET` is a free Vercel env var. |
| III. Privacy & Security by Design | ✅ Pass | Secret stored as Vercel env var, not in source or bundle. Transmitted via header (not URL or body). 401 reveals nothing about why validation failed. |
| IV. MVP Discipline | ✅ Pass | Single shared secret, no per-guest tokens, no sessions, no rate limiting. Simplest adequate solution. |
| V. Admin Visibility & Data Integrity | ✅ Pass | Read-only feature — no writes. |

No violations. Complexity Tracking table not required.

## Project Structure

### Documentation (this feature)

```text
specs/004-qr-secret-auth/
├── plan.md                 ← This file
├── research.md             ← Phase 0 output
├── data-model.md           ← Phase 1 output
├── quickstart.md           ← Phase 1 output
├── contracts/
│   └── rsvp-lookup-v2.md  ← Updated API contract
└── tasks.md                ← Phase 2 output (/speckit.tasks — not yet created)
```

### Source Code Changes

```text
api/
└── rsvp.ts              ← Modified: add secret validation before business logic

src/components/
└── RsvpLookup.tsx       ← Modified: read secret from URL/sessionStorage;
                            show gate screen if absent; pass secret to API call

src/services/
└── rsvpApi.ts           ← Modified: accept secret param, send as X-Invite-Secret header

.env.local               ← New (not committed): INTERNAL_SECRET=<dev value>
```

No new source files — all changes are confined to the three existing files plus local config.

## Design Decisions

### Backend: `api/rsvp.ts`

Add secret validation as the second check, after method check and before body parsing:

1. Method !== POST → 405
2. `req.headers['x-invite-secret']` !== `process.env.INTERNAL_SECRET` → 401
3. `body.name` missing/empty → 400
4. Lookup → 200

If `INTERNAL_SECRET` is not set (misconfigured environment), reject all requests. Missing config must not silently grant access.

### Frontend: `src/components/RsvpLookup.tsx`

On component mount (useEffect):
1. Check `URLSearchParams` for `?s=` value from `window.location.search`
2. If found in URL → write to `sessionStorage` under key `invite_secret` → use it
3. If not in URL → read from `sessionStorage`
4. If neither → `secret = null` → render gate screen, no form
5. If found → `secret = <value>` → render form normally

On 401 response from backend: clear `sessionStorage` key and show gate screen (handles rotated secrets).

**Query param retention note**: The app currently uses `useState`-based navigation (no React Router), so `?s=abc123` stays in the browser URL for the entire session — the `sessionStorage` write is a safety net. If React Router is added in future, route transitions using `navigate('/path')` will strip query params, causing the URL layer to break. At that point, either (a) always forward query params via `navigate('/path' + location.search)`, or (b) drop URL reliance entirely and read exclusively from `sessionStorage` after the first load. Option (b) is a one-line change and is the lower-risk path.

### Frontend: `src/services/rsvpApi.ts`

Update `lookup()` to accept `secret: string` as a parameter. Send it as `X-Invite-Secret` in the fetch headers. The component is responsible for ensuring a non-null secret before calling.

### Gate Screen

Simple informational screen:
- Heading: "Please use your invite link"
- Body: "Scan the QR code on your physical invitation to access the RSVP."
- No retry button, no contact link — per spec, the couple handles lost-invite cases manually.
