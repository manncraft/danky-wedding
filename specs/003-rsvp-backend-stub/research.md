# Research: RSVP Backend Stub

**Feature**: 003-rsvp-backend-stub
**Date**: 2026-03-20

---

## Decision 1: Vercel Function Runtime Package

**Decision**: Install `@vercel/node` as a `devDependency`.

**Rationale**: Provides `VercelRequest` / `VercelResponse` TypeScript types. Only needed at build time — Vercel injects the real request/response objects at runtime, so it belongs in devDependencies to keep the production bundle clean.

**Alternatives considered**:
- Raw Node.js `IncomingMessage` / `ServerResponse` — works but less ergonomic
- Standard Web API `Request` / `Response` — viable for Edge runtime, not Node runtime

---

## Decision 2: HTTP Method for Lookup Endpoint

**Decision**: `POST /api/rsvp` with a JSON body.

**Rationale**: Guest names are personal identifiers. GET requests embed query parameters in URLs, which appear in server access logs, browser history, and referer headers. POST keeps the name in the request body, limiting its exposure. The endpoint is not cacheable (canned data changes each iteration), so the GET caching benefit does not apply here.

**Alternatives considered**:
- `GET /api/rsvp?name=...` — semantically correct for a read-only lookup, but names in URLs are a privacy concern aligned with Constitution Principle III
- Hash-based lookup — eliminates name transmission entirely but is over-engineered for this iteration

---

## Decision 3: Local Development Workflow

**Decision**: Use `vercel dev` instead of `npm run dev` when developing with serverless functions.

**Rationale**: `vercel dev` starts a single local server (default port 3000) that simulates the Vercel production environment — it routes `/api/*` to function handlers and everything else to the Vite dev server. Relative URL calls to `/api/rsvp` work identically in `vercel dev` and production. No Vite proxy configuration is needed.

**Alternatives considered**:
- `npm run dev` + Vite proxy (`server.proxy` in `vite.config.ts`) targeting a separately running functions process — more moving parts, higher maintenance cost
- Running Vite and a mock Express server in parallel — does not replicate Vercel environment, risks environment drift

---

## Decision 4: Input Normalisation Strategy

**Decision**: Normalise before matching using: trim → lowercase → NFD unicode decomposition → strip diacritics → remove non-alphanumeric-or-space characters → collapse multiple spaces.

**Rationale**: Guests commonly enter names in varied casing and may omit or inconsistently use accented characters (e.g. "José" vs "Jose"). NFD decomposition converts composite accented characters to base + combining diacritic, allowing the diacritic to be stripped independently without mangling the base character. This means both "García" and "Garcia" match the same stored record.

**Gotchas**:
- Hyphenated names (Mary-Jane) become "mary jane" after stripping non-alphanumeric chars — this is acceptable for the first-initial + last-name matching strategy
- Store normalised forms in canned data for comparison; keep original forms for display

**Alternatives considered**:
- Fuzzy / Levenshtein matching — overkill for a stubbed canned-data lookup; deferred to if typo tolerance becomes a requirement
- Normalise only on the server — simpler, but if the frontend ever pre-validates, both sides need consistent normalisation

---

## Decision 5: CORS Configuration

**Decision**: No CORS headers required.

**Rationale**: The frontend and the `/api/rsvp` function are deployed to the same Vercel project, sharing the same origin. Relative URL calls (e.g. `/api/rsvp`) are same-origin by definition — CORS is only triggered for cross-origin requests.

**When this changes**: If the frontend is ever served from a custom domain while the API is still on a `*.vercel.app` subdomain, CORS headers will need to be added to the function response. Defer until that scenario arises.
