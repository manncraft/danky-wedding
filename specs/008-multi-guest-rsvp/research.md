# Research: Multi-Guest RSVP

**Branch**: `008-multi-guest-rsvp` | **Date**: 2026-03-20

## Decision 1: Dynamic field array management

**Decision**: Use `react-hook-form`'s `useFieldArray` hook to manage the list of additional guest sections.

**Rationale**: `useFieldArray` is already called out in the locked tech stack constitution ("react-hook-form + useFieldArray — Dynamic plus-one fields"). It integrates natively with the existing `useForm` instance, provides `append` / `remove` helpers that trigger re-renders correctly, and avoids manual array state management alongside react-hook-form's controlled form state — which would require manually calling `setValue` and risk divergence.

**Alternatives considered**:
- Manual `useState` array + `setValue`: Works but duplicates state and creates a footgun where array index and form field path diverge on removal.
- Separate `useForm` per additional guest: Impossible to submit as one payload; would require manual merge on submit.

---

## Decision 2: Conditional display — attendance gate

**Decision**: The entire multi-guest section (label + "Add Guest" button + all added guest sections) is shown only when **both** conditions are true: `max_guests > 1` AND the attendance radio value is `'true'`. When the primary guest switches to "not attending", all added guest sections are removed from the field array (via `replace([])`) so they are not submitted.

**Rationale**: Per spec clarification Q2, the multi-guest section must be hidden when declining. Clearing the array on decline prevents stale dietary data being submitted for ghost guests. `replace([])` from `useFieldArray` is a single call that resets cleanly without triggering individual remove animations.

**Alternatives considered**:
- Keep array but exclude from payload on submit: Fragile — requires payload-construction logic to match conditional render logic in two places.
- Hide but preserve array: Dietary data for guests the primary declined on behalf of would be submitted, which is incorrect.

---

## Decision 3: Submission payload shape — flattened guests array

**Decision**: Replace the top-level `guest_name`/`attending`/`dietary` fields with a single `guests: Guest[]` array. The first element is always the primary guest (`type: 'primary'`); subsequent elements are additional party members (`type: 'plus-one'`). `attending` moves to the top level as it applies to the whole submission, not per-guest. `guest_name` moves to `guests[0].name`.

```json
{
  "attending": true,
  "guests": [
    { "name": "Alice Johnson", "dietary": "vegetarian", "type": "primary" },
    { "dietary": "nut allergy", "type": "plus-one" },
    { "dietary": "", "type": "plus-one" }
  ]
}
```

**Rationale**: All guests in the party are structurally identical from the data store's perspective — the constitution requires one row per person regardless of type. Flattening now means the GAS integration (and any future data store) can iterate a single uniform array without special-casing the primary guest. The `type` field on each guest preserves the Primary / Plus-One distinction needed for vendor reporting. This is a clean break from the 006/007 contract on a stub endpoint — the right time to make this change.

**Alternatives considered**:
- Primary guest at top level + `additional_guests[]` nested (original plan): Creates an artificial structural split that has to be re-flattened server-side before writing rows. Defers the complexity rather than eliminating it.
- Key additional guests by index (`guest_2_dietary`, `guest_3_dietary`): Non-extensible; awkward to iterate in GAS; fails when guests are removed out of order.

---

## Decision 4: Section visual delineation (no labels)

**Decision**: Each additional guest section is wrapped in a visually distinct card (Tailwind `border`, `rounded`, `p-4`, `mt-4`) with the trash-can remove button in the top-right corner. Sections carry no "Guest N" label per spec clarification Q3 — delineation comes from the card boundary alone.

**Rationale**: Removing labels eliminates the renumbering-on-delete problem entirely. A clearly bounded card is sufficient for the user to understand each section represents one guest. Consistent with the mobile-first principle: cards scale well at narrow widths, numbers do not add meaningful information.

**Alternatives considered**:
- Numbered headings with renumber-on-delete: Adds complexity for zero UX value.
- Horizontal dividers without card: Weaker visual affordance, especially on mobile where vertical space makes boundaries less obvious.

---

## Decision 5: No new dependencies required

**Decision**: `useFieldArray` is part of react-hook-form (already installed). The trash-can icon uses an inline SVG rather than an icon library, consistent with current icon usage in the project.

**Rationale**: No new `package.json` entries needed. Inline SVG avoids pulling in an icon library for a single icon and matches the pattern used for existing icons in the project (if any). If a Heroicons or Lucide dependency already exists it should be used instead — but adding one solely for this icon would violate MVP Discipline (Principle IV).

**Alternatives considered**:
- Lucide React or Heroicons: Justified only if already a dependency. Not justified as a new addition for a single icon.
- Unicode trash symbol (🗑): Not accessible; inconsistent with Tailwind-styled UI.
