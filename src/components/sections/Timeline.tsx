import React from 'react'

const EVENTS = [
  { time: '2:30 pm',  label: 'Guests arrive' },
  { time: '3:00 pm',  label: 'Ceremony begins' },
  { time: '3:30 pm',  label: 'Canapés & cocktails' },
  { time: '5:45 pm',  label: 'Dinner' },
  { time: '9:30 pm',  label: 'Bar closes' },
  { time: '10:00 pm', label: 'Reception ends' },
]

export default function Timeline() {
  return (
    <section id="timeline" className="relative w-full h-full flex items-center justify-center">

      {/* Flanking flowers — desktop only */}
      <div className="absolute left-0 bottom-0 h-full pointer-events-none hidden lg:block">
        <img src="/img/lavender1-5.png" alt="" className="h-full object-contain object-bottom" />
      </div>
      <div className="absolute right-0 bottom-0 h-full pointer-events-none hidden lg:block" style={{ transform: 'scaleX(-1)' }}>
        <img src="/img/lavender1-5.png" alt="" className="h-full object-contain object-bottom" />
      </div>

      {/* Arch card */}
      <div
        className="relative z-10 w-72 bg-[#4a5740] text-[#f5f0e8] text-center px-10 pt-14 pb-8"
        style={{ borderRadius: '150px 150px 0 0' }}
      >
        <p className="text-lg font-light tracking-wide">Program of</p>
        <p className="text-5xl leading-tight" style={{ fontFamily: "'Pinyon Script', cursive" }}>Events</p>
        <p className="text-xs uppercase tracking-widest mt-1 mb-5 opacity-60">
          Tuesday, 12th January 2027
        </p>

        <div className="grid grid-cols-[auto_1fr] gap-x-4 text-sm text-left w-full">
          {EVENTS.map(({ time, label }) => (
            <React.Fragment key={time}>
              <div className="border-t border-white/20 py-1.5 opacity-70 whitespace-nowrap">{time}</div>
              <div className="border-t border-white/20 py-1.5">{label}</div>
            </React.Fragment>
          ))}
        </div>
      </div>

    </section>
  )
}
