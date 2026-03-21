# Research: RSVP Sheet Persistence

**Feature**: 009-rsvp-sheet-persistence | **Date**: 2026-03-21

---

## Decision 1: GAS Write Atomicity Strategy

**Decision**: Use a single `sheet.getRange(startRow, 1, rowCount, colCount).setValues(data)` call to write all rows for a submission in one operation.

**Rationale**: `appendRow()` in a loop issues one API call per row — if the process fails mid-loop, earlier rows are already committed and no rollback is possible. `setValues()` on a pre-calculated range writes all rows in a single Sheets API call, which is as close to atomic as the GAS runtime allows. For the scale of this project (~200 submissions max), this is sufficient.

**Alternatives considered**:
- `appendRow()` loop — rejected: partial-write risk on multi-person submissions
- Sheets API v4 batch update (REST) — rejected: requires OAuth service account, violates Principle II (complexity/cost)

---

## Decision 2: GAS Endpoint URL for Writes

**Decision**: Reuse the existing `GAS_ENDPOINT_URL`. GAS web apps route `doGet` and `doPost` to separate handler functions at the same URL.

**Rationale**: No new environment variables needed; the same deployed script URL handles both the guest lookup (`doGet`) and the RSVP write (`doPost`). Keeps operational surface minimal.

**Alternatives considered**:
- Separate GAS deployment for writes — rejected: doubles operational overhead (two script URLs to manage), violates Principle II
- New `GAS_WRITE_URL` env var pointing to a dedicated script — rejected: unnecessary if one script handles both

---

## Decision 3: Write Authentication

**Decision**: Reuse `GAS_SECRET` for write requests. The Vercel function includes it as a JSON field (`secret`) in the POST body.

**Rationale**: GAS does not support custom HTTP headers for incoming requests in a reliable, cross-origin way — the secret must travel in the body or query string. Body is preferred over query string (not logged in GAS execution logs). Reusing the existing secret avoids a new env var.

**Alternatives considered**:
- New dedicated `GAS_WRITE_SECRET` env var — rejected: no security benefit for a single-operator system; adds operational complexity
- No auth on doPost (rely on Vercel proxy as sole gate) — rejected: GAS web apps are publicly reachable; the secret is the only layer preventing direct abuse

---

## Decision 4: Timestamp Ownership

**Decision**: Timestamp is generated in the Vercel function at request time (`new Date().toISOString()`) and passed to GAS as part of the row payload.

**Rationale**: Vercel has a reliable clock and consistent timezone handling. GAS execution time can differ slightly from submission time (cold-start, queue delay), making GAS-generated timestamps less accurate. All rows in one submission share the same timestamp (set once before the GAS call).

**Alternatives considered**:
- GAS-generated timestamp (`new Date()` inside doPost) — rejected: slightly inaccurate; rows in the same submission could have marginally different write times
- Frontend-generated timestamp — rejected: client clocks are untrusted

---

## Decision 5: Deferred Fields Handling

**Decision**: The four fields not yet collected by the form (`is_child`, `age_range`, `seating_needs`, `safety_ack`) are written as empty strings `""` in every row.

**Rationale**: Confirmed in clarifications (Q1). Writing empty strings rather than omitting columns preserves the fixed column schema so the header row and all data rows always have the same width. This prevents column misalignment if the sheet is exported or sorted.

**Alternatives considered**:
- Omit deferred columns entirely — rejected: would misalign columns when those fields are added in a future feature
- Write `null` or `undefined` — rejected: GAS setValues does not handle null well in all contexts; empty string is the safe default

---

## Decision 6: "Attending = No" Row Strategy

**Decision**: A declined submission writes exactly one row for the primary guest with `attending = "no"`. No plus-one rows are written.

**Rationale**: Confirmed in clarifications (Q3). Plus-ones for a declined party are not attending; writing rows for them would inflate headcount and confuse catering reports.

**Alternatives considered**:
- Write plus-one rows with `attending = "no"` — rejected: inflates headcount, complicates catering exports, confirmed out of scope

---

## Decision 7: RSVPs Sheet Initialisation

**Decision**: The GAS `doPost` handler checks for the existence of the `RSVPs` sheet and a valid header row on every call; if either is missing it creates them before writing data.

**Rationale**: The sheet and header need to exist before the first write but shouldn't require a separate manual setup step. Checking on each call is cheap (one `getSheetByName` call) and idempotent.

**Alternatives considered**:
- Separate one-time setup script — rejected: requires manual operator action; creates a deployment dependency
- Create sheet only on first call (flag in script properties) — rejected: unnecessary complexity for a simple check

---

## Key Existing Code Facts (from codebase exploration)

- `api/rsvp-submit.ts`: Validates `POST`, `X-Invite-Secret` header, `body.attending` (boolean), `body.guests[]` (array with primary first). Currently returns `{ status: 'ok' }` without persisting.
- `gas/guest-lookup.gs`: Has `doGet` only. Validates via `GUEST_SECRET` script property. Always returns HTTP 200 with JSON body; errors in `{ error: "..." }` field.
- `src/types/rsvp.ts`: `RsvpSubmitRequest = { attending: boolean, guests: Guest[] }` where `Guest = { name: string, dietary?: string, type: 'primary' | 'plus-one' }`.
- `GAS_ENDPOINT_URL` and `GAS_SECRET` already set as Vercel env vars; `GAS_TIMEOUT_MS` defaults to 6000ms.
- The `invite_source` for all rows in a submission is `guests[0].name` (the primary guest).
