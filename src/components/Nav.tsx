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
    <>
      <button
        onClick={onRsvpClick}
        className="fixed top-3 right-4 z-50 sm:hidden px-4 py-1.5 text-sm btn-dark rounded whitespace-nowrap"
      >
        RSVP
      </button>
      <nav className="hidden sm:flex sm:sticky top-0 z-50 bg-[var(--light-bg)] border-b border-[var(--border-color)] px-6 py-3 items-center justify-center sm:justify-end">
        <ul className="flex flex-wrap gap-4 justify-center text-sm">
          <li><a href="#date-and-time" onClick={handleAnchorClick} className="hover:underline">When &amp; Where</a></li>
          <li><a href="#dress-code" onClick={handleAnchorClick} className="hover:underline">Info</a></li>
          <li><a href="#timeline" onClick={handleAnchorClick} className="hover:underline">Timeline</a></li>
          <li><a href="#faqs" onClick={handleAnchorClick} className="hover:underline">FAQs</a></li>
        </ul>
        <button
          onClick={onRsvpClick}
          className="ml-4 px-4 py-1.5 text-sm btn-dark rounded whitespace-nowrap"
        >
          RSVP
        </button>
      </nav>
    </>
  )
}
