import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface RsvpLookupProps {
  onBack: () => void
}

interface LookupFormData {
  firstName: string
  lastName: string
}

export default function RsvpLookup({ onBack }: RsvpLookupProps) {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LookupFormData>()

  const onSubmit = (_data: LookupFormData) => {
    setSubmitted(true)
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

        <h1 className="text-2xl font-semibold mb-2">Find Your Invite</h1>
        <p className="text-sm text-gray-500 mb-8">
          Enter your name to look up your invitation.
        </p>

        {submitted ? (
          <p className="text-green-700 font-medium">
            Thanks — we'll look you up shortly!
          </p>
        ) : (
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
        )}
      </div>
    </div>
  )
}
