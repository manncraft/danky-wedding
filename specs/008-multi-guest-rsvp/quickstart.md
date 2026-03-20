# Quickstart: Multi-Guest RSVP (Feature 008)

**Branch**: `008-multi-guest-rsvp` | **Date**: 2026-03-20

## What changed

The RSVP attendance form gains a dynamic additional-guest section. When a guest's invitation allows more than one person and they are attending, they can add up to `max_guests - 1` additional party members, each with an optional dietary requirements field.

## Files to touch

| File | Change |
|------|--------|
| `src/types/rsvp.ts` | Add `AdditionalGuest` type; extend `RsvpSubmitRequest` with `additional_guests?` |
| `src/components/RsvpLookup.tsx` | Extend `AttendanceFormData`; add `useFieldArray`; render multi-guest section |
| `src/services/rsvpApi.ts` | Pass `additional_guests` in submit payload |
| `api/rsvp-submit.ts` | Accept and validate `additional_guests` in stub |
| `tests/components/RsvpLookup.test.tsx` | Add multi-guest behaviour tests |

## Key implementation notes

### useFieldArray setup

```typescript
// Inside the attendance form component
const { fields, append, remove, replace } = useFieldArray({
  control,
  name: 'additionalGuests',
})
```

### Clearing guests when declining

```typescript
// Watch attending value; when it flips to 'false', clear the array
const attending = watch('attending')
useEffect(() => {
  if (attending === 'false') replace([])
}, [attending, replace])
```

### Add Guest button visibility

```typescript
// guest.max_guests comes from MatchedGuest passed into the component
const canAddGuest = attending === 'true' && fields.length < guest.max_guests - 1
```

### Submit payload construction

```typescript
const onSubmit = (data: AttendanceFormData) => {
  const attending = data.attending === 'true'
  const primaryGuest: Guest = {
    name: guest.full_name,
    type: 'primary',
    ...(data.dietary ? { dietary: data.dietary } : {}),
  }
  const plusOnes: Guest[] = attending
    ? (data.additionalGuests ?? []).map(g => ({ name: g.name, type: 'plus-one' as const, dietary: g.dietary }))
    : []
  const payload: RsvpSubmitRequest = {
    attending,
    guests: [primaryGuest, ...plusOnes],
  }
  submitRsvp(payload)
}
```

## Testing the feature locally

1. In `api/rsvp.ts`, temporarily return a guest with `max_guests: 3` to exercise multi-guest flow
2. Complete the name lookup
3. Select "Attending"
4. Verify "Are you RSVPing for anyone else?" label and "Add Guest" button appear
5. Add 2 guests — verify "Add Guest" button disappears at capacity
6. Remove one — verify button reappears
7. Switch to "Not Attending" — verify additional guest sections disappear
8. Submit and inspect browser network tab for correct payload shape
