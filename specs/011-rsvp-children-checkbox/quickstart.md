# Quickstart: RSVP Children Checkbox

**Branch**: `011-rsvp-children-checkbox` | **Date**: 2026-03-26

## Overview

This feature adds a "bringing children" checkbox to the RSVP form, shown only when one or more additional guests have been added. Ticking it reveals a safety message. The value is persisted to the Google Sheet as a new column 11.

## Touch Points (in dependency order)

### 1. TypeScript Types — `src/types/rsvp.ts`

Add `bringing_children?: boolean` to `RsvpSubmitRequest`.
Add `bringing_children: string` to `RsvpRow`.
Update `GasWriteRequest` if needed (no change required — it references `RsvpRow`).

### 2. Frontend Form — `src/components/RsvpLookup.tsx`

**Form data type** (`AttendanceFormData`):
- Add `bringingChildren?: boolean` field

**Conditional checkbox** (render after the additional guests `fields.map` block, before the submit button):
- Condition: `fields.length > 0`
- Checkbox label: "One or more of my additional guests are children"
- Register with react-hook-form: `register('bringingChildren')`

**Safety message** (render immediately after checkbox):
- Condition: `watch('bringingChildren') === true`
- Content: warn about pond, vendor tables with fragile equipment and extension cords, instruct supervision at all times

**Value reset** (add `useEffect`):
- Dependency: `[fields.length]`
- When `fields.length === 0`: call `setValue('bringingChildren', false)`

**Submit handler** (update `handleSubmit` callback):
- Read `data.bringingChildren` and include as `bringing_children` in the `submitRsvp` call

### 3. API Service — `src/services/rsvp.ts` (or wherever `submitRsvp` is defined)

- Update function signature to accept `bringing_children?: boolean` and forward it in the request body.

### 4. Vercel Function — `api/rsvp-submit.ts`

**Request parsing**:
- Extract `bringing_children?: boolean` from the request body (default `false` if absent)

**`flattenToRows` function**:
- Add `bringing_children` parameter
- On the primary guest row: set `bringing_children` to `'yes'` or `'no'`
- On all plus-one rows: set `bringing_children` to `''`

**`RsvpRow` construction**: include the new field

### 5. Google Apps Script — `gas/guest-lookup.gs`

**`doPost` handler**:
- Update header array from 10 to 11 elements: append `'bringing_children'`
- Update row-building loop from 10 to 11 columns: append `row.bringing_children ?? ''`
- Update `setValues` range from `data.length, 10` to `data.length, 11`

## Verification Steps

1. Open RSVP form with a valid invite secret.
2. Set attending = Yes. Add zero additional guests → confirm "bringing children" checkbox is **not visible**.
3. Add one additional guest → confirm checkbox **appears**.
4. Tick checkbox → confirm safety message appears with pond, vendor tables, extension cords, and supervision text.
5. Untick checkbox → confirm safety message disappears.
6. Remove all additional guests → confirm checkbox disappears.
7. Re-add a guest, tick the checkbox, submit → inspect Google Sheet; confirm row 11 for the primary guest is `yes`.
8. Submit without ticking → confirm row 11 for the primary guest is `no`.
9. Submit with no additional guests → confirm row 11 for primary is `no`.
