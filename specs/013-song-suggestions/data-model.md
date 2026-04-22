# Data Model: Guest Song Suggestions

**Feature**: 013-song-suggestions | **Date**: 2026-04-22

## Type Changes

### `Guest` (src/types/rsvp.ts)

```typescript
// BEFORE
type Guest = {
  name: string;
  dietary?: string;
  type: 'primary' | 'plus-one';
};

// AFTER
type Guest = {
  name: string;
  dietary?: string;
  song?: string;        // NEW: free-text, max 200 chars, omitted if blank
  type: 'primary' | 'plus-one';
};
```

### `RsvpRow` (api/rsvp-submit.ts)

```typescript
// BEFORE
type RsvpRow = {
  guest_name: string;
  attending: boolean;
  dietary: string;
  type: 'Primary' | 'Plus-One';
  invite_source: string;
  timestamp: string;
};

// AFTER
type RsvpRow = {
  guest_name: string;
  attending: boolean;
  dietary: string;
  song: string;         // NEW: empty string if not provided
  type: 'Primary' | 'Plus-One';
  invite_source: string;
  timestamp: string;
};
```

### `AttendanceFormData` (src/types/rsvp.ts or inline in RsvpLookup.tsx)

Additional guest shape gains `song?: string` alongside `dietary?: string`.

```typescript
// BEFORE
additionalGuests: Array<{ name: string; dietary?: string }>;

// AFTER
additionalGuests: Array<{ name: string; dietary?: string; song?: string }>;
```

---

## Google Sheets Schema

### RSVPs Sheet — Column Layout

| Col | Field | Type | Notes |
|-----|-------|------|-------|
| A | `timestamp` | string | ISO 8601, unchanged |
| B | `guest_name` | string | unchanged |
| C | `attending` | string | `'yes'` / `'no'`, unchanged |
| D | `dietary` | string | unchanged |
| E | `type` | string | `'Primary'` / `'Plus-One'`, unchanged |
| F | `invite_source` | string | unchanged |
| G | `is_child` | string | unchanged |
| H | `age_range` | string | unchanged |
| I | `seating_needs` | string | unchanged |
| J | `safety_ack` | string | unchanged |
| K | `song_suggestion` | string | **NEW** — free text, blank if not provided |

The GAS header row and row-value array each gain one new entry at index 10.

---

## Data Flow Summary

```
RsvpLookup.tsx (form)
  song field (primary guest + each additional guest)
  → trim; omit from Guest object if blank
  ↓
POST /api/rsvp-submit
  guests[]: Guest  (song?: string on each)
  ↓
flattenToRows() in api/rsvp-submit.ts
  RsvpRow.song = guest.song ?? ''
  ↓
GAS doPost()
  row array index 10 = song_suggestion value
  → appended to RSVPs sheet column K
```

---

## Validation Rules

| Layer | Rule |
|-------|------|
| Form (react-hook-form) | `maxLength: 200` |
| Server (Zod) | `z.string().max(200).optional()` on each guest's `song` field |
| GAS | No validation — trusts Vercel proxy |
