import { useEffect } from 'react'
import './PanelsLayout.css'
import { SECTIONS } from '../../sections/registry'
import { useVariant } from '../../variants'

export default function PanelsLayout() {
  const snap = useVariant() === 'panels-snap'

  useEffect(() => {
    if (!snap) return
    document.documentElement.classList.add('panels-snap-active')
    return () => document.documentElement.classList.remove('panels-snap-active')
  }, [snap])

  const [hero, ...rest] = SECTIONS
  const cards = rest.slice(0, -1)
  const footer = rest[rest.length - 1]

  return (
    <>
      <div className="panels-hero">
        <hero.Component />
      </div>
      <div className="panels-wrapper">
        {cards.map(({ id, Component, image }) => (
          <div key={id} className="panels-card">
            {image ? (
              <div className={`flex h-full ${image.side === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div
                  className="w-1/2 shrink-0 self-stretch"
                  style={image.side === 'left' ? { marginLeft: '-2rem' } : { marginRight: '-2rem' }}
                >
                  <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                </div>
                <div className={`w-1/2 flex items-center ${image.side === 'left' ? 'pl-8' : ''}`}>
                  <Component />
                </div>
              </div>
            ) : (
              <Component />
            )}
          </div>
        ))}
      </div>
      <div className="panels-footer">
        <footer.Component />
      </div>
    </>
  )
}
