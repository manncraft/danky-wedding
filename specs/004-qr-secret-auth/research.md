# Research: QR Code Secret Validation

**Feature**: 004-qr-secret-auth
**Date**: 2026-03-20

---

## Decision 1: How the Secret Is Transmitted from Frontend to Backend

**Decision**: Send the secret as a custom HTTP request header (`X-Invite-Secret`) on every call to `/api/rsvp`.

**Rationale**: A header is cleaner than embedding the secret in the POST body because:
- It applies uniformly to any future endpoints without body schema changes
- It is not accidentally logged as part of request payload data
- It keeps the API contract clean — the body remains purely about the lookup query

**Alternatives considered**:
- In the POST body as a `secret` field — simpler but pollutes the data schema
- As a query parameter on the API call — query params appear in server access logs; headers do not

---

## Decision 2: How the Frontend Reads and Retains the Secret

**Decision**: Read the secret from the URL query parameter (`?s=<value>`) on component mount using `URLSearchParams`. Store it in `sessionStorage` immediately after reading so it survives a page refresh within the same browser tab. Do not strip it from the URL.

**Rationale**:
- The QR code URL already contains `?s=...`; reading it directly on load requires no extra infrastructure
- `sessionStorage` persists through same-tab refreshes but is cleared when the tab is closed — appropriate for this context
- Not stripping the URL means the value is still available even if `sessionStorage` is unavailable (private browsing edge case)
- Storing in `sessionStorage` means the user doesn't lose access if they navigate away and back within the same tab

**Alternatives considered**:
- Keep only in URL, never store — breaks if the SPA router removes query params during navigation
- Use `localStorage` — persists across tabs and sessions; unnecessary and slightly increases exposure
- React Context — valid option, but `sessionStorage` adds cross-navigation resilience without added complexity

---

## Decision 3: Where the Gate UI Lives

**Decision**: The secret check and "use your invite" gate screen live inside `RsvpLookup.tsx`. Static pages (hero, schedule, venue) are unaffected.

**Rationale**: The spec explicitly scopes this to the RSVP backend. Gating in the RSVP component keeps the change minimal and avoids blocking guests who simply want to view wedding info before scanning their invite.

**Alternatives considered**:
- Gate the entire `App.tsx` — over-reaches the spec; blocks non-RSVP pages unnecessarily
- A dedicated `<SecretGate>` wrapper component — correct abstraction if multiple pages need gating in future; premature now (one use case)

---

## Decision 4: Secret Validation on the Backend

**Decision**: Read `process.env.INTERNAL_SECRET` in the Vercel function. Compare directly with the incoming header value using strict equality. Return HTTP 401 with a JSON error body if missing or mismatched.

**Rationale**: Timing-safe comparison (`crypto.timingSafeEqual`) is recommended for password/token comparison but the threat model here is minimal — this is a shared secret on a wedding site, not a banking credential. Direct equality is adequate and avoids the Buffer conversion boilerplate. Document the trade-off.

**Alternatives considered**:
- `crypto.timingSafeEqual` — more correct but adds noise; acceptable to defer unless threat model changes
- Rate limiting — would also help, but is out of scope per MVP Discipline

---

## Decision 5: Local Development Configuration

**Decision**: Store the local secret in `.env.local` (already git-ignored via `.env*`). `vercel dev` loads it automatically. Document a sample value in quickstart.md without committing the actual value.

**Rationale**: Consistent with the constitution's requirement that `INTERNAL_SECRET` lives as a Vercel Environment Variable. `.env.local` is the standard Vercel/Vite pattern for local secrets.

**Alternatives considered**:
- Hardcode a dev-only bypass in the function — would risk being accidentally shipped; rejected
- Use a separate dev Vercel project — unnecessary overhead for a local dev workflow
