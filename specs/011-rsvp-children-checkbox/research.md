# Research: RSVP Children Checkbox

**Branch**: `011-rsvp-children-checkbox` | **Date**: 2026-03-26

## Decision Log

### Decision 1: Where does `bringing_children` live in the data model?

**Decision**: `bringing_children` is a per-submission boolean on `RsvpSubmitRequest`, stored only on the primary guest's sheet row.

**Rationale**: The checkbox is a single form-level question ("is anyone in my party a child?"), not a per-person attribute. The primary guest's row is the logical owner of submission-level metadata. Storing it on every row in the party would misrepresent the meaning (plus-ones themselves aren't marked as children; the couple just needs to know children are present in the group).

**Alternatives considered**:
- Store on every row in the batch: rejected — misleading (implies each person is a child, not the group).
- Use existing `is_child` column: rejected — `is_child` is reserved per-constitution for a per-person "is this specific guest a child?" flag; the semantics differ.
- Use existing `safety_ack` column: rejected — conflating "acknowledged safety" with "bringing children" would lose the distinct meaning of each field.

---

### Decision 2: Sheet column strategy — new column vs. repurpose existing

**Decision**: Add a new column 11 ("Bringing Children") to the `RSVPs` sheet. The GAS `doPost` handler, header row, and row-building logic are updated from 10 to 11 columns.

**Rationale**: All 10 existing columns have defined semantics in the constitution and codebase. `safety_ack`, `is_child`, `age_range`, `seating_needs` are reserved for future per-person data. Reusing any of them for a different purpose would create silent data corruption for features that eventually populate those columns.

**Alternatives considered**:
- Repurpose `safety_ack` for bringing_children: rejected — `safety_ack` is constitutionally reserved and semantically distinct (it would capture whether the guest clicked "I acknowledge the risks", which is a separate future field).
- Do not persist to sheet at all: rejected — spec requirement.

---

### Decision 3: Checkbox visibility trigger

**Decision**: The checkbox appears when `fields.length > 0` (where `fields` is the `useFieldArray` result for `additionalGuests`). This evaluates reactively on every render, matching the existing dynamic show/hide pattern in the form.

**Rationale**: The form already uses `fields.length` to control "Add Guest" button visibility. Consistent pattern; no new state needed.

**Alternatives considered**:
- Track in separate useState: rejected — duplicates react-hook-form state unnecessarily.

---

### Decision 4: Safety message content

**Decision**: The safety message is an inline warning block (not a modal) that appears directly below the checkbox when it is ticked. Content:

> **Please note — children on site**: Our venue has a **pond**, **vendor tables with fragile equipment**, and **extension cords** throughout the space. Children must be **supervised by an adult at all times**. By checking this box you confirm you are aware of these hazards.

**Rationale**: Inline messaging is less disruptive than a modal and keeps the form flow intact. The message is informational (not a separate consent step), so a styled alert block is appropriate.

---

### Decision 5: Value reset when all additional guests are removed

**Decision**: When `fields.length` drops to 0, the checkbox is hidden and `setValue('bringingChildren', false)` is called reactively via a `useEffect` watching `fields.length`.

**Rationale**: react-hook-form's `useFieldArray` remove operation does not automatically reset unrelated fields. An explicit `useEffect` ensures the value is always consistent with the form state and does not submit a stale `true` if all guests were subsequently removed.

**Alternatives considered**:
- Reset only in the remove handler: rejected — fragile; would miss bulk-removal paths.

---

### Decision 6: Backward compatibility

**Decision**: `bringing_children` is optional (`boolean | undefined`) in `RsvpSubmitRequest`. The Vercel function defaults to `false` if absent. The GAS always writes 11 columns per row; on rows where the field is absent (old submissions that hit a cached function), the 11th column is simply empty.

**Rationale**: Existing rows in the sheet already have 10 columns; the GAS appending 11-column rows does not break anything (Sheets dynamically expands). The header row will be written only on first-ever write, so it will include column 11 naturally after this deploy.

---

## Research Summary

No external research required. All decisions are based on:
- Existing codebase patterns (useFieldArray, flattenToRows, GAS batch writes)
- Constitution principles (per-person row model, locked tech stack)
- Spec requirements (checkbox visibility, safety message, sheet column name)

All NEEDS CLARIFICATION items resolved. Ready for Phase 1 design.
