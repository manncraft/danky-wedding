# Research: Guest Song Suggestions

**Feature**: 013-song-suggestions | **Date**: 2026-04-22

## Decision Log

### 1. Where to display the song field in the form

**Decision**: Render the song suggestion field directly beneath the dietary field for each guest (primary and additional), within the same "attending" conditional block.

**Rationale**: Dietary and song suggestion are both optional per-guest preferences collected at the same stage of the flow. Grouping them together is the least disruptive layout change and matches the existing pattern. The field is already hidden for non-attending guests by virtue of being inside the `attending === 'true'` guard.

**Alternatives considered**:
- Separate "song" section after all guest rows — rejected; would require a second scroll/interaction for multi-guest parties.
- Dedicated step/screen — rejected; violates MVP Discipline (Principle IV) and adds unnecessary friction.

---

### 2. How to pass song through the data pipeline

**Decision**: Add `song?: string` as an optional field to the existing `Guest` type and `RsvpRow` type. The Vercel `flattenToRows()` function maps it directly. The GAS appends it as the last column.

**Rationale**: The pipeline is already parameterised per-guest (`Guest[]` → `RsvpRow[]` → GAS rows). Adding one optional field requires no structural change — just a new property at each layer.

**Alternatives considered**:
- Separate API endpoint for song collection — rejected; unnecessary complexity, split submissions could result in mismatched data.
- Store songs client-side only (localStorage) — rejected; fails FR-004/FR-006 (must be persisted to sheet).

---

### 3. Sheet column placement

**Decision**: Append "Song Suggestion" as column K (after the existing J: `safety_ack`). The GAS header row and row-value array both gain one new entry at position index 10 (0-based).

**Rationale**: Columns A–J are the established schema per the constitution (Principle V). Appending avoids any risk of shifting existing column references used by the couple's Sheet formulas or views. Confirmed in clarification session 2026-04-22.

**Alternatives considered**:
- Insert between existing columns — rejected; would break any existing column references in the sheet.
- Separate "Songs" sheet — rejected; clarification Q2 answer was Option A (same row).

---

### 4. Validation approach

**Decision**: 200-character max enforced client-side via react-hook-form `maxLength` rule and mirrored server-side via Zod `.max(200)` on the `song` field in the request schema.

**Rationale**: Consistent with how dietary is handled today (client + server validation). Prevents oversized strings reaching the sheet without requiring a dedicated error screen.

**Alternatives considered**:
- Client-side only — rejected; server should not trust client input.
- Truncate silently server-side — rejected; user should be informed if their input is too long.

---

### 5. Empty-string vs. omitted field handling

**Decision**: An empty or blank song field is treated as "no suggestion". The Vercel function strips whitespace and omits the field from the `Guest` object (matching how `dietary` is handled today). The GAS writes an empty string `""` for any row where `song` is absent.

**Rationale**: Consistent with existing `dietary` handling in `RsvpLookup.tsx` (lines 232–243). Empty string in sheet is correct — the column exists for all rows, blank cells are expected and human-readable.

**Alternatives considered**:
- `null` in sheet — rejected; GAS Spreadsheet Service writes blank for both `""` and `null`, so no difference; use `""` for explicitness.
