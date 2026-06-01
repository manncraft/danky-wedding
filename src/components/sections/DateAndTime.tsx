import AddToCalendar from '../AddToCalendar'

export default function DateAndTime() {
  return (
    <section id="date-and-time" className="flex-1 flex items-stretch gap-12 py-8">
      <div className="w-[35%] flex flex-col overflow-hidden">
        <div className="leading-tight shrink-0">
          <p className="text-3xl font-light">About the</p>
          <p className="text-6xl" style={{ fontFamily: "'Pinyon Script', cursive" }}>Ceremony</p>
        </div>
        <div className="flex-1 min-h-0 flex items-center justify-center mt-4">
          <img src="/img/rose3.png" alt="" className="max-h-[28vh] max-w-full object-contain" />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <div className="flex-1 border border-gray-300 p-5 text-center flex flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-3">Date &amp; Time</p>
          <p className="text-sm mb-1">Tuesday 12th January 2027</p>
          <p className="text-sm">Ceremony begins at 3pm. Please arrive no earlier than 2:30pm.</p>
          <AddToCalendar />
        </div>

        <div className="flex-1 border border-gray-300 p-5 text-center flex flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-3">Venue</p>
          <p className="text-sm mb-1">Markovina Vineyard Estate</p>
          <p className="text-sm mb-2">84 Old Railway Road, Kumeū 0892</p>
          <a href="https://maps.app.goo.gl/ftf9UaBvExe9XRNJ9" className="text-sm underline" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
        </div>
      </div>
    </section>
  )
}
