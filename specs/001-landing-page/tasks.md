---
description: "Task list for landing page with wedding information"
---

# Tasks: Landing Page with Wedding Information

**Input**: Design documents from `/specs/001-landing-page/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, quickstart.md ✅

**Tests**: Not requested — manual browser verification per quickstart.md.

**Organization**: Phase 1 (Setup) → Phase 2 (Foundational) → Phase 3 (US1) → Phase 4 (US2) → Polish

---

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)

---

## Phase 1: Setup

**Purpose**: Install Tailwind CSS and wire it into the Vite project.

- [ ] T001 Install Tailwind CSS v4 dependencies: run `npm install tailwindcss @tailwindcss/vite`
- [ ] T002 Add `@tailwindcss/vite` plugin to `vite.config.ts` (import tailwindcss from `@tailwindcss/vite`; add to plugins array)
- [ ] T003 Replace contents of `src/index.css` with `@import "tailwindcss";`
- [ ] T004 Delete `src/App.css` (replaced by Tailwind; remove its import from `src/App.tsx`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the section file stubs and the `App.tsx` shell so all
story phases can proceed in parallel. No user-visible content yet.

**⚠️ CRITICAL**: Phases 3 and 4 depend on this phase being complete.

- [ ] T005 Create directory `src/components/sections/` (empty, ready for section files)
- [ ] T006 [P] Create stub component `src/components/sections/Hero.tsx` — exports a React component returning a `<section id="hero">` with a placeholder `<h1>` and `<p>`
- [ ] T007 [P] Create stub component `src/components/sections/Schedule.tsx` — exports a React component returning `<section id="schedule">` with placeholder heading and paragraph
- [ ] T008 [P] Create stub component `src/components/sections/Travel.tsx` — exports a React component returning `<section id="travel">` with placeholder heading and paragraph
- [ ] T009 [P] Create stub component `src/components/sections/DressCode.tsx` — exports a React component returning `<section id="dress-code">` with placeholder heading and paragraph
- [ ] T010 [P] Create stub component `src/components/sections/Registry.tsx` — exports a React component returning `<section id="registry">` with placeholder heading and paragraph
- [ ] T011 [P] Create stub component `src/components/sections/Housekeeping.tsx` — exports a React component returning `<section id="housekeeping">` with placeholder heading and paragraph
- [ ] T012 Create `src/components/Nav.tsx` — stub nav component returning a `<nav>` with a `<ul>` of 5 anchor links (one per section id); apply `sticky top-0` Tailwind classes
- [ ] T013 Rewrite `src/App.tsx` to import and render `<Nav />` followed by `<main>` containing all 6 section stubs in order; remove all boilerplate imports and JSX

**Checkpoint**: `npm run dev` renders a page with a sticky nav and 6 labelled placeholder sections. No Vite/React logos visible.

---

## Phase 3: User Story 1 — View Wedding Information (Priority: P1) 🎯 MVP

**Goal**: Replace all stub placeholders with the full bracket-format placeholder
strings from the Placeholder Content Map in plan.md, so every content field is
identifiable and the page fully satisfies FR-001 through FR-006.

**Independent Test**: Open the site; verify all 6 sections render with bracket
placeholders visible; search source for `[` to confirm all 13 fields are present.

### Implementation for User Story 1

- [ ] T014 [P] [US1] Fill `src/components/sections/Hero.tsx` with all placeholder strings: `[Partner 1 Name]`, `[Partner 2 Name]`, `[Wedding Date]`, `[Venue Name]`, and a short welcome sentence with `[Venue Name]` referenced
- [ ] T015 [P] [US1] Fill `src/components/sections/Schedule.tsx` with placeholder strings: section heading, `[Ceremony Start Time]`, `[Reception End Time]`, and a placeholder paragraph describing the day
- [ ] T016 [P] [US1] Fill `src/components/sections/Travel.tsx` with placeholder strings: section heading, `[Venue Address]`, `[Google Maps Link]` as an `<a>` tag, and `[Transport Details]` paragraph
- [ ] T017 [P] [US1] Fill `src/components/sections/DressCode.tsx` with placeholder strings: section heading and `[Dress Code Description]` paragraph
- [ ] T018 [P] [US1] Fill `src/components/sections/Registry.tsx` with placeholder strings: section heading, `[Registry Link]` as an `<a>` tag, and `[Wishing Well Details]` paragraph
- [ ] T019 [P] [US1] Fill `src/components/sections/Housekeeping.tsx` with placeholder strings: section heading and `[Housekeeping Notes]` paragraph
- [ ] T020 [US1] Verify `public/` contains no Vite SVG assets referenced by the page; remove `src/assets/vite.svg` and `src/assets/react.svg` imports if referenced anywhere

**Checkpoint**: User Story 1 fully functional. All 13 placeholder strings present,
searchable, and clearly bracketed. No Vite boilerplate remains.

---

## Phase 4: User Story 2 — Navigate Between Sections (Priority: P2)

**Goal**: Nav links in `src/components/Nav.tsx` are complete and correctly labelled,
and smooth scroll is enabled so clicking a link jumps to the correct section.

**Independent Test**: Click each of the 5 nav links; verify the page scrolls to
the correct section. Test on a mobile viewport (320 px) to confirm all links
are reachable.

### Implementation for User Story 2

- [ ] T021 [US2] Update `src/components/Nav.tsx` with correct display labels and matching `href` anchor values for all 5 sections: Schedule (`#schedule`), Travel (`#travel`), Dress Code (`#dress-code`), Registry (`#registry`), Housekeeping (`#housekeeping`)
- [ ] T022 [US2] Add `scroll-behavior: smooth` to `src/index.css` (or equivalent Tailwind `scroll-smooth` class on `<html>`) so anchor clicks animate rather than jump
- [ ] T023 [US2] Verify nav is accessible on 320 px viewport — links must not overflow horizontally; apply Tailwind responsive classes if needed (e.g., `flex-wrap`, `overflow-x-auto`)

**Checkpoint**: User Stories 1 and 2 both independently functional.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Mobile responsiveness, console hygiene, and quickstart validation.

- [ ] T024 [P] Apply basic Tailwind responsive layout classes to all section components so content is readable at 320 px (no horizontal overflow, adequate padding)
- [ ] T025 [P] Apply Tailwind classes to `src/components/Nav.tsx` for a clean sticky header (background colour, z-index `z-50`, shadow or border-bottom so content scrolls under it visibly)
- [ ] T026 Remove `src/assets/hero.png` import if unused, and any other dead asset references
- [ ] T027 Run `npm run build` and confirm zero TypeScript errors and zero lint errors
- [ ] T028 Open the dev server and manually verify all 5 success criteria from quickstart.md (SC-001 through SC-005)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — blocks Phases 3 & 4
- **User Story 1 (Phase 3)**: Depends on Phase 2; all T014–T019 can run in parallel
- **User Story 2 (Phase 4)**: Depends on Phase 2; can run in parallel with Phase 3
- **Polish (Phase 5)**: Depends on Phases 3 and 4

### User Story Dependencies

- **User Story 1 (P1)**: Depends only on Foundational phase
- **User Story 2 (P2)**: Depends only on Foundational phase — nav stubs exist after T012

### Within Each User Story

- All section-fill tasks (T014–T019) are fully parallel — each touches a different file
- T020 depends on T014–T019 being complete (asset cleanup check)
- T021–T023 are sequential within US2 (nav label → scroll → responsive)

---

## Parallel Opportunities

```bash
# Phase 2 — launch all section stubs at once:
T006: Hero.tsx stub
T007: Schedule.tsx stub
T008: Travel.tsx stub
T009: DressCode.tsx stub
T010: Registry.tsx stub
T011: Housekeeping.tsx stub

# Phase 3 — fill all sections in parallel:
T014: Fill Hero.tsx
T015: Fill Schedule.tsx
T016: Fill Travel.tsx
T017: Fill DressCode.tsx
T018: Fill Registry.tsx
T019: Fill Housekeeping.tsx

# Phase 5 — polish in parallel:
T024: Responsive section classes
T025: Nav sticky header classes
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T004)
2. Complete Phase 2: Foundational (T005–T013)
3. Complete Phase 3: User Story 1 (T014–T020)
4. **STOP and VALIDATE**: All 6 sections visible with bracket placeholders, no boilerplate
5. Deploy preview to Vercel if ready

### Full Delivery

1. Setup + Foundational → foundation ready
2. User Story 1 (all section content) → MVP deployed
3. User Story 2 (nav + smooth scroll) → navigation working
4. Polish → responsive + build clean

---

## Notes

- [P] tasks touch different files — safe to parallelise
- All placeholder strings use bracket format `[Like This]` — searchable with a single `[` grep
- Tailwind v4 requires no `tailwind.config.js` — config is in `vite.config.ts` + `index.css` only
- Run `npm run build` after T027 to catch TypeScript errors before marking complete
