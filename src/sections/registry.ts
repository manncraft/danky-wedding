import type { ComponentType } from 'react'
import Hero from '../components/sections/Hero'
import DateAndTime from '../components/sections/DateAndTime'
import Venue from '../components/sections/Venue'
import ParkingTransportation from '../components/sections/ParkingTransportation'
import DressCode from '../components/sections/DressCode'
import DietaryRestrictions from '../components/sections/DietaryRestrictions'
import Gifts from '../components/sections/Gifts'
import Timeline from '../components/sections/Timeline'

export interface SectionImage {
  src: string
  alt: string
  side: 'left' | 'right'
}

export interface SectionEntry {
  id: string
  Component: ComponentType
  image?: SectionImage
}

export const SECTIONS: SectionEntry[] = [
  { id: 'hero',                    Component: Hero },
  { id: 'date-and-time',           Component: DateAndTime,          image: { src: '/img/rose3.png',       alt: '',  side: 'right' } },
  { id: 'venue',                   Component: Venue,                image: { src: '/img/lavender1-5.png', alt: '',  side: 'left'  } },
  { id: 'parking-transportation',  Component: ParkingTransportation },
  { id: 'dress-code',              Component: DressCode,            image: { src: '/img/cosmos3.png',     alt: '',  side: 'right' } },
  { id: 'dietary-restrictions',    Component: DietaryRestrictions },
  { id: 'gifts',                   Component: Gifts,                image: { src: '/img/cornflower.png',  alt: '',  side: 'left'  } },
  { id: 'timeline',                Component: Timeline },
]
