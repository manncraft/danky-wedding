import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { GasGuest, GasResponse, GuestRecord, LookupResponse } from '../src/types/rsvp'

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
// GAS data source
// ---------------------------------------------------------------------------

async function fetchGuests(): Promise<GuestRecord[]> {
  const url = process.env.GAS_ENDPOINT_URL
  const secret = process.env.GAS_SECRET

  if (!url || !secret) {
    throw new Error('GAS_ENDPOINT_URL and GAS_SECRET environment variables must be set')
  }

  const timeoutMs = Number(process.env.GAS_TIMEOUT_MS) || 6000

  const res = await fetch(
    `${url}?secret=${encodeURIComponent(secret)}`,
    { signal: AbortSignal.timeout(timeoutMs) },
  )

  const body = (await res.json()) as GasResponse

  // Dual error check: explicit error key OR missing/null guests field
  if (body.error || body.guests == null) {
    throw new Error(`GAS error: ${body.error ?? 'guests field missing or null'}`)
  }

  return body.guests.map((g: GasGuest) => {
    const normalised = normaliseName(g.full_name)
    const parts = normalised.split(' ')
    const lastNameNormalised = parts[parts.length - 1]
    const firstInitial = parts.length > 1 ? parts[0][0] : ''
    return {
      full_name: g.full_name,
      normalised_name: normalised,
      first_initial: firstInitial,
      last_name_normalised: lastNameNormalised,
      max_guests: g.max_guests,
    }
  })
}

// ---------------------------------------------------------------------------
// Matching
// ---------------------------------------------------------------------------

function findMatches(guests: GuestRecord[], rawInput: string): GuestRecord[] {
  const normalised = normaliseName(rawInput)
  const parts = normalised.split(' ')
  const lastNameToken = parts[parts.length - 1]
  const firstInitialToken = parts.length > 1 ? parts[0][0] : null

  return guests.filter((g) => {
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

  let guests: GuestRecord[]
  try {
    guests = await fetchGuests()
  } catch (err) {
    console.error('[rsvp] failed to fetch guests from GAS:', err)
    return res.status(502).json({ error: 'could not load guest list' })
  }

  const matches = findMatches(guests, name)

  const response: LookupResponse = {
    status: matches.length > 0 ? 'found' : 'not_found',
    matches: matches.map((g) => ({
      full_name: g.full_name,
      max_guests: g.max_guests,
    })),
  }

  return res.status(200).json(response)
}
