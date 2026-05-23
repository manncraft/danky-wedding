# Research: Partner Content Update

**Branch**: `016-partner-content-update` | **Date**: 2026-05-23

## Decision Log

### 1. Component structure — 1:1 mapping to bold headers

**Decision**: Each bold header in `docs/content.md` becomes exactly one page section component. No merging or splitting of content across components.

**Rationale**: The user confirmed the bold headers define the sections. A strict 1:1 mapping keeps the codebase self-documenting — component name matches section heading — and prevents future ambiguity about where content lives.

**Mapping**:

| Bold header in `content.md` | Component file | Action |
|-----------------------------|----------------|--------|
| *(hero)* | `Hero.tsx` | Update |
| **Date & Time:** | `DateAndTime.tsx` | Create |
| **Venue** | `Venue.tsx` | Create |
| **Parking & Transportation:** | `ParkingTransportation.tsx` | Create |
| **Dress Code:** | `DressCode.tsx` | Update |
| **Dietary Restrictions:** | `DietaryRestrictions.tsx` | Create |
| **Gifts:** | `Gifts.tsx` | Create |
| **Timeline** | `Timeline.tsx` | Create |
| *(no mapping)* | `Travel.tsx` | Delete |
| *(no mapping)* | `Schedule.tsx` | Delete |
| *(no mapping)* | `Registry.tsx` | Delete |
| *(no mapping)* | `Housekeeping.tsx` | Delete |

**Alternatives considered**:
- Merge Venue + Parking into one Travel component — rejected; doesn't match the 1:1 intent and conflates two distinct guest concerns (where is it / how do I get home).
- Keep Schedule, rename content — rejected; the component name would no longer match the section heading.

---

### 2. Section order

**Decision**: Follow `docs/content.md` top-to-bottom: Hero → DateAndTime → Venue → ParkingTransportation → DressCode → DietaryRestrictions → Gifts → Timeline.

**Rationale**: The content file was authored in the order the couple wants guests to read it. Timeline moves to last — it's day-of reference material, not primary information guests need first.

---

### 3. Google Maps URL

**Decision**: Preserve the existing Google Maps URL from `Travel.tsx` verbatim in the new `Venue.tsx`.

**Rationale**: The URL already points to the correct venue location. No change needed.

---

### 4. No new dependencies

**Decision**: Confirmed — no new packages required.

**Rationale**: All changes are text content within React components using existing Tailwind utility classes. The dress code two-column layout (required, not optional) can be achieved with existing `grid` or `flex` utilities — no new dependencies needed.
