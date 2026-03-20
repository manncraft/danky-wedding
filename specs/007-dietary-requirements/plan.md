# Implementation Plan: Add Dietary Requirements Field

**Branch**: `007-dietary-requirements` | **Date**: 2026-03-20 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/007-dietary-requirements/spec.md`

## Summary

Add an optional free-text dietary requirements field to the RSVP attendance form. The field appears only when the guest selects "Attending" and is cleared (and excluded from submission) when they toggle to "Not Attending". Four files are modified; no new dependencies are introduced.

## Technical Context

**Language/Version**: TypeScript 5.9 (frontend + Vercel function)
**Primary Dependencies**: React 19, react-hook-form 7, Zod, `@vercel/node`
**Storage**: N/A — backend stub; no persistence in this iteration
**Testing**: `npm test` (existing); `npm run lint`
**Target Platform**: Vercel (serverless function + Vite SPA)
**Project Type**: Web application (SPA + serverless API)
**Performance Goals**: No specific targets — small form field addition
**Constraints**: Must not break existing RSVP flow; field is optional
**Scale/Scope**: Single form field across 4 files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|---|---|---|
| I. Guest-First, Mobile-First UX | ✅ Pass | Single-line text input; mobile-friendly; no new steps added to RSVP flow |
| II. Zero-Cost Serverless Architecture | ✅ Pass | No new infrastructure; no new paid dependencies |
| III. Privacy & Security by Design | ✅ Pass | Dietary data is behind the existing `X-Invite-Secret` header; not exposed to other guests |
| IV. MVP Discipline | ✅ Pass | Dietary is explicitly named in the constitution RSVP schema (Principle V); this is MVP scope |
| V. Admin Visibility & Data Integrity | ✅ Pass | Constitution explicitly lists `dietary` as a required catering field; this feature fulfils that requirement |

**Post-design re-check**: All gates continue to pass. The implementation adds one optional field with no architectural change.

## Project Structure

### Documentation (this feature)

```text
specs/007-dietary-requirements/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── rsvp-submit.md   # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks — not yet created)
```

### Source Code (files touched)

```text
src/
├── types/
│   └── rsvp.ts                   # Add dietary?: string to RsvpSubmitRequest
├── services/
│   └── rsvpApi.ts                # Pass dietary in submitRsvp() call
└── components/
    └── RsvpLookup.tsx            # Render field conditionally; clear on toggle

api/
└── rsvp-submit.ts                # Validate optional dietary field
```

**Structure Decision**: Existing web-application layout; no new directories created.

## Phase 0: Research

See [research.md](research.md) for full decision log.

Key decisions:
- **Visibility**: `watch('attending')` drives conditional rendering of the dietary field
- **Clear on toggle**: `setValue('dietary', '')` called in attendance toggle handler when switching to "not attending"
- **Field type**: `<input type="text">` (not textarea) — "very simple" per spec
- **API**: `dietary` is optional in the request; trimmed server-side; omitted from payload when not attending
- **Whitespace**: Server trims the value; empty-after-trim is stored as absent

## Phase 1: Design & Contracts

### Data Model

See [data-model.md](data-model.md).

Change: `RsvpSubmitRequest` gains `dietary?: string`.

### Interface Contracts

See [contracts/rsvp-submit.md](contracts/rsvp-submit.md).

`POST /api/rsvp-submit` — one optional field added; backwards compatible.

### Implementation Details

#### 1. `src/types/rsvp.ts`

```typescript
export interface RsvpSubmitRequest {
  guest_name: string
  attending: boolean
  dietary?: string   // ADD
}
```

#### 2. `api/rsvp-submit.ts`

After existing `attending` validation, add:
```typescript
if (body.dietary !== undefined && typeof body.dietary !== 'string') {
  return res.status(400).json({ error: 'dietary must be a string' })
}
const dietary = typeof body.dietary === 'string' ? body.dietary.trim() : undefined
```

#### 3. `src/services/rsvpApi.ts`

`submitRsvp` gains an optional `dietary` parameter, passed in the body only when attending:
```typescript
export async function submitRsvp(
  guestName: string,
  attending: boolean,
  secret: string,
  dietary?: string,
): Promise<RsvpSubmitResponse>
// Body: { guest_name: guestName, attending, ...(attending && dietary ? { dietary } : {}) }
```

#### 4. `src/components/RsvpLookup.tsx`

- Register `dietary` field with `react-hook-form`
- Watch `attending` to drive visibility: `const attendingValue = watch('attending')`
- Define a single constant for all attending-gated fields and reset them via `useEffect` when attending toggles off:
  ```typescript
  const ATTENDING_GATED_FIELDS = ['dietary'] as const
  useEffect(() => {
    if (attendingValue !== 'true') {
      ATTENDING_GATED_FIELDS.forEach(field => setValue(field, ''))
    }
  }, [attendingValue, setValue])
  ```
  Adding future gated fields requires only updating `ATTENDING_GATED_FIELDS` — no changes to the toggle handler.
- Render the input conditionally: `{attendingValue === 'true' && <input ... {...register('dietary')} />}`
- Pass `dietary` value to `submitRsvp` on form submit (only when attending)
