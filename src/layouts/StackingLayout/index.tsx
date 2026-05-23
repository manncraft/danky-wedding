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

  return (
    <div ref={wrapperRef} className="stacking-cards-wrapper">
      {SECTIONS.map(({ id, Component, image }, index) => (
        <div
          key={id}
          className="stacking-card bg-white rounded-2xl shadow-lg overflow-hidden flex items-center"
          style={{ zIndex: index + 1 }}
        >
          <div className={`flex w-full h-full ${image?.side === 'left' ? 'flex-row' : 'flex-row-reverse'}`}>
            {image && (
              <div className="w-1/2 shrink-0 self-stretch">
                <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
              </div>
            )}
            <div className={`flex items-center justify-center ${image ? 'w-1/2' : 'w-full'}`}>
              <Component />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
