'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Text, Passage } from '@/types/database'
import ExamSetup from '@/components/pariksha/ExamSetup'
import ExamSession from '@/components/pariksha/ExamSession'
import Spinner from '@/components/ui/Spinner'

export default function ParikshaPage() {
  const params = useParams()
  const textId = params.textId as string

  const [text, setText] = useState<Text | null>(null)
  const [passages, setPassages] = useState<Passage[]>([])
  const [loading, setLoading] = useState(true)
  const [examPassageId, setExamPassageId] = useState<string | null | undefined>(undefined)

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from('texts').select('*').eq('id', textId).single(),
      supabase.from('passages').select('id,section_number,subsection_number,mula_text,sequence_order')
        .eq('text_id', textId).eq('is_approved', true).order('sequence_order'),
    ]).then(([{ data: t }, { data: p }]) => {
      setText(t)
      setPassages((p ?? []) as Passage[])
      setLoading(false)
    })
  }, [textId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!text) {
    return <div className="p-8 text-stone-500">Text not found.</div>
  }

  // examPassageId === undefined → setup screen; otherwise → session
  if (examPassageId === undefined) {
    return (
      <div className="h-full overflow-y-auto py-10 px-4">
        <ExamSetup
          text={text}
          passages={passages}
          onStart={(pid) => setExamPassageId(pid)}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ExamSession
        textId={textId}
        passageId={examPassageId}
        onReset={() => setExamPassageId(undefined)}
      />
    </div>
  )
}
