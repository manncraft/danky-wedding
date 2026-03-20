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
