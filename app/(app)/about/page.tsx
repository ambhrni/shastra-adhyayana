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

      {/* Collaborate & Contribute */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-800">Collaborate &amp; Contribute</h2>
          <p className="font-devanagari text-base text-saffron-700 mt-1">सहकार्येण ज्ञानयज्ञः वर्धते</p>
        </div>
        <p className="text-stone-700 leading-relaxed">
          Tattvasudhā&apos;s code is openly available for study and contribution under a source-available
          license. Its content — the Sanskrit texts, commentaries, and annotations — remains under
          strict curatorial oversight to preserve Mādhva Dvaita Vedānta authenticity and rigor.
        </p>

        <div className="space-y-3">
          <div>
            <p className="text-stone-800 font-medium">For learners:</p>
            <p className="text-stone-700 leading-relaxed mt-1">
              Study freely. If you spot any error — a Sanskrit spelling mistake, an incorrect word,
              a misattributed commentary, or any inaccuracy in the text — please report it using
              either of these methods:
            </p>
            <ol className="mt-2 space-y-2 text-stone-700 list-decimal list-inside">
              <li className="leading-relaxed">
                <span className="font-medium">Inline flagging (fastest):</span> On any study page, click
                the flag icon on the passage where you found the error. Describe the error briefly.
                This goes directly to the curator&apos;s review queue.
              </li>
              <li className="leading-relaxed">
                Email{' '}
                <a href="mailto:tattvasudhaa@gmail.com" className="text-saffron-700 hover:text-saffron-800 underline underline-offset-2">
                  tattvasudhaa@gmail.com
                </a>{' '}
                with: the passage number and section name, the incorrect text as it currently appears,
                what you believe the correct text should be, and your source or reasoning.
              </li>
            </ol>
            <p className="text-stone-600 leading-relaxed mt-2 text-sm">
              All reported errors are reviewed by the curator before any correction is made. Your sevā
              in maintaining the accuracy of these sacred texts is deeply valued.
            </p>
          </div>

          <div>
            <p className="text-stone-800 font-medium">For scholars and enthusiasts who wish to contribute content:</p>
            <p className="text-stone-700 leading-relaxed mt-1">
              If you are knowledgeable in Mādhva Dvaita Vedānta and wish to contribute Sanskrit texts,
              commentary annotations, nyāya concept definitions, or corrections — write to{' '}
              <a href="mailto:tattvasudhaa@gmail.com" className="text-saffron-700 hover:text-saffron-800 underline underline-offset-2">
                tattvasudhaa@gmail.com
              </a>{' '}
              with your background. Approved contributors receive curator access to the platform&apos;s
              content management system.
            </p>
          </div>

          <div>
            <p className="text-stone-800 font-medium">For developers:</p>
            <p className="text-stone-700 leading-relaxed mt-1">
              The platform&apos;s source code is available at{' '}
              <a
                href="https://github.com/ambhrni/shastra-adhyayana"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-saffron-700 hover:text-saffron-800 underline underline-offset-2"
              >
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                github.com/ambhrni/shastra-adhyayana
              </a>
              . Read the CONTRIBUTING.md for technical standards and how to submit improvements via
              pull request.
            </p>
          </div>

          <div>
            <p className="text-stone-800 font-medium">What collaborators must know:</p>
            <ul className="mt-2 space-y-1 text-stone-700">
              <li className="flex gap-2">
                <span className="text-saffron-500 shrink-0">•</span>
                <span>All content follows Mādhva Dvaita Vedānta siddhānta strictly — contributions inconsistent with the paramparā will not be approved</span>
              </li>
              <li className="flex gap-2">
                <span className="text-saffron-500 shrink-0">•</span>
                <span>The curator retains final authority over all content and direction</span>
              </li>
              <li className="flex gap-2">
                <span className="text-saffron-500 shrink-0">•</span>
                <span>Code contributions are welcome under the platform&apos;s license terms — no forking or separate deployment without permission</span>
              </li>
              <li className="flex gap-2">
                <span className="text-saffron-500 shrink-0">•</span>
                <span>Every contribution is an act of sevā to the tradition</span>
              </li>
            </ul>
          </div>
        </div>
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
