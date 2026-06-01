import './PanelsLayout.css'
import { SECTIONS } from '../../sections/registry'

export default function PanelsLayout() {
  return (
    <div className="panels-wrapper">
      {SECTIONS.map(({ id, Component, image }, index) => {
        const tone = index % 2 === 0 ? 'dark' : 'light'
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
  )
}
