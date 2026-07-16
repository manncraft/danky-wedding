import { useEffect, useRef, useState } from 'react'

interface ScrollDownArrowProps {
  sectionIds: string[]
}

export default function ScrollDownArrow({ sectionIds }: ScrollDownArrowProps) {
  const [hidden, setHidden] = useState(false)
  const currentIndexRef = useRef(0)

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el)

    // Track whichever section overlaps the vertical center of the viewport, rather than
    // comparing raw offsets — scroll-padding-top (for the desktop sticky nav) shifts where
    // scrollIntoView lands, so a fixed pixel threshold near the top misdetects the current section.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const index = elements.indexOf(entry.target as HTMLElement)
          if (index === -1) return
          currentIndexRef.current = index
          setHidden(index === elements.length - 1)
        })
      },
      { rootMargin: '-45% 0px -45% 0px' }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sectionIds])

  function scrollToNextSection() {
    const nextId = sectionIds[currentIndexRef.current + 1]
    if (!nextId) return
    document.getElementById(nextId)?.scrollIntoView({ behavior: 'smooth' })
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
