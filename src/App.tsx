import { useState } from 'react'
import Nav from './components/Nav'
import RsvpLookup from './components/RsvpLookup'
import Hero from './components/sections/Hero'
import Schedule from './components/sections/Schedule'
import Travel from './components/sections/Travel'
import DressCode from './components/sections/DressCode'

type View = 'landing' | 'rsvp-lookup'

function App() {
  const [view, setView] = useState<View>('landing')

  return (
    <>
      <Nav onRsvpClick={() => { history.replaceState(null, '', window.location.pathname + window.location.search); setView('rsvp-lookup') }} view={view} onNavigateToLanding={() => setView('landing')} />
      {view === 'landing' && (
        <main className="max-w-2xl mx-auto w-full">
          <Hero />
          <Schedule />
          <Travel />
          <DressCode />
        </main>
      )}
      {view === 'rsvp-lookup' && (
        <RsvpLookup onBack={() => setView('landing')} />
      )}
    </>
  )
}

export default App
