const FAQS = [
  {
    question: 'What should I wear?',
    answer: 'Semi-formal. Think colourful midi or maxi dresses, dressy separates, or a button-up shirt and dress pants. For footwear, dress shoes, loafers, sandals, dressy flats, wedges, or block heels all work well — just avoid anything that might sink in the grass.',
  },
  {
    question: 'I have dietary requirements — what should I do?',
    answer: 'Please let us know when you RSVP and we\'ll make sure you\'re catered for.',
  },
]

export default function FAQs() {
  return (
    <section id="faqs" className="flex-1 flex flex-col py-10 px-6 sm:px-0">
      <p className="text-6xl mb-8 leading-none" style={{ fontFamily: "'Pinyon Script', cursive" }}>FAQs</p>
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
