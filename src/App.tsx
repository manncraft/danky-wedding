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
      <div aria-hidden="true" className="fixed left-0 top-0 h-screen pointer-events-none z-[-1] hidden sm:block">
        <img src="/lavender.png" alt="" className="h-full w-auto" />
      </div>
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
