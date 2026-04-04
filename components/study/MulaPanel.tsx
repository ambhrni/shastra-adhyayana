import Link from 'next/link'
import type { Passage } from '@/types/database'
import InlineEditor from './InlineEditor'

interface MulaPanelProps {
  passage: Passage
  isCurator: boolean
  textId?: string
}

export default function MulaPanel({ passage, isCurator, textId }: MulaPanelProps) {
  return (
    <div className="mb-8">
      {passage.section_name && (
        <p className="text-sm text-stone-400 font-devanagari mb-2 leading-snug">
          {passage.section_name}
        </p>
      )}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-medium text-stone-400 uppercase tracking-wide">
          {passage.section_number != null ? `§${passage.section_number}` : ''}
          {passage.subsection_number != null ? `.${passage.subsection_number}` : ''}
        </span>
        <span className="text-xs text-stone-300">Mūla</span>
        {textId && (
          <Link
            href={`/texts/${textId}/map`}
            className="ml-auto text-xs text-stone-400 hover:text-saffron-600 transition-colors"
          >
            Map ↗
          </Link>
        )}
      </div>

      {isCurator ? (
        <InlineEditor
          table="passages"
          field="mula_text"
          recordId={passage.id}
          initialValue={passage.mula_text}
          isDevanagari
          displayClassName="text-[22px] font-semibold leading-relaxed"
        />
      ) : (
        <p className="text-[22px] font-semibold text-stone-900 leading-relaxed font-devanagari">{passage.mula_text}</p>
      )}

      {passage.mula_transliterated && (
        <div className="mt-4">
          {isCurator ? (
            <InlineEditor
              table="passages"
              field="mula_transliterated"
              recordId={passage.id}
              initialValue={passage.mula_transliterated}
            />
          ) : (
            <p className="text-sm text-stone-500 italic leading-relaxed">
              {passage.mula_transliterated}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
