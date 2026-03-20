import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { lookup, submitRsvp, RsvpApiError } from '../services/rsvpApi'
import type { MatchedGuest } from '../types/rsvp'

interface RsvpLookupProps {
  onBack: () => void
}

interface LookupFormData {
  firstName: string
  lastName: string
}

interface AttendanceFormData {
  attending: 'true' | 'false'
  dietary?: string
}

type ViewState =
  | { kind: 'form' }
  | { kind: 'loading' }
  | { kind: 'select'; matches: MatchedGuest[] }
  | { kind: 'confirmed'; guest: MatchedGuest }
  | { kind: 'not_found' }
  | { kind: 'error' }
  | { kind: 'rsvp-submitted'; guest: MatchedGuest; attending: boolean }

const SESSION_KEY = 'invite_secret'
const RSVP_RESULT_KEY = 'rsvp_result'
const ATTENDING_GATED_FIELDS = ['dietary'] as const

export default function RsvpLookup({ onBack }: RsvpLookupProps) {
  const [secret, setSecret] = useState<string | null>(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('s')
    if (fromUrl) {
      sessionStorage.setItem(SESSION_KEY, fromUrl)
      return fromUrl
    }
    return sessionStorage.getItem(SESSION_KEY)
  })
  const [view, setView] = useState<ViewState>(() => {
    try {
      const stored = sessionStorage.getItem(RSVP_RESULT_KEY)
      if (stored) {
        const { guest, attending } = JSON.parse(stored) as { guest: MatchedGuest; attending: boolean }
        return { kind: 'rsvp-submitted', guest, attending }
      }
    } catch {
      // ignore malformed stored value
    }
    return { kind: 'form' }
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LookupFormData>()

  const {
    register: registerAttendance,
    handleSubmit: handleAttendanceSubmit,
    setError: setAttendanceError,
    watch: watchAttendance,
    setValue: setAttendanceValue,
    formState: { errors: attendanceErrors, isSubmitting: isAttendanceSubmitting },
  } = useForm<AttendanceFormData>()

  const [selectedAttending, setSelectedAttending] = useState<'true' | 'false' | null>(null)

  const attendingValue = watchAttendance('attending')

  useEffect(() => {
    if (attendingValue !== 'true') {
      ATTENDING_GATED_FIELDS.forEach(field => setAttendanceValue(field, ''))
    }
  }, [attendingValue, setAttendanceValue])

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
            </div>
            <p className="text-sm font-medium mb-4">Will you be attending?</p>
            <form
              noValidate
              onSubmit={handleAttendanceSubmit(async (data) => {
                const attending = data.attending === 'true'
                try {
                  await submitRsvp(view.guest.full_name, attending, secret!, data.dietary)
                  sessionStorage.setItem(RSVP_RESULT_KEY, JSON.stringify({ guest: view.guest, attending }))
                  setView({ kind: 'rsvp-submitted', guest: view.guest, attending })
                } catch {
                  setAttendanceError('root', {
                    message: 'Something went wrong. Please try again.',
                  })
                }
              })}
            >
              <div className="grid grid-cols-2 gap-3 mb-4">
                <label
                  onClick={() => setSelectedAttending('true')}
                  className={`flex items-center justify-center rounded border px-4 py-4 text-sm text-center cursor-pointer transition-colors min-h-[3rem] ${
                    selectedAttending === 'true'
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    value="true"
                    className="sr-only"
                    {...registerAttendance('attending', { required: 'Please select an option' })}
                  />
                  Attending
                </label>
                <label
                  onClick={() => setSelectedAttending('false')}
                  className={`flex items-center justify-center rounded border px-4 py-4 text-sm text-center cursor-pointer transition-colors min-h-[3rem] ${
                    selectedAttending === 'false'
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    value="false"
                    className="sr-only"
                    {...registerAttendance('attending', { required: 'Please select an option' })}
                  />
                  Not Attending
                </label>
              </div>
              {attendingValue === 'true' && (
                <div className="flex flex-col gap-1 mb-4">
                  <label htmlFor="dietary" className="text-sm font-medium">
                    Dietary requirements or restrictions
                  </label>
                  <input
                    id="dietary"
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="e.g. vegetarian, nut allergy"
                    {...registerAttendance('dietary')}
                  />
                </div>
              )}
              {attendanceErrors.attending && (
                <p className="text-sm text-red-600 mb-3">
                  {attendanceErrors.attending.message}
                </p>
              )}
              {attendanceErrors.root && (
                <p className="text-sm text-red-600 mb-3">
                  {attendanceErrors.root.message}
                </p>
              )}
              <button
                type="submit"
                disabled={isAttendanceSubmitting}
                className="w-full bg-gray-900 text-white text-sm py-2.5 rounded hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isAttendanceSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Submitting…
                  </>
                ) : (
                  'Submit RSVP'
                )}
              </button>
            </form>
          </>
        )}

        {view.kind === 'rsvp-submitted' && (
          <>
            <h2 className="text-xl font-semibold mb-2">
              {view.attending ? 'See you there!' : 'We\'ll miss you!'}
            </h2>
            <div className="border border-gray-200 rounded px-4 py-4 mb-4">
              <p className="text-sm font-medium">{view.guest.full_name}</p>
            </div>
            <p className="text-sm text-gray-500">
              {view.attending
                ? 'Your RSVP has been received. We look forward to celebrating with you.'
                : 'Thanks for letting us know. We hope to see you another time.'}
            </p>
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
