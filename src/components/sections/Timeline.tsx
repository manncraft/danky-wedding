import React from 'react'
import { useFlowerOverride } from '../../hooks/useFlowerOverride'

const EVENTS = [
  { time: '2:30 pm',  label: 'Guests arrive' },
  { time: '3:00 pm',  label: 'Ceremony begins' },
  { time: '3:30 pm',  label: 'Canapés & cocktails' },
  { time: '5:45 pm',  label: 'Dinner' },
  { time: '9:30 pm',  label: 'Bar closes' },
  { time: '10:00 pm', label: 'Reception ends' },
]

export default function Timeline() {
  const flowerSrc = useFlowerOverride('flower_purple_light')
  return (
    <section id="timeline" className="absolute inset-0 flex items-center justify-center">

      {/* Flanking flowers — desktop only */}
      <div className="absolute left-0 bottom-0 h-full pointer-events-none hidden md:block">
        <img src={flowerSrc} alt="" className="h-full object-contain object-bottom" />
      </div>
      <div className="absolute right-0 bottom-0 h-full pointer-events-none hidden md:block" style={{ transform: 'scaleX(-1)' }}>
        <img src={flowerSrc} alt="" className="h-full object-contain object-bottom" />
      </div>

      {/* Flat layout — all screen sizes */}
      <div className="relative z-10 w-fit mx-auto px-6 py-10 text-center">
        <p className="fancy-italic text-5xl leading-tight mb-1">Timeline</p>
        <p className="text-xs uppercase tracking-widest mb-6 opacity-60">Tuesday, 12th January 2027</p>
        <div className="grid grid-cols-[auto_auto] gap-x-6 text-base text-left">
          {EVENTS.map(({ time, label }, i) => (
            <React.Fragment key={time}>
              <div className={`border-t border-black/10 py-2 opacity-60 whitespace-nowrap ${i === EVENTS.length - 1 ? 'border-b' : ''}`}>{time}</div>
              <div className={`border-t border-black/10 py-2 ${i === EVENTS.length - 1 ? 'border-b' : ''}`}>{label}</div>
            </React.Fragment>
          ))}
        </div>
      </div>

    </section>
  )
}
