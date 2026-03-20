// Wire format: one element in the array returned by the GAS web app
export interface GasGuest {
  full_name: string
  max_guests: number
}

// Top-level shape returned by the GAS web app (HTTP always 200)
// Success: { guests: GasGuest[] }   — array may be empty
// Failure: { error: string }        — auth rejection or script error
export interface GasResponse {
  guests?: GasGuest[] | null
  error?: string
}

export interface GuestRecord {
  full_name: string
  normalised_name: string
  first_initial: string
  last_name_normalised: string
  max_guests: number
}

export interface MatchedGuest {
  full_name: string
  max_guests: number
}

export interface LookupRequest {
  name: string
}

export interface LookupResponse {
  status: 'found' | 'not_found'
  matches: MatchedGuest[]
}
