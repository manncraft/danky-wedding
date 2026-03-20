# Research: Landing Page with Wedding Information

## Decision: Tailwind CSS Setup

**Decision**: Install Tailwind CSS v4 (Vite-first) as the first task in this feature.

**Rationale**: The constitution locks Tailwind as the styling layer. It is not yet in
`package.json`. The Vite-native Tailwind v4 plugin (`@tailwindcss/vite`) removes the
need for a `tailwind.config.js` file — configuration lives in `index.css`.

**Alternatives considered**: Plain CSS modules (rejected — not the locked stack),
styled-components (rejected — CSS-in-JS violates constitution).

**Setup steps**:
```bash
npm install tailwindcss @tailwindcss/vite
```
Then add the plugin to `vite.config.ts` and replace `index.css` content with
`@import "tailwindcss";`.

---

## Decision: Component-Per-Section Architecture

**Decision**: Each information section is its own `.tsx` file under
`src/components/sections/`. `App.tsx` is the assembly point only — it imports
and renders sections in order with no logic.

**Rationale**: Spec FR-007 requires each section to be independently replaceable.
A flat file-per-section structure means the couple (or developer) can swap one
section without touching any other file.

**Alternatives considered**: Single monolithic page component (rejected — violates
FR-007), dynamic section registry (rejected — unnecessary complexity for 6 sections).

---

## Decision: Sticky Nav Implementation

**Decision**: Use CSS `position: sticky; top: 0` (via Tailwind `sticky top-0`)
on the `<nav>` element. No JS scroll listeners needed.

**Rationale**: Pure CSS sticky is zero-JS, works without hydration, and satisfies
the edge case requirement that layout-critical behaviour must not depend on JS.

---

## Decision: Placeholder Content Format

**Decision**: All placeholder strings use bracket notation: `[Partner 1 Name]`,
`[Wedding Date]`, `[Venue Name]`, etc. Strings are hardcoded directly in each
section component.

**Rationale**: Bracket-format is grep-able (`[`) and immediately recognisable as
placeholder content. The couple can open any section file and do a simple
find-and-replace.

---

## Decision: No Tests for This Feature

**Decision**: No automated tests will be written for this feature.

**Rationale**: The spec does not request tests. The validation criteria (SC-001
through SC-005) are all visual/browser checks that are faster to verify manually
for a static page. Test infrastructure will be set up when a feature that
warrants it is specified.
