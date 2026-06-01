export default function DressCodeParking() {
  return (
    <section id="dress-code" className="flex-1 flex flex-col sm:flex-row-reverse items-stretch gap-8 sm:gap-12 py-8 px-6 sm:px-0">

      {/* Right: heading + image */}
      <div className="w-full sm:w-[35%] flex flex-col overflow-hidden">
        <div className="leading-tight shrink-0">
          <p className="text-3xl font-light">On the</p>
          <p className="text-6xl" style={{ fontFamily: "'Pinyon Script', cursive" }}>Day</p>
        </div>
        <div className="flex-1 min-h-0 hidden sm:flex items-center justify-center mt-4">
          <img src="/img/cosmos3.png" alt="" className="max-h-[28vh] max-w-full object-contain" />
        </div>
      </div>

      {/* Left: stacked boxes */}
      <div className="flex-1 self-center flex flex-col gap-12">
        <div className="border border-gray-300 px-4 p-4 text-center">
          <p className="text-base font-bold uppercase tracking-widest mb-2">Dress Code</p>
          <p className="text-lg mb-1">Semi-formal.</p>
          <p className="text-lg">We suggest wearing something suitable for a summer garden wedding, with comfortable footwear that won't sink in the grass.</p>
        </div>

        <div id="parking-transportation" className="border border-gray-300 px-4 p-4 text-center">
          <p className="text-base font-bold uppercase tracking-widest mb-2">Parking &amp; Transportation</p>
          <p className="text-lg mb-1">There is plenty of parking available onsite. Cars may be left overnight and collected by 11am the following day.</p>
          <p className="text-lg">Taxis and rideshares are available in the area. We recommend booking them before you are ready to leave — they can be difficult to get at short notice in Kumeū.</p>
        </div>
      </div>

    </section>
  )
}
