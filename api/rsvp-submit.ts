import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { RsvpSubmitRequest, RsvpSubmitResponse } from '../src/types/rsvp.js'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' })
  }

  const secret = req.headers['x-invite-secret']
  if (!process.env.INTERNAL_SECRET || secret !== process.env.INTERNAL_SECRET) {
    return res.status(401).json({ error: 'unauthorised' })
  }

  const body = req.body as Partial<RsvpSubmitRequest>

  if (typeof body.guest_name !== 'string' || body.guest_name.trim() === '') {
    return res.status(400).json({ error: 'guest_name is required' })
  }

  if (typeof body.attending !== 'boolean') {
    return res.status(400).json({ error: 'attending must be a boolean' })
  }

  if (body.dietary !== undefined && typeof body.dietary !== 'string') {
    return res.status(400).json({ error: 'dietary must be a string' })
  }

  const response: RsvpSubmitResponse = { status: 'ok' }
  return res.status(200).json(response)
}
