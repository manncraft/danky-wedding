const FAQS = [
  {
    question: 'When do I need to RSVP?',
    answer: 'ASAP {TBC}',
  },
  {
    question: 'I have dietary requirements - what should I do?',
    answer: 'Please let us know when you RSVP and we\'ll make sure you\'re catered for.',
  },
  {
    question: 'Will the wedding be outdoors or indoors?',
    answer: 'The ceremony will be outdoors in a shaded area. The reception will be indoors.',
  },
  {
    question: 'What should I wear?',
    answer: 'The dress code is semi-formal. We suggest a colourful midi or maxi dress, dressy separates, or a button-up shirt and dress pants. For footwear, avoid anything that might sink in the grass. Dress shoes, loafers, sandals, dressy flats, wedges, or block heels all work well.',
  },
  {
    question: 'Can I take photos with my phone or camera during the wedding?',
    answer: 'During the ceremony, we ask that you please refrain from taking any photos, or using your phone. Please feel free to take as many photos as you\'d like after the ceremony.',
  }
]

export default function FAQs() {
  return (
    <section id="faqs" className="flex-1 flex flex-col justify-center py-10 px-6 sm:px-0">
      <p className="fancy text-6xl mb-8 leading-none">FAQs</p>
      <div className="flex flex-col gap-6">
        {FAQS.map(({ question, answer }) => (
          <div key={question}>
            <p className="text-base font-bold uppercase tracking-widest mb-1">{question}</p>
            <p className="text-lg">{answer}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
