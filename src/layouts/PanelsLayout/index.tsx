import './PanelsLayout.css'
import { SECTIONS } from '../../sections/registry'

export default function PanelsLayout() {
  const [hero, ...rest] = SECTIONS
  const cards = rest.slice(0, -1)
  const footer = rest[rest.length - 1]

  return (
    <>
      <div className="panels-hero">
        <hero.Component />
      </div>
      <div className="panels-wrapper">
        {cards.map(({ id, Component, image }, index) => {
          const tone = index % 2 === 0 ? 'light' : 'dark'
          return (
            <div key={id} className={`panels-card panels-card--${tone}`}>
              {image ? (
                <div className={`flex h-full ${image.side === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="w-1/2 shrink-0 self-stretch">
                    <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                  </div>
                  <div className="w-1/2 flex items-center" style={{ padding: '0 3rem' }}>
                    <Component />
                  </div>
                </div>
              ) : (
                <Component />
              )}
            </div>
          )
        })}
      </div>
      <div className="panels-footer">
        <footer.Component />
      </div>
    </>
  )
}
