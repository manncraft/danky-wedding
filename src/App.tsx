import Nav from './components/Nav'
import Hero from './components/sections/Hero'
import Schedule from './components/sections/Schedule'
import Travel from './components/sections/Travel'
import DressCode from './components/sections/DressCode'
import Registry from './components/sections/Registry'
import Housekeeping from './components/sections/Housekeeping'

function App() {
  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto w-full">
        <Hero />
        <Schedule />
        <Travel />
        <DressCode />
        <Registry />
        <Housekeeping />
      </main>
    </>
  )
}

export default App
