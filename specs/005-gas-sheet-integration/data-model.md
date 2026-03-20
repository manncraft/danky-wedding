# Data Model: GAS Google Sheet Guest Data Integration

**Branch**: `005-gas-sheet-integration` | **Date**: 2026-03-20

## Entities

### GuestRecord (internal — Vercel function only)

Derived from raw sheet data. Used for in-memory matching. Already defined in `src/types/rsvp.ts`.

| Field | Type | Source | Notes |
|---|---|---|---|
| `full_name` | `string` | Sheet col A, raw | Display name returned to client |
| `normalised_name` | `string` | Derived | Lowercased, diacritic-stripped, collapsed-space form of `full_name` |
| `first_initial` | `string` | Derived | First character of first token in `normalised_name` |
| `last_name_normalised` | `string` | Derived | Last space-separated token in `normalised_name` |
| `max_guests` | `number` | Sheet col B | Minimum 1; default 1 if cell is blank or non-numeric |

### GasGuest (wire format — GAS → Vercel)

Shape of each element in the `guests` array returned by the GAS web app.

| Field | Type | Source | Notes |
|---|---|---|---|
| `full_name` | `string` | Sheet col A | Raw, untrimmed sheet value; Vercel normalises |
| `max_guests` | `number` | Sheet col B | GAS coerces to `Number()`; Vercel defaults to 1 if `NaN` |

### GasResponse (wire format — GAS → Vercel)

Top-level JSON shape returned by the GAS web app on all requests (HTTP always 200).

```
Success:  { "guests": GasGuest[] }          — guests array may be empty (no rows in sheet)
Failure:  { "error": string }               — auth rejection, script exception, sheet not found
```

Both `error` (present) and `guests` (absent or null) are treated as failure by the Vercel function. An empty `guests: []` array is a valid success (no guests in sheet yet).

### MatchedGuest (wire format — Vercel → Browser)

Already defined in `src/types/rsvp.ts`. Only fields the client receives.

| Field | Type |
|---|---|
| `full_name` | `string` |
| `max_guests` | `number` |

### LookupResponse (wire format — Vercel → Browser)

Already defined in `src/types/rsvp.ts`.

| Field | Type | Values |
|---|---|---|
| `status` | `string` | `'found'` \| `'not_found'` |
| `matches` | `MatchedGuest[]` | One entry per matched row |

## Google Sheet Layout

**Spreadsheet**: Any name (couple's choice)
**Tab name**: `Invites` (hard-coded in GAS script)

| Row | Col A: Full Name | Col B: Max Guests |
|---|---|---|
| 1 | *(header — skipped)* | *(header — skipped)* |
| 2 | Alice Johnson | 2 |
| 3 | María García | 4 |
| … | … | … |

**Rules**:
- Blank rows (col A empty) are skipped silently
- Col B blank or non-numeric → treated as 1 by GAS; Vercel also defaults to 1 as a second safety net
- The tab name `Invites` is case-sensitive; the sheet must be named exactly that

## Environment Variables

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `INTERNAL_SECRET` | Yes | — | Gate between browser and Vercel (unchanged) |
| `GAS_ENDPOINT_URL` | Yes | — | Deployed GAS web app URL |
| `GAS_SECRET` | Yes | — | Authenticates Vercel → GAS call (separate from `INTERNAL_SECRET`) |
| `GAS_TIMEOUT_MS` | No | `6000` | Max ms to wait for GAS response |

## State Transitions

No state is persisted by this feature. Every lookup request is stateless:

```
Browser POST /api/rsvp
  → Vercel validates INTERNAL_SECRET
  → Vercel fetches GAS endpoint (with GAS_SECRET, subject to GAS_TIMEOUT_MS)
  → Vercel normalises + matches in memory
  → Vercel returns MatchedGuest[] to browser
```

Failure paths:
- GAS unreachable / timeout → 502 to browser
- GAS returns `{ error }` or null `guests` → 502 to browser
- No matching guest → 200 with `status: 'not_found'`
