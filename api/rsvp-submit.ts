import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { Guest, RsvpSubmitRequest, RsvpSubmitResponse } from '../src/types/rsvp.js'

export default function handler(req: VercelRequest, res: VercelResponse) {
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

  const response: RsvpSubmitResponse = { status: 'ok' }
  return res.status(200).json(response)
}
