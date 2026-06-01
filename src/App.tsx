import { useState } from 'react'
import Nav from './components/Nav'
import RsvpLookup from './components/RsvpLookup'
import { useVariant } from './variants'
import DefaultLayout from './layouts/DefaultLayout'
import StackingLayout from './layouts/StackingLayout'
import PanelsLayout from './layouts/PanelsLayout'

type View = 'landing' | 'rsvp-lookup'

const LAYOUTS = {
  default: DefaultLayout,
  stacking: StackingLayout,
  panels: PanelsLayout,
  'panels-full': () => <PanelsLayout full />,
}

function App() {
  const variant = useVariant()
  const Layout = LAYOUTS[variant]
  const [view, setView] = useState<View>('landing')

  return (
    <>
      <Nav onRsvpClick={() => { history.replaceState(null, '', window.location.pathname + window.location.search); setView('rsvp-lookup') }} view={view} onNavigateToLanding={() => setView('landing')} />
      {view === 'landing' && <Layout />}
      {view === 'rsvp-lookup' && (
        <RsvpLookup onBack={() => setView('landing')} />
      )}
    </>
  )
}

export default App
