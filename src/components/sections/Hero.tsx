interface HeroProps {
  onRsvpClick: () => void
}

export default function Hero({ onRsvpClick }: HeroProps) {
  return (
    <section id="hero" className="px-6 py-16 text-center">
      <h1 className="text-4xl font-light mb-4">Becky &amp; Daniel</h1>
      <p className="text-base mb-8">12 January 2027 | Markovina Vineyard Estate</p>
      <button
        onClick={onRsvpClick}
        className="px-6 py-2 text-sm bg-[var(--dark-button)] text-[var(--light-text)] rounded hover:bg-[var(--light-button)] hover:text-[var(--dark-text)]"
      >
        RSVP
      </button>
    </section>
  )
}
