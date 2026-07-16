import { useEffect, useState } from 'react'

interface ScrollDownArrowProps {
  sectionIds: string[]
}

export default function ScrollDownArrow({ sectionIds }: ScrollDownArrowProps) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const lastEl = document.getElementById(sectionIds[sectionIds.length - 1])
    if (!lastEl) return
    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.25 }
    )
    observer.observe(lastEl)
    return () => observer.disconnect()
  }, [sectionIds])

  function scrollToNextSection() {
    const next = sectionIds
      .map((id) => document.getElementById(id))
      .find((el): el is HTMLElement => !!el && el.getBoundingClientRect().top > 50)
    next?.scrollIntoView({ behavior: 'smooth' })
  }

  if (hidden) return null

  return (
    <button
      onClick={scrollToNextSection}
      aria-label="Scroll to next section"
      className="fixed bottom-6 right-6 z-40 sm:hidden w-11 h-11 rounded-full btn-dark border border-white/20 shadow-lg flex items-center justify-center animate-bounce"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
  )
}
