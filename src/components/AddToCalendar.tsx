import { useState } from 'react'

const EVENT = {
  title: "Becky & Daniel's Wedding",
  dtStartUtc: '20270112T020000Z',
  dtEndUtc: '20270112T090000Z',
  location: 'Markovina Vineyard Estate, 84 Old Railway Road, Kumeū 0892, New Zealand',
} as const

function buildGoogleCalendarUrl(): string {
  const base = 'https://calendar.google.com/calendar/render'
  const params = [
    'action=TEMPLATE',
    `text=${encodeURIComponent(EVENT.title)}`,
    `dates=${EVENT.dtStartUtc}/${EVENT.dtEndUtc}`,
    `location=${encodeURIComponent(EVENT.location)}`,
  ].join('&')
  return `${base}?${params}`
}

function buildIcsContent(): string {
  const escapedLocation = EVENT.location.replace(/,/g, '\\,')
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    "PRODID:-//Becky & Daniel's Wedding//EN",
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:becky-daniel-wedding-2027@danky-wedding',
    'DTSTAMP:20260523T000000Z',
    `DTSTART:${EVENT.dtStartUtc}`,
    `DTEND:${EVENT.dtEndUtc}`,
    `SUMMARY:${EVENT.title}`,
    `LOCATION:${escapedLocation}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

function downloadIcs(): void {
  const blob = new Blob([buildIcsContent()], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'becky-and-daniels-wedding.ics'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function AddToCalendar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center px-4 py-1.5 text-sm border border-gray-900 rounded hover:bg-gray-900 hover:text-white transition-colors"
      >
        Add to Calendar
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-80 p-6"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold mb-1">Add to Calendar</h3>
            <p className="text-sm text-gray-500 mb-5">Choose your calendar app</p>
            <ul className="space-y-2">
              <li>
                <button
                  className="w-full text-left px-4 py-2.5 text-sm rounded border border-gray-200 hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    window.open(buildGoogleCalendarUrl(), '_blank', 'noopener,noreferrer')
                    setOpen(false)
                  }}
                >
                  Google Calendar
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left px-4 py-2.5 text-sm rounded border border-gray-200 hover:bg-gray-50 transition-colors"
                  onClick={() => { downloadIcs(); setOpen(false) }}
                >
                  Apple Calendar
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left px-4 py-2.5 text-sm rounded border border-gray-200 hover:bg-gray-50 transition-colors"
                  onClick={() => { downloadIcs(); setOpen(false) }}
                >
                  Outlook
                </button>
              </li>
            </ul>
            <button
              onClick={() => setOpen(false)}
              className="mt-5 w-full text-sm text-gray-400 hover:text-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}
