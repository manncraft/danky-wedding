# Research: Add Dietary Requirements Field

**Branch**: `007-dietary-requirements` | **Date**: 2026-03-20

## Decision Log

### Decision 1: Where to show/hide the dietary field

**Decision**: Conditionally render the `<input>` element based on the watched value of the `attending` form field. Use `react-hook-form`'s `watch('attending')` to drive visibility.

**Rationale**: The form already uses react-hook-form. `watch()` is the idiomatic way to react to field value changes without a separate React state variable. Conditional rendering (mount/unmount) naturally resets the field value, satisfying FR-007 (cleared on toggle) without extra `setValue` calls — though an explicit `setValue('dietary', '')` on toggle is more robust and clearer in intent.

**Alternatives considered**:
- CSS `display: none` + hidden field: rejected — value would still be serialised into form data and potentially submitted.
- Separate `useState` for visibility: rejected — redundant with form state already tracked by react-hook-form.

---

### Decision 2: How to clear the dietary field on attendance toggle

**Decision**: Use a `useEffect` that watches the `attending` field value. When it changes to `'false'`, reset all attending-gated fields in one place via `setValue`. Define the gated fields in a single constant so adding future fields requires only updating that list, not touching the toggle handler.

```typescript
const ATTENDING_GATED_FIELDS = ['dietary'] as const

useEffect(() => {
  if (attendingValue !== 'true') {
    ATTENDING_GATED_FIELDS.forEach(field => setValue(field, ''))
  }
}, [attendingValue, setValue])
```

**Rationale**: Per-field `setValue` calls inside the toggle handler don't scale — each future attending-gated field requires a new call buried in the handler. The `useEffect` pattern centralises the reset logic; adding a field means updating one array. It also survives any future change to how the toggle is triggered (keyboard, programmatic, etc.).

**Alternatives considered**:
- `setValue` in toggle handler per field: rejected — doesn't scale as more fields are added behind the attendance gate.
- Rely on unmount only: fragile if animation or transition wrappers are added later.
- `reset()` with partial values: resets the whole form, including guest name and attending selection — too broad.

---

### Decision 3: Field type — `<input type="text">` vs `<textarea>`

**Decision**: Use `<input type="text">`. The spec says "very simple free-text field" and dietary notes are typically short (≤50 chars). A `<textarea>` implies multi-paragraph input.

**Rationale**: Matches the stated intent ("very simple"), consistent with other single-line fields in the form, and keeps the mobile keyboard in single-line mode.

**Alternatives considered**:
- `<textarea>`: better for long input but visually heavier than needed; can be revisited if real user data shows longer entries are common.

---

### Decision 4: API payload — optional field, not required

**Decision**: Add `dietary?: string` to `RsvpSubmitRequest`. The API validates it as an optional string. When attending is false, the field is omitted from the payload. When attending is true, it is included (may be empty string).

**Rationale**: Constitution Principle V lists `dietary` as a required catering field in the RSVP schema — this feature is fulfilling that requirement. The field should be present in the payload whenever attending is true (even if empty) so the column always exists in the eventual Google Sheet row.

**Alternatives considered**:
- Always include `dietary` regardless of attending: rejected — semantically meaningless for non-attending guests and adds noise to the Sheet.

---

### Decision 5: Whitespace handling

**Decision**: Trim the value before submission in the API function. Store `undefined` / omit from payload if result is empty string after trim.

**Rationale**: Consistent with existing `guest_name` validation which calls `.trim()`. Prevents whitespace-only values from cluttering the Sheet column.

**Alternatives considered**:
- Frontend trim only: client-side trim is not trustworthy as a data quality guarantee; server-side is required for correctness.

---

### Constitution Principle V alignment

The constitution explicitly lists `dietary` in the RSVP schema required for catering vendors. This feature is the vehicle for introducing that field. The backend stub continues to return `{ status: 'ok' }` without persisting — the persistence layer (GAS) is handled in feature 005 and will naturally pick up the new field when the two are integrated.
