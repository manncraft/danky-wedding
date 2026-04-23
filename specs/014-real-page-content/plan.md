# Implementation Plan: Add Real Page Content

**Branch**: `014-real-page-content` | **Date**: 2026-04-23 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/014-real-page-content/spec.md`

## Summary

Replace all placeholder text across the six landing page sections with confirmed real content (Becky & Daniel, 12 January 2027, Markovina Vineyard Estate, plus schedule and travel details). Sections whose content is not yet confirmed (Housekeeping, Registry) are hidden from both the page and the nav until content is provided. The RSVP song suggestion placeholder is deferred pending confirmation of an example song.

## Technical Context

**Language/Version**: TypeScript 5.9 / React 19  
**Primary Dependencies**: Vite 8, Tailwind CSS v4 (no new dependencies)  
**Storage**: N/A — static content hardcoded in React components  
**Testing**: `npm test && npm run lint`  
**Target Platform**: Web, mobile-first (390px+)  
**Project Type**: Web application (SPA)  
**Performance Goals**: No change — static content renders instantly  
**Constraints**: No new dependencies; no backend changes  
**Scale/Scope**: 6 section components + Nav + 1 RSVP input placeholder

## Constitution Check

| Principle | Status | Notes |
|---|---|---|
| I. Guest-First, Mobile-First UX | ✅ Pass | Content updates; no new UI complexity. All layouts unchanged. |
| II. Zero-Cost Serverless Architecture | ✅ Pass | No new infrastructure or dependencies. |
| III. Privacy & Security by Design | ✅ Pass | No data handling or secrets involved. |
| IV. MVP Discipline | ✅ Pass | Replacing placeholder content is core MVP functionality. |
| V. Admin Visibility & Data Integrity | ✅ N/A | No backend or sheet changes. |

No violations. Complexity Tracking table not required.

## Project Structure

### Documentation (this feature)

```text
specs/014-real-page-content/
├── plan.md              ← this file
├── spec.md
├── checklists/
│   └── requirements.md
└── tasks.md             ← created by /speckit.tasks
```

### Source Code (files to modify)

```text
src/
├── App.tsx                              ← remove <Housekeeping /> and <Registry /> renders
├── components/
│   │   ├── Nav.tsx                          ← remove Housekeeping and Registry nav links
│   └── RsvpLookup.tsx               ← remove song suggestion placeholder text (line 337)
│   └── sections/
│       ├── Hero.tsx                     ← names, date, venue
│       ├── Schedule.tsx                 ← arrival, ceremony, end times
│       ├── Travel.tsx                   ← address, map link, parking, taxi note
│       └── DressCode.tsx               ← "Semi-formal" (examples deferred)
```

**Not modified in this iteration**:
- `src/components/sections/Housekeeping.tsx` — content pending; hidden from page and nav
- `src/components/sections/Registry.tsx` — content pending; hidden from page and nav

## Implementation Notes

### Hero.tsx
- Replace `[Partner 1 Name] & [Partner 2 Name]` → `Becky & Daniel`
- Replace `[Wedding Date]` → `Tuesday 12th January 2027`
- Replace `[Venue Name]` → `Markovina Vineyard Estate`

### Schedule.tsx
Replace placeholder paragraph with a clean prose sentence and a simple time list:
- Guests arrive: **no earlier than 2:30pm**
- Ceremony begins: **3:00pm**
- Reception ends: **10:00pm**

### Travel.tsx
Replace all placeholder content with:
- Address: **84 Old Railway Road, Kumeū 0892**
- Map link: **https://maps.app.goo.gl/ftf9UaBvExe9XRNJ9** (labelled "Open in Google Maps" or similar)
- Parking note: **Available onsite. Cars may be left overnight and collected by 11am the following day.**
- Taxi/Uber note: **Available in the area. We recommend booking ahead — they can be difficult to get at short notice in Kumeu.**

### DressCode.tsx
- Replace `[Dress Code Description]` → `Semi-formal`
- No examples yet — content confirmed as pending; a brief placeholder sentence is acceptable if it adds context, otherwise just the label

### App.tsx
- Remove `<Housekeeping />` from the landing page render (and its import if unused)
- Remove `<Registry />` from the landing page render (and its import if unused)

### Nav.tsx
- Remove the `Housekeeping` and `Registry` `<li>` items from the nav list
- These will be re-added in a future chat when content is confirmed

### Deferred (future chats)
- **FR-005 Housekeeping**: Re-add `<Housekeeping />` to App.tsx and nav once content confirmed
- **FR-006 Registry**: Re-add `<Registry />` to App.tsx and nav once content confirmed
- **FR-007 Song placeholder**: ~~Deferred~~ — remove `placeholder="e.g. Mr Brightside – The Killers"` from the song input in `RsvpLookup.tsx` line 337 (leave empty)
- **FR-004 Dress Code examples**: Add guidance text to DressCode.tsx once examples confirmed
