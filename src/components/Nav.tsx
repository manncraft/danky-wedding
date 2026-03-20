interface NavProps {
  onRsvpClick: () => void
}

export default function Nav({ onRsvpClick }: NavProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <ul className="flex flex-wrap gap-4 justify-center text-sm">
        <li><a href="#schedule" className="hover:underline">Schedule</a></li>
        <li><a href="#travel" className="hover:underline">Travel</a></li>
        <li><a href="#dress-code" className="hover:underline">Dress Code</a></li>
        <li><a href="#registry" className="hover:underline">Registry</a></li>
        <li><a href="#housekeeping" className="hover:underline">Housekeeping</a></li>
      </ul>
      <button
        onClick={onRsvpClick}
        className="ml-4 px-4 py-1.5 text-sm bg-gray-900 text-white rounded hover:bg-gray-700 whitespace-nowrap"
      >
        RSVP
      </button>
    </nav>
  )
}
