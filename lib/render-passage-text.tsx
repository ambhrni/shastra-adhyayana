/**
 * lib/render-passage-text.tsx
 *
 * Shared rendering for mula_text / commentary_text as stored in the DB.
 *
 * 2026-08-07: footnotes temporarily disabled per curator feedback -- the
 * numbered-list-at-bottom design didn't read well visually, and rather than
 * keep iterating blind, footnote markers + definitions are stripped from
 * DISPLAY entirely for now. This is a RENDER-TIME-ONLY change: the actual
 * [^key] references and folded definitions remain untouched in the database,
 * so a better footnote design can be reintroduced later without any data
 * loss or re-ingestion. See CLAUDE.md bhedojjivanam section for history.
 *
 * Also fixes a real data-content issue, still handled at render time rather
 * than editing stored text: the source transcription marks a word that was
 * interrupted by a footnote/page-break with "..." on BOTH sides of the
 * interruption (e.g. "...word_a[^key]..." ending one fragment, "...word_b..."
 * starting the next). Once merged/joined, this leaves a literal
 * "...  ..." sitting in the middle of what should read as one continuous
 * word/phrase. Once footnote refs are stripped (above), the two ellipses
 * become directly adjacent (only whitespace between them) and get collapsed
 * into nothing, rejoining the word cleanly. This targets the specific
 * "...<whitespace>..." pattern only -- not standalone single ellipses,
 * which would need individual curator review same as the original 7 merges.
 *
 * Still handles: **bold** spans (bhedojjivanam's pratika-marking convention)
 * -> <strong>. This part is unaffected by the footnote change.
 */
import React from 'react'

const FOOTNOTE_BLOCK_RE = /\n+-{3,}\n+\*\*[^*\n]*टिप्पण्यः[^*\n]*\*\*\n+[\s\S]*$/

function cleanText(text: string): string {
  let out = text.replace(FOOTNOTE_BLOCK_RE, '').trim()   // drop trailing footnote-defs block
  out = out.replace(/\[\^[^\]]+\]/g, '')                  // drop inline [^key] ref markers
  out = out.replace(/\.\.\.\s*\.\.\./g, '')               // collapse the now-adjacent "... ..." artifact
  return out
}

/** Full renderer: bold spans only, footnotes/artifacts stripped. Use for the
 *  actual reading/study views (MulaPanel, CommentaryTabs). */
export function renderPassageText(raw: string): React.ReactNode {
  if (!raw) return null
  const cleaned = cleanText(raw)
  const parts = cleaned.split(/(\*\*.+?\*\*)/gs)
  return (
    <>
      {parts.map((chunk, i) => {
        const isBold = chunk.startsWith('**') && chunk.endsWith('**') && chunk.length >= 4
        if (!isBold) return <React.Fragment key={i}>{chunk}</React.Fragment>
        return (
          <strong key={i} className="font-semibold text-stone-900">
            {chunk.slice(2, -2)}
          </strong>
        )
      })}
    </>
  )
}

/** Compact plain-text preview: same cleanup, plus strips ** entirely, for
 *  truncated list previews (e.g. the curator passage list). */
export function stripPassageMarkup(raw: string): string {
  if (!raw) return ''
  return cleanText(raw).replace(/\*\*/g, '').trim()
}
