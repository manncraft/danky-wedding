import type { VercelRequest, VercelResponse } from '@vercel/node'
import type {
  Guest,
  RsvpSubmitRequest,
  RsvpSubmitResponse,
  RsvpRow,
  GasWriteRequest,
  GasWriteResponse,
} from '../src/types/rsvp.js'

export function flattenToRows(request: RsvpSubmitRequest, timestamp: string): RsvpRow[] {
  const inviteSource = request.guests[0].name

  if (!request.attending) {
    const primary = request.guests[0]
    return [
      {
        timestamp,
        guest_name: primary.name,
        attending: 'no',
        dietary: primary.dietary ?? '',
        type: 'Primary',
        invite_source: inviteSource,
        is_child: '',
        age_range: '',
        seating_needs: '',
        safety_ack: '',
      },
    ]
  }

  return request.guests.map((guest: Guest) => ({
    timestamp,
    guest_name: guest.name,
    attending: 'yes',
    dietary: guest.dietary ?? '',
    type: guest.type === 'primary' ? 'Primary' : 'Plus-One',
    invite_source: inviteSource,
    is_child: '',
    age_range: '',
    seating_needs: '',
    safety_ack: '',
  }))
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' })
  }

  const secret = req.headers['x-invite-secret']
  if (!process.env.INTERNAL_SECRET || secret !== process.env.INTERNAL_SECRET) {
    return res.status(401).json({ error: 'unauthorised' })
  }

  const body = req.body as Partial<RsvpSubmitRequest>

  if (typeof body.attending !== 'boolean') {
    return res.status(400).json({ error: 'attending must be a boolean' })
  }

  if (!Array.isArray(body.guests) || body.guests.length === 0) {
    return res.status(400).json({ error: 'guests must be a non-empty array' })
  }

  const guests = body.guests as Guest[]

  if (guests[0].type !== 'primary') {
    return res.status(400).json({ error: 'guests[0].type must be "primary"' })
  }

  if (typeof guests[0].name !== 'string' || guests[0].name.trim() === '') {
    return res.status(400).json({ error: 'guests[0].name is required' })
  }

  for (let i = 1; i < guests.length; i++) {
    if (typeof guests[i].name !== 'string' || guests[i].name.trim() === '') {
      return res.status(400).json({ error: `guests[${i}].name is required` })
    }
  }

  const timestamp = new Date().toISOString()
  const rows = flattenToRows({ attending: body.attending, guests }, timestamp)

  const gasRequest: GasWriteRequest = {
    secret: process.env.GAS_SECRET ?? '',
    rows,
  }

  try {
    const timeoutMs = Number(process.env.GAS_TIMEOUT_MS ?? 6000)
    const gasRes = await fetch(process.env.GAS_ENDPOINT_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gasRequest),
      signal: AbortSignal.timeout(timeoutMs),
    })
    const gasBody = (await gasRes.json()) as GasWriteResponse
    if (gasBody.error) {
      console.error('GAS write error:', gasBody.error)
      return res.status(502).json({ error: 'failed to save RSVP' })
    }
  } catch (err) {
    console.error('GAS write failed:', err)
    return res.status(502).json({ error: 'failed to save RSVP' })
  }

  const response: RsvpSubmitResponse = { status: 'ok' }
  return res.status(200).json(response)
}
