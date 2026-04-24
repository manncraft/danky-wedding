# Tasks: Lavender Background Styling

**Input**: Design documents from `/specs/015-lavender-background/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, quickstart.md ✅

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no blocking dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)
- Exact file paths included in all descriptions

---

## Phase 1: Setup

**Purpose**: Place the image asset that all subsequent tasks depend on.

- [ ] T001 Add the provided lavender botanical illustration to `public/lavender.png` ⚠️ REQUIRES USER ACTION — place the image file manually

**Checkpoint**: `public/lavender.png` exists and is accessible at `/lavender.png` in the dev server.

---

## Phase 2: Foundational (Blocking Prerequisite)

**Purpose**: Establish the off-white background colour that the illustration must blend into. Must complete before user story work begins.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T002 Add `background-color: #f5f4f0` to the `body` selector in `src/index.css` — eyedropper-sample the actual `public/lavender.png` to confirm the hex value matches the image's near-white background before committing (adjust if needed, likely in the `#f5f4f0`–`#faf9f7` range)

**Checkpoint**: Opening the site shows a uniform warm off-white page background (not pure white).

---

## Phase 3: User Story 1 — Cohesive decorative background (Priority: P1) 🎯 MVP

**Goal**: Lavender illustration pinned to the left viewport edge, fixed on scroll, not tiling, with no visible colour seam against the background.

**Independent Test**: Open the site at desktop width. The illustration is visible along the left edge, does not scroll when you scroll the page, appears exactly once, and the background colour matches the illustration background with no visible edge.

- [x] T003 [US1] Add a fixed-position decorative image element as the first child of the fragment in `src/App.tsx`, before `<Nav>`:
  ```tsx
  <div
    aria-hidden="true"
    className="fixed left-0 top-0 h-screen pointer-events-none z-[-1]"
  >
    <img src="/lavender.png" alt="" className="h-full w-auto" />
  </div>
  ```
  The `z-[-1]` places it behind all content; `pointer-events-none` ensures it never blocks interactions; `h-full w-auto` sizes it to viewport height at its natural aspect ratio without stretching.

- [x] T004 [P] [US1] Update `src/components/Nav.tsx`: change `bg-white` to `bg-[#f5f4f0]` (same value confirmed in T002) so the sticky nav matches the page background with no contrasting white strip at the top.

**Checkpoint**: US1 fully functional — illustration fixed to left, background seamless, nav colour consistent.

---

## Phase 4: User Story 2 — No content overlap on narrow viewports (Priority: P2)

**Goal**: Illustration invisible on mobile viewports; all text and interactive elements fully readable.

**Independent Test**: In DevTools, set viewport to 375 px wide. The illustration must not be visible; all body text and form elements must be fully readable.

- [x] T005 [US2] Add responsive visibility to the decorative element in `src/App.tsx` (from T003): add `hidden sm:block` to the outer `<div>`'s className so the illustration is not rendered below 640 px. The final className should be: `"fixed left-0 top-0 h-screen pointer-events-none z-[-1] hidden sm:block"`.

**Checkpoint**: At 375 px viewport width, no illustration is visible and all content remains unobscured. At ≥640 px the illustration is present.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [ ] T006 [P] Run the full visual verification checklist ⚠️ PENDING T001 (image file required) from `specs/015-lavender-background/quickstart.md`: confirm no colour seam at desktop, no tiling, illustration stays fixed on scroll, mobile hides illustration, image-load failure shows clean off-white background.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on T001 (image must exist to sample colour)
- **User Story 1 (Phase 3)**: Depends on Phase 2 complete (background colour must be set first)
- **User Story 2 (Phase 4)**: Depends on T003 (adds classes to the element created in T003)
- **Polish (Phase 5)**: Depends on all phases complete

### User Story Dependencies

- **US1**: T003 and T004 are independent of each other ([P]) — both depend only on Phase 2
- **US2**: T005 depends on T003 (modifies the same element)

### Parallel Opportunities

- T003 and T004 can run in parallel (different files: `App.tsx` vs `Nav.tsx`)

---

## Parallel Example: User Story 1

```bash
# T003 and T004 touch different files — launch together:
Task: "Add fixed decorative element in src/App.tsx"
Task: "Update Nav bg-white → off-white in src/components/Nav.tsx"
```

---

## Implementation Strategy

### MVP (User Story 1 only)

1. T001 — add image
2. T002 — set body background colour
3. T003 + T004 in parallel — add fixed element and fix Nav colour
4. **STOP and VALIDATE**: open site at desktop, confirm illustration is fixed and seamless

### Full delivery (both stories)

5. T005 — add `hidden sm:block` for mobile
6. T006 — run quickstart checklist

Total: **6 tasks across 4 files** — this is a small, focused change.
