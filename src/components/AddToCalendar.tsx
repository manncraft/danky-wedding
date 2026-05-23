import { useState, useRef, useEffect } from 'react'

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
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleOutsideClick)
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [open])

  return (
    <div ref={ref} className="relative inline-block mt-6">
      <button
        onClick={() => setOpen(o => !o)}
        className="px-4 py-1.5 text-sm border border-gray-900 rounded hover:bg-gray-900 hover:text-white transition-colors"
      >
        Add to Calendar
      </button>
      {open && (
        <ul className="absolute left-0 top-full mt-1 min-w-[180px] border border-gray-200 bg-white shadow-sm z-10 rounded text-sm">
          <li>
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-50"
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
              className="w-full text-left px-4 py-2 hover:bg-gray-50"
              onClick={() => {
                downloadIcs()
                setOpen(false)
              }}
            >
              Apple Calendar
            </button>
          </li>
          <li>
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-50"
              onClick={() => {
                downloadIcs()
                setOpen(false)
              }}
            >
              Outlook
            </button>
          </li>
        </ul>
      )}
    </div>
  )
}
