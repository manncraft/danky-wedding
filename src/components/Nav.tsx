import { useEffect, useRef } from 'react'

interface NavProps {
  onRsvpClick: () => void
  view: 'landing' | 'rsvp-lookup'
  onNavigateToLanding: () => void
}

export default function Nav({ onRsvpClick, view, onNavigateToLanding }: NavProps) {
  const pendingSectionRef = useRef<string | null>(null)

  function scrollToSection(id: string, href?: string) {
    const el = document.getElementById(id)
    if (!el) return
    history.replaceState(null, '', href ?? `#${id}`)
    el.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (view === 'landing' && pendingSectionRef.current) {
      const id = pendingSectionRef.current
      pendingSectionRef.current = null
      scrollToSection(id)
    }
  }, [view])

  function handleAnchorClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    const href = e.currentTarget.getAttribute('href')!
    const id = href.slice(1)
    if (view === 'landing') {
      scrollToSection(id, href)
    } else {
      pendingSectionRef.current = id
      onNavigateToLanding()
    }
  }

  return (
    <nav className="flex sm:sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 items-center justify-between">
      <ul className="flex flex-wrap gap-4 justify-center text-sm">
        <li><a href="#date-and-time" onClick={handleAnchorClick} className="hover:underline">Schedule</a></li>
        <li><a href="#venue" onClick={handleAnchorClick} className="hover:underline">Venue</a></li>
        <li><a href="#parking-transportation" onClick={handleAnchorClick} className="hover:underline">Getting There</a></li>
        <li><a href="#dress-code" onClick={handleAnchorClick} className="hover:underline">Dress Code</a></li>
        <li><a href="#dietary-restrictions" onClick={handleAnchorClick} className="hover:underline">Dietary</a></li>
        <li><a href="#gifts" onClick={handleAnchorClick} className="hover:underline">Gifts</a></li>
        <li><a href="#timeline" onClick={handleAnchorClick} className="hover:underline">Timeline</a></li>
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
