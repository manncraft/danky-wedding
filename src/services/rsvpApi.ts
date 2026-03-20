import type { LookupResponse, RsvpSubmitResponse } from '../types/rsvp'

export class RsvpApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'RsvpApiError'
    this.status = status
  }
}

export async function lookup(
  firstName: string,
  lastName: string,
  secret: string,
): Promise<LookupResponse> {
  const name = `${firstName} ${lastName}`.trim()

  let response: Response
  try {
    response = await fetch('/api/rsvp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Invite-Secret': secret,
      },
      body: JSON.stringify({ name }),
    })
  } catch {
    throw new RsvpApiError('Network error — please check your connection')
  }

  if (!response.ok) {
    throw new RsvpApiError('Server error', response.status)
  }

  return response.json() as Promise<LookupResponse>
}

export async function submitRsvp(
  guestName: string,
  attending: boolean,
  secret: string,
): Promise<RsvpSubmitResponse> {
  let response: Response
  try {
    response = await fetch('/api/rsvp-submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Invite-Secret': secret,
      },
      body: JSON.stringify({ guest_name: guestName, attending }),
    })
  } catch {
    throw new RsvpApiError('Network error — please check your connection')
  }

  if (!response.ok) {
    throw new RsvpApiError('Server error', response.status)
  }

  return response.json() as Promise<RsvpSubmitResponse>
}
