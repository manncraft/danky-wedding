# Research: Lavender Background Styling

**Feature**: 015-lavender-background  
**Date**: 2026-04-24

---

## Decision 1: Fixed background technique

**Decision**: Use a fixed-position `<div>` containing an `<img>` element, rather than CSS `background-attachment: fixed`.

**Rationale**: `background-attachment: fixed` is unreliable on iOS Safari and Chrome for Android. Apple's rendering engine clips the background to the element bounds rather than the viewport, making the image appear to scroll with the page or disappear entirely. A fixed-position DOM element (`position: fixed; z-index: -1; pointer-events: none`) is rendered consistently across all browsers including iOS Safari.

**Alternatives considered**:
- `background-attachment: fixed` on `body`: Works on desktop Chrome/Firefox but broken on iOS Safari — ruled out given constitution Principle I (mobile-first).
- CSS `position: sticky` on a wrapper: More complex, still has iOS quirks.
- JavaScript scroll listener to reposition: Over-engineered for a decorative element.

---

## Decision 2: Image file location

**Decision**: Place the lavender illustration in `public/lavender.png` (repo root `public/` directory).

**Rationale**: Vite serves files from `public/` at the root URL path (`/lavender.png`). This is the standard location for assets referenced by URL in JSX (`src="/lavender.png"`) rather than by ES import. No bundling or hashing occurs, which is fine for a decorative image that can be cached indefinitely.

**Alternatives considered**:
- `src/assets/lavender.png` with ES import: Correct for assets that should be bundled/hashed, but adds an import to `App.tsx` for what is purely a presentational concern.

---

## Decision 3: Off-white background colour

**Decision**: Use `#f5f4f0` as the initial off-white background colour. The exact value will be eyedropper-sampled from the image during implementation and adjusted if needed.

**Rationale**: Visual inspection of the provided lavender illustration shows a very light warm off-white background, consistent with approximately `#f5f4f0`. This is slightly warmer than pure white (`#ffffff`) and matches the hand-painted watercolour aesthetic. The value is intentionally a starting point — the implementer should use a colour picker on the actual image to confirm or refine.

**Alternatives considered**:
- `#ffffff` (pure white): Too cool; would create a visible edge against the warm illustration background.
- `#fafaf8`: Plausible alternative if `#f5f4f0` appears too yellow.

---

## Decision 4: Where to apply background colour

**Decision**: Apply `background-color` to the `body` element via `src/index.css`.

**Rationale**: The body is the full-page canvas. Setting it there ensures the colour covers the entire viewport even when content is shorter than the window height, and it applies to both the landing view and the RSVP view without touching any component.

**Alternatives considered**:
- On a root `<div>` in `App.tsx`: Would require the div to have `min-h-screen`, adding complexity.
- As a Tailwind class on `<body>` in `index.html`: Not idiomatic — Tailwind recommends global CSS for base-layer overrides.

---

## Decision 5: Mobile behaviour

**Decision**: Hide the lavender illustration on viewports narrower than Tailwind's `sm` breakpoint (640 px) using `hidden sm:block`.

**Rationale**: On narrow phones the illustration would overlap the centered text content. The off-white background colour alone provides the correct aesthetic on mobile. The illustration is visible on tablets (≥640 px) and desktop where it sits beside rather than behind the text column (`max-w-2xl` is 672 px, so on a 640–672 px viewport there is minimal overlap).

**Alternatives considered**:
- Show on all sizes with `pointer-events: none` only: The image would obscure text on 320–480 px phones even without blocking clicks — poor readability.
- Show on ≥768 px (`md`): More conservative, but the `sm` breakpoint is sufficient to clear the content column.

---

## Decision 6: Nav background consistency

**Decision**: Change the Nav's `bg-white` to the same off-white (`bg-[#f5f4f0]` or a CSS variable) as part of this feature.

**Rationale**: With a warm off-white body background, the Nav's `bg-white` would create a visible cool strip at the top. Matching them gives a seamless result. This is a small one-line change in `Nav.tsx`.

**Alternatives considered**:
- Leave Nav as `bg-white`: Creates an obvious colour mismatch at the top of every page.

---

## Summary of Resolved Unknowns

| Unknown | Resolution |
|---------|------------|
| Fixed background technique | Fixed-position `<div>` with `<img>` (avoids iOS Safari bug) |
| Image asset location | `public/lavender.png` |
| Off-white colour value | `#f5f4f0` (confirm by sampling image during implementation) |
| Where to set background colour | `body` in `src/index.css` |
| Mobile behaviour | Hide illustration below `sm` (640 px) |
| Nav colour consistency | Update Nav `bg-white` → off-white |
