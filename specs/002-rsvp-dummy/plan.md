# Implementation Plan: RSVP Lookup Screen

**Branch**: `002-rsvp-dummy` | **Date**: 2026-03-20 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-rsvp-dummy/spec.md`

## Summary

Add an RSVP button to the sticky nav that switches the view from the landing
page to a new lookup screen. The lookup screen collects first name and last name
via a `react-hook-form`-managed form and shows a stub response on valid
submission. No backend calls are made. View switching is handled by React state
in `App.tsx`.

## Technical Context

**Language/Version**: TypeScript 5.9 / React 19
**Primary Dependencies**: React 19, Vite 8, Tailwind CSS v4, react-hook-form (to be installed)
**Storage**: N/A — no data persistence
**Testing**: N/A — manual QA via Vercel preview
**Target Platform**: Web browser, mobile-first (320 px+)
**Project Type**: SPA (web-app)
**Performance Goals**: Instant — all UI is local state, zero network
**Constraints**: No network requests on submit; inline validation on empty fields
**Scale/Scope**: 2 modified files (Nav.tsx, App.tsx), 1 new file (RsvpLookup.tsx)

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Guest-First, Mobile-First UX | ✅ PASS | Mobile-first; reachable in one tap from any scroll position |
| II. Zero-Cost Serverless Architecture | ✅ PASS | Pure client-side; no new infrastructure |
| III. Privacy & Security by Design | ✅ PASS | No data sent anywhere; no secrets involved |
| IV. MVP Discipline | ✅ PASS | 2-field stub only; plus-ones, dietary, kids toggle all deferred |
| V. Admin Visibility & Data Integrity | ✅ N/A | No backend writes in this feature |

No violations. Complexity Tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/002-rsvp-dummy/
├── plan.md          # This file
├── research.md      # Phase 0 output
├── quickstart.md    # Phase 1 output
└── tasks.md         # Phase 2 output (/speckit.tasks — not yet created)
```

### Source Code Changes

```text
src/
├── components/
│   ├── Nav.tsx              # UPDATE: add RSVP button; accept onRsvpClick prop
│   └── RsvpLookup.tsx       # NEW: lookup screen (first name, last name, Find Invite)
└── App.tsx                  # UPDATE: add view state ('landing' | 'rsvp-lookup');
                             #         pass onRsvpClick to Nav; render RsvpLookup
                             #         when state is 'rsvp-lookup'
```

Sections components untouched. `index.css` and `vite.config.ts` untouched.

**Structure Decision**: State-based navigation in `App.tsx`. `Nav` becomes a
controlled component receiving `onRsvpClick` as a prop. `RsvpLookup` is
self-contained and receives `onBack` prop to return to the landing view.

## Phase 0: Research

See [research.md](research.md). Key decisions:

- **react-hook-form**: Install now (locked stack); used for field-level validation
- **View navigation**: React state in `App.tsx` — no router
- **Nav prop pattern**: `onRsvpClick` callback — Nav stays presentational
- **Stub response**: Inline message replaces form on valid submit
- **Tests**: None

## Phase 1: Design

### Component Interface Summary

| Component | New Props | Behaviour |
|-----------|-----------|-----------|
| `Nav` | `onRsvpClick: () => void` | Renders existing nav links + "RSVP" button; calls prop on click |
| `RsvpLookup` | `onBack: () => void` | Form with first name, last name, Find Invite button; shows stub on valid submit; calls `onBack` on close |
| `App` | — | Holds `view` state; conditionally renders landing sections or `RsvpLookup` |

### View State Machine

```
'landing'     → (RSVP button tapped)  → 'rsvp-lookup'
'rsvp-lookup' → (back/close tapped)   → 'landing'
'rsvp-lookup' → (valid form submit)   → stub message (inline, within RsvpLookup)
```

### Form Fields (react-hook-form)

| Field | Name | Validation |
|-------|------|------------|
| First Name | `firstName` | required |
| Last Name | `lastName` | required |

On valid submit: show stub message inline, no network call.
On invalid submit: display inline error beneath each empty field.

See [quickstart.md](quickstart.md) for setup and QA steps.
