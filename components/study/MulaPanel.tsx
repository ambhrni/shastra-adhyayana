import type { Passage } from '@/types/database'
import InlineEditor from './InlineEditor'

interface MulaPanelProps {
  passage: Passage
  isCurator: boolean
}

export default function MulaPanel({ passage, isCurator }: MulaPanelProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-medium text-stone-400 uppercase tracking-wide">
          {passage.section_number != null ? `§${passage.section_number}` : ''}
          {passage.subsection_number != null ? `.${passage.subsection_number}` : ''}
        </span>
        <span className="text-xs text-stone-300">Mūla</span>
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
