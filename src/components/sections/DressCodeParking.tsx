import { useFlowerOverride } from '../../hooks/useFlowerOverride'

export default function DressCodeParking() {
  const flowerSrc = useFlowerOverride('flower_blue_light')
  return (
    <section className="flex-1 flex flex-col sm:flex-row-reverse items-stretch gap-8 sm:gap-12 py-8 px-6 sm:px-0">

      {/* Right: image */}
      <div className="w-full sm:w-[35%] hidden sm:flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <img src={flowerSrc} alt="" className="max-w-full object-contain" />
        </div>
      </div>

      {/* Left: stacked boxes */}
      <div className="flex-1 self-center flex flex-col gap-12">
        <div id="dress-code" className="border border-white/25 p-4 text-center">
          <p className="accent text-xl uppercase tracking-widest mb-2">Dress Code</p>
          <p className="text-lg mb-1">Semi-formal.</p>
          <p className="text-lg">We suggest wearing something suitable for a summer garden wedding, with comfortable footwear that won't sink in the grass.</p>
        </div>

        <div id="parking-transportation" className="border border-white/25 p-4 text-center">
          <p className="accent text-xl uppercase tracking-widest mb-2">Parking &amp; Transportation</p>
          <p className="text-lg">There is plenty of parking available onsite.</p>
          <p className="text-lg mb-1">Cars may be left overnight and collected by 11am the following day.</p>
          <p className="text-lg">Taxis and rideshares are available in the area. </p>
          <p className="text-lg">We recommend booking them before you are ready to leave - they can be difficult to get at short notice in Kumeū.</p>
        </div>

        <div id="gifts" className="border border-white/25 p-4 text-center">
          <p className="accent text-xl uppercase tracking-widest mb-2">Gifts</p>
          <p className="text-lg">Your company on our special day is all we need.</p>
          <p className="text-lg">However, should you wish to contribute to our honeymoon, we will have a wishing well at the venue.</p>
        </div>
      </div>

    </section>
  )
}
