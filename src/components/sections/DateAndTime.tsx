import AddToCalendar from '../AddToCalendar'

export default function DateAndTime() {
  return (
    <section className="flex-1 flex flex-col sm:flex-row items-stretch gap-8 sm:gap-12 py-8 px-6 sm:px-0">
      <div className="w-full sm:w-[35%] flex flex-col overflow-hidden">
        <div className="leading-tight shrink-0">
          <p className="text-3xl font-light">About the</p>
          <p className="text-6xl" style={{ fontFamily: "'Pinyon Script', cursive" }}>Ceremony</p>
        </div>
        <div className="flex-1 min-h-0 hidden sm:flex items-center justify-center mt-4">
          <img src="/img/rose3.png" alt="" className="max-h-[28vh] max-w-full object-contain" />
        </div>
      </div>

      <div className="flex-1 self-center flex flex-col gap-12">
        <div id="date-and-time" className="border border-gray-300 p-6 text-center">
          <p className="text-base font-bold uppercase tracking-widest mb-2">Date &amp; Time</p>
          <p className="text-lg mb-1">Tuesday 12th January 2027</p>
          <p className="text-lg">Ceremony begins at 3pm.</p>
          <p className="text-lg">Please arrive no earlier than 2:30pm.</p>
        </div>

        <div id="venue"  className="border border-gray-300 p-6 text-center">
          <p className="text-base font-bold uppercase tracking-widest mb-2">Venue</p>
          <p className="text-lg mb-1">Markovina Vineyard Estate</p>
          <p className="text-lg">84 Old Railway Road, Kumeū 0892</p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <AddToCalendar />
          <a
            href="https://maps.app.goo.gl/ftf9UaBvExe9XRNJ9"
            className="px-4 py-1.5 text-sm border border-gray-900 rounded hover:bg-gray-900 hover:text-white transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Google Maps
          </a>
        </div>
      </div>
    </section>
  )
}
