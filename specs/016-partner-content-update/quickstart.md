# Quickstart: Partner Content Update

**Branch**: `016-partner-content-update`

## What this feature does

Updates the wedding landing page with the partner-provided content from `docs/content.md`. Page sections map 1:1 to the bold headers in that file. Four existing components are deleted and replaced; two are updated in-place; five are created new.

## Files changed

| File | Change |
|------|--------|
| `src/components/sections/Hero.tsx` | Update — combined subtitle line |
| `src/components/sections/DateAndTime.tsx` | **Create** — ceremony time + arrival guidance |
| `src/components/sections/Venue.tsx` | **Create** — venue name, address, Google Maps link |
| `src/components/sections/ParkingTransportation.tsx` | **Create** — parking note + taxi/rideshare warning |
| `src/components/sections/DressCode.tsx` | Update — full content + examples |
| `src/components/sections/DietaryRestrictions.tsx` | **Create** — dietary note |
| `src/components/sections/Gifts.tsx` | **Create** — wishing well message |
| `src/components/sections/Timeline.tsx` | **Create** — 6-entry day timeline |
| `src/components/sections/Travel.tsx` | **Delete** |
| `src/components/sections/Schedule.tsx` | **Delete** |
| `src/components/sections/Registry.tsx` | **Delete** |
| `src/components/sections/Housekeeping.tsx` | **Delete** |
| `src/App.tsx` | Update — new imports, correct order |

## Running locally

```bash
npm install       # no new deps, but ensure lockfile is current
npm run dev       # http://localhost:5173
```

## Verification checklist

- [ ] Hero shows "Becky & Daniel" and "12 January 2027 | Markovina Vineyard Estate" — nothing else
- [ ] Date & Time section shows ceremony time (3pm) and arrival note (no earlier than 2:30pm)
- [ ] Venue section shows venue name, address, and working Google Maps link
- [ ] Parking & Transportation section shows parking overnight note and taxi/rideshare warning
- [ ] Dress Code section shows semi-formal label, context sentence, clothing examples, footwear examples
- [ ] Dietary Restrictions section shows dietary note only
- [ ] Gifts section shows wishing well message — exact wording from `content.md`
- [ ] Timeline section shows all 6 entries: 2:30pm, 3:00pm, 3:30pm, 5:45pm, 9:30pm, 10:00pm
- [ ] No raw bracket placeholders visible anywhere on the page
- [ ] Deleted files (`Travel.tsx`, `Schedule.tsx`, `Registry.tsx`, `Housekeeping.tsx`) are gone
- [ ] Page renders correctly on a mobile viewport (375px wide)

## Content source

All copy is taken verbatim from `docs/content.md`.
