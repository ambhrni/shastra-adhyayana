'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ArgumentFlowDiagram } from '@/components/map/PassageChain'
import FlagArgumentMapModal from './FlagArgumentMapModal'
import type { ArgumentNodeRow } from '@/components/map/PassageChain'

interface Props {
  passageId: string
  textId: string
  isLoggedIn: boolean
  isCurator?: boolean
}

export default function PassageArgumentMap({ passageId, textId, isLoggedIn, isCurator }: Props) {
  const [nodes, setNodes] = useState<ArgumentNodeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [flagOpen, setFlagOpen] = useState(false)

  const fetchNodes = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('argument_nodes')
      .select('id, stream, node_type, content_english, content_sanskrit, logical_flaw, refutation_type, parent_node_id, display_order')
      .eq('passage_id', passageId)
      .order('display_order')
    setNodes((data ?? []) as ArgumentNodeRow[])
    setLoading(false)
  }, [passageId])

  useEffect(() => {
    let cancelled = false
    const supabase = createClient()
    supabase
      .from('argument_nodes')
      .select('id, stream, node_type, content_english, content_sanskrit, logical_flaw, refutation_type, parent_node_id, display_order')
      .eq('passage_id', passageId)
      .order('display_order')
      .then(({ data }) => {
        if (!cancelled) {
          setNodes((data ?? []) as ArgumentNodeRow[])
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [passageId])

  function handleNodeUpdate(updated: ArgumentNodeRow) {
    if ((updated as any)._deleted) {
      setNodes(prev => prev.filter(n => n.id !== updated.id))
    } else if ((updated as any)._refetch) {
      fetchNodes()
    } else {
      setNodes(prev => prev.map(n => n.id === updated.id ? updated : n))
    }
  }

  if (loading) return <p className="text-xs text-stone-400 p-4">Loading…</p>

  if (nodes.length === 0) {
    return (
      <p className="text-xs text-stone-400 italic p-4">
        No argument map for this passage yet.
      </p>
    )
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 relative">
        {isLoggedIn && (
          <button
            onClick={() => setFlagOpen(true)}
            title="Report an argument map issue"
            className="absolute top-4 right-4 text-stone-300 hover:text-amber-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
            </svg>
          </button>
        )}
        <ArgumentFlowDiagram
          nodes={nodes}
          textId={textId}
          passageId={passageId}
          isCurator={isCurator}
          onNodeUpdate={handleNodeUpdate}
        />
      </div>

      {flagOpen && (
        <FlagArgumentMapModal
          passageId={passageId}
          textId={textId}
          onClose={() => setFlagOpen(false)}
        />
      )}
    </>
  )
}
