import AddToCalendar from '../AddToCalendar'

export default function DateAndTime() {
  return (
    <section id="date-and-time" className="px-6 py-12">
      <h2 className="text-2xl font-light mb-4">Date &amp; Time</h2>
      <p className="mb-1">Tuesday 12th January 2027</p>
      <p className="mb-1">Ceremony begins at 3pm.</p>
      <p>Please arrive no earlier than 2:30pm.</p>
      <AddToCalendar />
    </section>
  )
}
