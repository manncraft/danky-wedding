interface NavProps {
  onRsvpClick: () => void
}

function handleAnchorClick(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault()
  const href = e.currentTarget.getAttribute('href')!
  const id = href.slice(1)
  const el = document.getElementById(id)
  if (el) {
    history.replaceState(null, '', href)
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

export default function Nav({ onRsvpClick }: NavProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <ul className="flex flex-wrap gap-4 justify-center text-sm">
        <li><a href="#schedule" onClick={handleAnchorClick} className="hover:underline">Schedule</a></li>
        <li><a href="#travel" onClick={handleAnchorClick} className="hover:underline">Travel</a></li>
        <li><a href="#dress-code" onClick={handleAnchorClick} className="hover:underline">Dress Code</a></li>
        <li><a href="#registry" onClick={handleAnchorClick} className="hover:underline">Registry</a></li>
        <li><a href="#housekeeping" onClick={handleAnchorClick} className="hover:underline">Housekeeping</a></li>
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
