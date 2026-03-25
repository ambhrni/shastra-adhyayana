import type { PassageNote, NoteType } from '@/types/database'
import Badge from '@/components/ui/Badge'

const noteTypeLabel: Record<NoteType, string> = {
  nyaya_concept:    'Nyāya',
  curator_note:     'Curator',
  guru_note:        'Guru',
  technical_grammar:'Grammar',
}

const noteTypeVariant: Record<NoteType, 'amber' | 'blue' | 'green' | 'stone'> = {
  nyaya_concept:    'amber',
  curator_note:     'stone',
  guru_note:        'green',
  technical_grammar:'blue',
}

export default function PassageNotesPanel({ notes }: { notes: PassageNote[] }) {
  if (notes.length === 0) return null

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Notes</h3>
      <div className="space-y-3">
        {notes.map(note => (
          <div key={note.id} className="bg-white border border-stone-200 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant={noteTypeVariant[note.note_type]}>
                {noteTypeLabel[note.note_type]}
              </Badge>
            </div>
            <p className="text-sm text-stone-700 leading-relaxed">{note.note_text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
