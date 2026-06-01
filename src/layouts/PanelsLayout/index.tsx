import './PanelsLayout.css'
import Hero from '../../components/sections/Hero'
import DateAndTime from '../../components/sections/DateAndTime'
import ParkingTransportation from '../../components/sections/ParkingTransportation'
import DressCode from '../../components/sections/DressCode'
import DietaryRestrictions from '../../components/sections/DietaryRestrictions'
import Gifts from '../../components/sections/Gifts'
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
}

const PANELS: Panel[] = [
  { id: 'hero',                   Component: Hero },
  { id: 'date-and-time',          Component: DateAndTime,          image: { src: '/img/rose3.png',       alt: '', side: 'right' } },
  { id: 'parking-transportation', Component: ParkingTransportation },
  { id: 'dress-code',             Component: DressCode,            image: { src: '/img/cosmos3.png',     alt: '', side: 'right' } },
  { id: 'dietary-restrictions',   Component: DietaryRestrictions },
  { id: 'gifts',                  Component: Gifts,                image: { src: '/img/cornflower.png',  alt: '', side: 'left'  } },
  { id: 'timeline',               Component: Timeline },
]

export default function PanelsLayout() {
  return (
    <div className="panels-wrapper">
      {PANELS.map(({ id, Component, image }, index) => {
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
