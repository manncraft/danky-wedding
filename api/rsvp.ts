import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { GuestRecord, LookupResponse } from '../src/types/rsvp'

// ---------------------------------------------------------------------------
// Normalisation
// ---------------------------------------------------------------------------

function normaliseName(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .replace(/[^a-z0-9\s]/g, '')     // strip non-alphanumeric (keep spaces)
    .replace(/\s+/g, ' ')            // collapse multiple spaces
    .trim()
}

// ---------------------------------------------------------------------------
// Canned data
// ---------------------------------------------------------------------------

function buildRecord(fullName: string, maxGuests: number): GuestRecord {
  const normalised = normaliseName(fullName)
  const parts = normalised.split(' ')
  const lastNameNormalised = parts[parts.length - 1]
  const firstInitial = parts.length > 1 ? parts[0][0] : ''
  return {
    full_name: fullName,
    normalised_name: normalised,
    first_initial: firstInitial,
    last_name_normalised: lastNameNormalised,
    max_guests: maxGuests,
  }
}

const GUESTS: GuestRecord[] = [
  buildRecord('Alice Johnson', 2),
  buildRecord('Jane Smith', 3),
  buildRecord('John Smith', 1),
  buildRecord('Maria García', 4),
  buildRecord('Tom Williams', 2),
  buildRecord('Sophie Brown', 2),
]

// ---------------------------------------------------------------------------
// Matching
// ---------------------------------------------------------------------------

function findMatches(rawInput: string): GuestRecord[] {
  const normalised = normaliseName(rawInput)
  const parts = normalised.split(' ')
  const lastNameToken = parts[parts.length - 1]
  const firstInitialToken = parts.length > 1 ? parts[0][0] : null

  return GUESTS.filter((g) => {
    if (g.last_name_normalised !== lastNameToken) return false
    if (firstInitialToken !== null && g.first_initial !== firstInitialToken) return false
    return true
  })
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' })
  }

  const secret = req.headers['x-invite-secret']
  if (!process.env.INTERNAL_SECRET || secret !== process.env.INTERNAL_SECRET) {
    return res.status(401).json({ error: 'unauthorised' })
  }

  const { name } = req.body as { name?: unknown }

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'name is required' })
  }

  const matches = findMatches(name)

  const response: LookupResponse = {
    status: matches.length > 0 ? 'found' : 'not_found',
    matches: matches.map((g) => ({
      full_name: g.full_name,
      max_guests: g.max_guests,
    })),
  }

  return res.status(200).json(response)
}
