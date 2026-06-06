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
        className="px-6 py-2 text-sm bg-gray-900 text-white rounded hover:bg-gray-700"
      >
        RSVP
      </button>
    </section>
  )
}
