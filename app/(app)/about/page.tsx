import ContactForm from '@/components/about/ContactForm'

export const metadata = {
  title: 'About',
  description: 'Tattvasudhā — a jñānayajña for mokṣasādhana through the study of Mādhva Dvaita Vedānta.',
  openGraph: {
    title: 'About Tattvasudhā',
    description: 'A jñānayajña for mokṣasādhana through the study of Mādhva Dvaita Vedānta siddhānta.',
    siteName: 'Tattvasudhā — तत्त्वसुधा',
  },
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-14">

      {/* Hero */}
      <div>
        <h1 className="text-3xl font-semibold text-stone-900">About Tattvasudhā</h1>
        <p className="font-devanagari text-xl text-saffron-700 mt-2">
          तत्त्वसुधा — मध्वसिद्धान्तामृतम्
        </p>
      </div>

      {/* The Vision */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-stone-800">The Vision</h2>
        <p className="text-stone-700 leading-relaxed">
          Tattvasudhā is offered as a jñānayajña — a sacrifice of knowledge in the sacred
          fire of śāstra — for all sincere mumukṣus seeking mokṣa through the study of
          Mādhva Dvaita Vedānta siddhānta.
        </p>
        <p className="text-stone-700 leading-relaxed">
          May all who study here, through the grace of Śrī Hari and the blessings of the
          paramparā of Madhvācārya, attain clarity of tattva-jñāna and progress steadily
          on the path of mokṣasādhana.
        </p>
        <p className="font-devanagari text-stone-600 leading-relaxed italic">
          श्रीमन्मध्वमतानुसारेण तत्त्वज्ञानं मोक्षसाधनम्।<br />
          तदर्थमिदं ज्ञानयज्ञरूपं कार्यम् अस्माभिः समर्प्यते।
        </p>
      </section>

      <hr className="border-stone-200" />

      {/* Encouragement */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-stone-800">An Invitation</h2>
        <p className="text-stone-700 leading-relaxed">
          Śāstra-adhyayana is not merely academic study — it is upāsanā. Every passage
          read with sincerity, every doubt resolved through tarka, every concept understood
          through the light of the ācārya&apos;s commentary — this is jñānayajña.
        </p>
        <p className="text-stone-700 leading-relaxed">
          You are invited to join this yajña. Study deeply. Ask questions. Prepare for the
          parīkṣā. And through this sevā of śāstra, may mokṣa be attained.
        </p>
        <blockquote className="border-l-4 border-saffron-400 pl-4 space-y-1">
          <p className="font-devanagari text-stone-700 leading-relaxed">
            ज्ञानयज्ञेन चाप्यन्ये यजन्तो मामुपासते
          </p>
          <p className="text-xs text-stone-400">— Bhagavadgītā 9.15</p>
        </blockquote>
      </section>

      <hr className="border-stone-200" />

      {/* Acknowledgements */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-stone-800">Acknowledgements</h2>
        <p className="text-stone-600 leading-relaxed">
          This work would not be possible without:
        </p>
        <ul className="space-y-2 text-stone-600">
          <li className="flex gap-2">
            <span className="text-saffron-500 shrink-0">•</span>
            <span>The grace of Śrī Hari and the blessings of Vāyu</span>
          </li>
          <li className="flex gap-2">
            <span className="text-saffron-500 shrink-0">•</span>
            <span>
              The living paramparā of Madhvācārya and all ācāryas of the Mādhva tradition
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-saffron-500 shrink-0">•</span>
            <span>
              Special prArthanA &amp; acknowledgements to shrI rAghavEndra rachUri AchArya
              of AtmAshrama
            </span>
          </li>
        </ul>
      </section>

      <hr className="border-stone-200" />

      {/* Contact */}
      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-stone-800">Contact &amp; Feedback</h2>
          <p className="text-sm text-stone-500 mt-1">
            You can also reach us directly at{' '}
            <a
              href="mailto:tattvasudhaa@gmail.com"
              className="text-saffron-700 hover:text-saffron-800 underline underline-offset-2"
            >
              tattvasudhaa@gmail.com
            </a>
          </p>
        </div>
        <ContactForm />
      </section>

    </div>
  )
}
