interface HeroProps {
  onRsvpClick: () => void
}

export default function Hero({ onRsvpClick }: HeroProps) {
  return (
    <section id="hero" className="px-6 py-16 text-center">
      <h1 className="fancy text-6xl font-light mb-4">Becky &amp; Daniel</h1>
      <p className="accent text-base mb-8">12 January 2027 | Markovina Vineyard Estate</p>
      <button
        onClick={onRsvpClick}
        className="btn-dark px-6 py-2 text-sm rounded"
      >
        RSVP
      </button>
    </section>
  )
}
