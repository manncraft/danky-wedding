import AddToCalendar from '../AddToCalendar'

export default function DateAndTime() {
  return (
    <section id="date-and-time" className="px-6 py-12">
      <h2 className="text-2xl font-light mb-4">Date &amp; Time</h2>
      <p className="mb-1">Tuesday 12th January 2027</p>
      <p className="mb-1">Ceremony begins at 3pm.</p>
      <p className="mb-4">Please arrive no earlier than 2:30pm.</p>
      <AddToCalendar />

      <h2 className="text-2xl font-light mt-8 mb-4">Venue</h2>
      <p className="mb-1">Markovina Vineyard Estate</p>
      <p className="mb-2">84 Old Railway Road, Kumeū 0892</p>
      <p>
        <a href="https://maps.app.goo.gl/ftf9UaBvExe9XRNJ9" className="underline" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
      </p>
    </section>
  )
}
