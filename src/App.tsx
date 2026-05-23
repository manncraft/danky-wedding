import { useState } from 'react'
import Nav from './components/Nav'
import RsvpLookup from './components/RsvpLookup'
import Hero from './components/sections/Hero'
import DateAndTime from './components/sections/DateAndTime'
import Venue from './components/sections/Venue'
import ParkingTransportation from './components/sections/ParkingTransportation'
import DressCode from './components/sections/DressCode'
import DietaryRestrictions from './components/sections/DietaryRestrictions'
import Gifts from './components/sections/Gifts'
import Timeline from './components/sections/Timeline'

type View = 'landing' | 'rsvp-lookup'

function App() {
  const [view, setView] = useState<View>('landing')

  return (
    <>
      <Nav onRsvpClick={() => { history.replaceState(null, '', window.location.pathname + window.location.search); setView('rsvp-lookup') }} view={view} onNavigateToLanding={() => setView('landing')} />
      {view === 'landing' && (
        <main className="max-w-2xl mx-auto w-full">
          <Hero />
          <DateAndTime />
          <Venue />
          <ParkingTransportation />
          <DressCode />
          <DietaryRestrictions />
          <Gifts />
          <Timeline />
        </main>
      )}
      {view === 'rsvp-lookup' && (
        <RsvpLookup onBack={() => setView('landing')} />
      )}
    </>
  )
}

export default App
