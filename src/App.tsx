import { useEffect, useRef, useState } from 'react'
import Nav from './components/Nav'
import RsvpLookup from './components/RsvpLookup'
import PanelsLayout from './layouts/PanelsLayout'

type View = 'landing' | 'rsvp-lookup'

function App() {
  const [view, setView] = useState<View>('landing')
  const pendingSectionRef = useRef<string | null>(null)

  useEffect(() => {
    if (view === 'landing' && pendingSectionRef.current) {
      const id = pendingSectionRef.current
      pendingSectionRef.current = null
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [view])

  function navigateToSection(id: string) {
    if (view === 'landing') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      pendingSectionRef.current = id
      history.replaceState(null, '', `#${id}`)
      setView('landing')
    }
  }

  return (
    <>
      <Nav onRsvpClick={() => { history.replaceState(null, '', window.location.pathname + window.location.search); setView('rsvp-lookup') }} view={view} onNavigateToLanding={() => setView('landing')} />
      {view === 'landing' && <PanelsLayout onRsvpClick={() => { history.replaceState(null, '', window.location.pathname + window.location.search); setView('rsvp-lookup') }} />}
      {view === 'rsvp-lookup' && (
        <RsvpLookup onBack={() => setView('landing')} onViewFaqs={() => navigateToSection('faqs')} />
      )}
    </>
  )
}

export default App
