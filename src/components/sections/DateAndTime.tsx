import AddToCalendar from '../AddToCalendar'

export default function DateAndTime() {
  return (
    <section id="date-and-time" className="flex items-center w-full h-full gap-12">
      <div className="flex flex-col items-center justify-center gap-4 w-[35%]">
        <div className="text-center leading-tight">
          <p className="text-3xl font-light">About the</p>
          <p className="text-6xl" style={{ fontFamily: "'Pinyon Script', cursive" }}>Ceremony</p>
        </div>
        <img src="/img/rose3.png" alt="" className="h-36 object-contain" />
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <div className="border border-gray-300 p-5 text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-3">Date &amp; Time</p>
          <p className="text-sm mb-1">Tuesday 12th January 2027</p>
          <p className="text-sm">Ceremony begins at 3pm. Please arrive no earlier than 2:30pm.</p>
          <AddToCalendar />
        </div>

        <div className="border border-gray-300 p-5 text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-3">Venue</p>
          <p className="text-sm mb-1">Markovina Vineyard Estate</p>
          <p className="text-sm mb-2">84 Old Railway Road, Kumeū 0892</p>
          <a href="https://maps.app.goo.gl/ftf9UaBvExe9XRNJ9" className="text-sm underline" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
        </div>
      </div>
    </section>
  )
}
