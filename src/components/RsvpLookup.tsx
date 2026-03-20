import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { lookup, RsvpApiError } from '../services/rsvpApi'
import type { MatchedGuest } from '../types/rsvp'

interface RsvpLookupProps {
  onBack: () => void
}

interface LookupFormData {
  firstName: string
  lastName: string
}

type ViewState =
  | { kind: 'form' }
  | { kind: 'loading' }
  | { kind: 'select'; matches: MatchedGuest[] }
  | { kind: 'confirmed'; guest: MatchedGuest }
  | { kind: 'not_found' }
  | { kind: 'error' }

const SESSION_KEY = 'invite_secret'

export default function RsvpLookup({ onBack }: RsvpLookupProps) {
  const [secret, setSecret] = useState<string | null>(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('s')
    if (fromUrl) {
      sessionStorage.setItem(SESSION_KEY, fromUrl)
      return fromUrl
    }
    return sessionStorage.getItem(SESSION_KEY)
  })
  const [view, setView] = useState<ViewState>({ kind: 'form' })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LookupFormData>()

  const onSubmit = async (data: LookupFormData) => {
    setView({ kind: 'loading' })
    try {
      const result = await lookup(data.firstName, data.lastName, secret!)
      if (result.status === 'not_found' || result.matches.length === 0) {
        setView({ kind: 'not_found' })
      } else if (result.matches.length === 1) {
        setView({ kind: 'confirmed', guest: result.matches[0] })
      } else {
        setView({ kind: 'select', matches: result.matches })
      }
    } catch (err) {
      if (err instanceof RsvpApiError && err.status === 401) {
        sessionStorage.removeItem(SESSION_KEY)
        setSecret(null)
      } else {
        setView({ kind: 'error' })
      }
    }
  }

  const reset = () => setView({ kind: 'form' })

  if (secret === null) {
    return (
      <div className="min-h-screen flex flex-col items-center px-6 py-10">
        <div className="w-full max-w-md">
          <button
            onClick={onBack}
            className="mb-6 text-sm text-gray-500 hover:text-gray-800"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-semibold mb-2">Please use your invite link</h1>
          <p className="text-sm text-gray-500">
            Scan the QR code on your physical invitation to access the RSVP.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-10">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="mb-6 text-sm text-gray-500 hover:text-gray-800"
        >
          ← Back
        </button>

        {view.kind === 'form' && (
          <>
            <h1 className="text-2xl font-semibold mb-2">Find Your Invite</h1>
            <p className="text-sm text-gray-500 mb-8">
              Enter your name to look up your invitation.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <label htmlFor="firstName" className="text-sm font-medium">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  {...register('firstName', { required: 'First name is required' })}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  {...register('lastName', { required: 'Last name is required' })}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gray-900 text-white text-sm py-2.5 rounded hover:bg-gray-700"
              >
                Find Invite
              </button>
            </form>
          </>
        )}

        {view.kind === 'loading' && (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Looking you up…</p>
          </div>
        )}

        {view.kind === 'select' && (
          <>
            <h2 className="text-xl font-semibold mb-2">Which one is you?</h2>
            <p className="text-sm text-gray-500 mb-6">
              We found a few guests with that name. Tap yours to continue.
            </p>
            <ul className="flex flex-col gap-3">
              {view.matches.map((guest) => (
                <li key={guest.full_name}>
                  <button
                    onClick={() => setView({ kind: 'confirmed', guest })}
                    className="w-full text-left border border-gray-200 rounded px-4 py-3 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-medium">{guest.full_name}</span>
                    <span className="block text-xs text-gray-500 mt-0.5">
                      Party of up to {guest.max_guests}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {view.kind === 'confirmed' && (
          <>
            <h2 className="text-xl font-semibold mb-2">Found you!</h2>
            <div className="border border-gray-200 rounded px-4 py-4 mb-6">
              <p className="text-sm font-medium">{view.guest.full_name}</p>
              <p className="text-xs text-gray-500 mt-1">
                Party of up to {view.guest.max_guests}
              </p>
            </div>
            <p className="text-sm text-gray-500">RSVP flow coming soon.</p>
          </>
        )}

        {view.kind === 'not_found' && (
          <>
            <h2 className="text-xl font-semibold mb-2">We couldn't find you</h2>
            <p className="text-sm text-gray-500 mb-6">
              Double-check the spelling of your name, or reach out to us directly.
            </p>
            <button
              onClick={reset}
              className="w-full bg-gray-900 text-white text-sm py-2.5 rounded hover:bg-gray-700"
            >
              Try again
            </button>
          </>
        )}

        {view.kind === 'error' && (
          <>
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-500 mb-6">
              We couldn't reach our servers. Please try again in a moment.
            </p>
            <button
              onClick={reset}
              className="w-full border border-gray-300 text-gray-700 text-sm py-2.5 rounded hover:bg-gray-50"
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  )
}
