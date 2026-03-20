import type { LookupResponse } from '../types/rsvp'

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
): Promise<LookupResponse> {
  const name = `${firstName} ${lastName}`.trim()

  let response: Response
  try {
    response = await fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
