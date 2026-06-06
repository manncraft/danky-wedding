import './PanelsLayout.css'
import Hero from '../../components/sections/Hero'
import DateAndTime from '../../components/sections/DateAndTime'
import DressCodeParking from '../../components/sections/DressCodeParking'
import FAQs from '../../components/sections/FAQs'
import Timeline from '../../components/sections/Timeline'
import type { ComponentType } from 'react'

interface PanelImage {
  src: string
  alt: string
  side: 'left' | 'right'
}

interface Panel {
  id: string
  Component: ComponentType
  image?: PanelImage
  fullWidth?: boolean
  tone?: 'dark' | 'light'
}

const PANELS: Panel[] = [
  { id: 'date-and-time',          Component: DateAndTime, tone: 'light' },
  { id: 'dress-code',             Component: DressCodeParking, tone: 'dark' },
  { id: 'timeline',               Component: Timeline, fullWidth: true, tone: 'light' },
  { id: 'faqs',                    Component: FAQs, tone: 'dark' },
]

interface PanelsLayoutProps {
  onRsvpClick: () => void
}

export default function PanelsLayout({ onRsvpClick }: PanelsLayoutProps) {
  return (
    <div className="panels-wrapper">
      <div className="relative panels-card panels-card--dark">
        <div className="w-full h-full lg:max-w-5xl lg:mx-auto flex flex-col justify-center">
          <Hero onRsvpClick={onRsvpClick} />
        </div>
      </div>
      {PANELS.map((panel, index) => {
        const { id, Component, image, fullWidth } = panel
        const tone = panel.tone ?? (index % 2 === 0 ? 'dark' : 'light')
        return (
          <div key={id} className={`relative panels-card panels-card--${tone}`}>
            {fullWidth ? (
              <Component />
            ) : (
              <div className="w-full h-full lg:max-w-5xl lg:mx-auto flex flex-col justify-center">
                {image ? (
                  <div className={`flex flex-1 ${image.side === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
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
            )}
          </div>
        )
      })}
    </div>
  )
}
