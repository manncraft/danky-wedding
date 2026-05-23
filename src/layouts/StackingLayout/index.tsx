import { useEffect, useRef } from 'react'
import './StackingLayout.css'
import { SECTIONS } from '../../sections/registry'

export default function StackingLayout() {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wrapperRef.current || !('ScrollTimeline' in window)) return
    const cards = wrapperRef.current.querySelectorAll<HTMLElement>('.stacking-card')
    const numCards = cards.length
    cards.forEach((card, index) => {
      const scaleTarget = 1 - (numCards - index) * 0.025
      card.animate(
        { scale: ['1', String(scaleTarget)] },
        {
          timeline: new (window as unknown as { ViewTimeline: new (opts: { subject: Element }) => AnimationTimeline }).ViewTimeline({ subject: card }),
          rangeStart: 'exit-crossing 0%',
          rangeEnd: 'exit-crossing 100%',
          fill: 'both',
        } as KeyframeAnimationOptions
      )
    })
  }, [])

  const [hero, ...rest] = SECTIONS
  const cards = rest.slice(0, -1)
  const footer = rest[rest.length - 1]

  return (
    <>
      <div className="stacking-hero">
        <hero.Component />
      </div>
      <div ref={wrapperRef} className="stacking-cards-wrapper">
        {cards.map(({ id, Component, image }, index) => (
          <div
            key={id}
            className="stacking-card bg-white rounded-2xl overflow-hidden"
            style={{ zIndex: index + 1 }}
          >
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
      <div className="stacking-footer">
        <footer.Component />
      </div>
    </>
  )
}
