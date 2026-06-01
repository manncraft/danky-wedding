import { useState } from 'react'
import Nav from './components/Nav'
import RsvpLookup from './components/RsvpLookup'
import PanelsLayout from './layouts/PanelsLayout'

type View = 'landing' | 'rsvp-lookup'

function App() {
  const [view, setView] = useState<View>('landing')

  return (
    <>
      <Nav onRsvpClick={() => { history.replaceState(null, '', window.location.pathname); setView('rsvp-lookup') }} view={view} onNavigateToLanding={() => setView('landing')} />
      {view === 'landing' && <PanelsLayout />}
      {view === 'rsvp-lookup' && (
        <RsvpLookup onBack={() => setView('landing')} />
      )}
    </>
  )
}

export default App
