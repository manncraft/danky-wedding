import { SECTIONS } from '../sections/registry'

export default function DefaultLayout() {
  return (
    <main className="max-w-2xl mx-auto w-full">
      {SECTIONS.map(({ id, Component }) => <Component key={id} />)}
    </main>
  )
}
