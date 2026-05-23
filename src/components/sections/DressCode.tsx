export default function DressCode() {
  return (
    <section id="dress-code" className="px-6 py-12">
      <h2 className="text-2xl font-light mb-4">Dress Code</h2>
      <p className="mb-2">Semi-formal.</p>
      <p className="mb-4">We suggest wearing something suitable for a summer garden wedding, with comfortable footwear that won't sink in the grass.</p>
      <p className="mb-3 text-sm">Examples:</p>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <ul className="space-y-1">
          <li>Button-up shirt and dress pants</li>
          <li>Colourful midi or maxi dress</li>
          <li>Dressy separates</li>
        </ul>
        <ul className="space-y-1">
          <li>Dress shoes, loafers</li>
          <li>Sandals, dressy flats</li>
          <li>Wedges or block heels</li>
        </ul>
      </div>
    </section>
  )
}
