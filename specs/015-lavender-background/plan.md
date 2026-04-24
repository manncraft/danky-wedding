# Implementation Plan: Lavender Background Styling

**Branch**: `015-lavender-background` | **Date**: 2026-04-24 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `/specs/015-lavender-background/spec.md`

## Summary

Add a decorative lavender botanical illustration fixed to the left viewport edge over a seamlessly matching off-white background colour. The illustration is implemented as a fixed-position DOM element (not CSS `background-attachment`) to ensure consistent behaviour on iOS Safari and all mobile browsers.

## Technical Context

**Language/Version**: TypeScript 5.9 / React 19  
**Primary Dependencies**: React 19, Vite 8, Tailwind CSS v4 (`@tailwindcss/vite`)  
**Storage**: N/A — static image asset only  
**Testing**: Visual review in browser (desktop + mobile emulation); no automated tests required for purely decorative change  
**Target Platform**: Web browser — desktop and mobile (iOS Safari is the critical mobile path per constitution Principle I)  
**Project Type**: Single-project SPA (source at repo root, no separate `frontend/` directory)  
**Performance Goals**: Negligible — the illustration is a single decorative image outside the render-critical path  
**Constraints**: `background-attachment: fixed` is broken on iOS Safari; must use a fixed-position DOM element instead. Illustration must not obscure text content on any viewport width.  
**Scale/Scope**: Cosmetic change to four files; no new dependencies

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Guest-First, Mobile-First UX | ✅ Pass | Illustration hidden below 640 px (`sm` breakpoint); content readability unaffected on mobile |
| II. Zero-Cost Serverless Architecture | ✅ Pass | Purely frontend change; no new infrastructure, no new dependencies |
| III. Privacy & Security by Design | ✅ Pass | N/A — no data, no auth, no secrets |
| IV. MVP Discipline | ✅ Pass | Explicitly requested landing-page polish; no scope creep |
| V. Admin Visibility & Data Integrity | ✅ Pass | N/A — no backend or data changes |

No violations. Complexity Tracking table not required.

## Project Structure

### Documentation (this feature)

```text
specs/015-lavender-background/
├── plan.md          ← this file
├── research.md      ← Phase 0 output
├── quickstart.md    ← Phase 1 output
└── tasks.md         ← Phase 2 output (/speckit.tasks — not yet created)
```

No `data-model.md` or `contracts/` — this feature involves no data entities or external interfaces.

### Source Code (repository root)

```text
public/
└── lavender.png           ← NEW: lavender botanical illustration

src/
├── index.css              ← MODIFIED: add body background-color
├── App.tsx                ← MODIFIED: add fixed-position decorative image element
└── components/
    └── Nav.tsx            ← MODIFIED: bg-white → off-white to match body
```

**Structure Decision**: Single-project layout at repo root (Vite SPA). All changes are confined to the frontend source and the `public/` static asset directory. No new files except the image asset.

## Implementation Phases

### Phase A — Asset

1. Place the provided lavender illustration at `public/lavender.png`.

### Phase B — Global background colour

2. In `src/index.css`, add under the existing `html` block:
   ```css
   body {
     background-color: #f5f4f0;
   }
   ```
   Confirm the hex value by eyedropper-sampling the illustration's near-white background. Adjust if needed (likely in the `#f5f4f0`–`#faf9f7` range).

### Phase C — Fixed decorative element

3. In `src/App.tsx`, add a fixed-position wrapper element as the first child of the fragment, before `<Nav>`:
   ```tsx
   <div
     aria-hidden="true"
     className="fixed left-0 top-0 h-screen pointer-events-none z-[-1] hidden sm:block"
   >
     <img
       src="/lavender.png"
       alt=""
       className="h-full w-auto object-contain object-top"
     />
   </div>
   ```
   Key properties:
   - `fixed left-0 top-0` — pins to left viewport edge, does not scroll
   - `z-[-1]` — behind all page content
   - `pointer-events-none` — decorative; never blocks clicks
   - `hidden sm:block` — invisible below 640 px, visible on tablet and desktop
   - `h-full w-auto` — image fills viewport height at natural aspect ratio, no stretching

### Phase D — Nav colour consistency

4. In `src/components/Nav.tsx`, change `bg-white` to `bg-[#f5f4f0]` (same value as body) so the sticky nav bar matches the page background rather than contrasting with it.

## Verification

See [quickstart.md](quickstart.md) for step-by-step visual verification instructions.
