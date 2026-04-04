'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { ArgumentStream } from '@/lib/argument-map-generator'

// ── Types ─────────────────────────────────────────────────────────────────────

interface PassageInfo {
  id: string
  sequence_order: number
}

interface SectionData {
  sectionNumber: number
  sectionName: string | null
  passages: PassageInfo[]
}

interface ApprovedNodeInfo {
  passage_id: string
  stream: ArgumentStream
}

interface Props {
  textId: string
  textTitle: string
  sections: SectionData[]
  approvedNodes: ApprovedNodeInfo[]
}

// ── Section color mapping ─────────────────────────────────────────────────────

type ColorKey = 'red' | 'orange' | 'blue' | 'green' | 'stone'

function getSectionColor(n: number): ColorKey {
  if (n === 1 || n === 6 || n === 26 || n === 29) return 'stone'
  if (n === 3 || n === 4) return 'orange'
  if (n === 5 || (n >= 11 && n <= 14)) return 'blue'
  if ((n >= 21 && n <= 25) || (n >= 30 && n <= 38)) return 'green'
  // red: §2, §7–10, §15–20, §27–28, §39–40
  return 'red'
}

const COLOR_CLASSES: Record<ColorKey, {
  pill: string
  pillSelected: string
  pillHover: string
  dot: string
  label: string
}> = {
  red:    { pill: 'bg-red-100 border-red-300 text-red-800',         pillSelected: 'ring-2 ring-red-500 bg-red-200',    pillHover: 'hover:bg-red-200',    dot: 'bg-red-400',    label: 'Anumanam refutation' },
  orange: { pill: 'bg-orange-100 border-orange-300 text-orange-800', pillSelected: 'ring-2 ring-orange-500 bg-orange-200', pillHover: 'hover:bg-orange-200', dot: 'bg-orange-400', label: 'Lakṣaṇam refutation' },
  blue:   { pill: 'bg-blue-100 border-blue-300 text-blue-800',       pillSelected: 'ring-2 ring-blue-500 bg-blue-200',    pillHover: 'hover:bg-blue-200',   dot: 'bg-blue-400',   label: 'Pramāṇam refutation' },
  green:  { pill: 'bg-green-100 border-green-300 text-green-800',     pillSelected: 'ring-2 ring-green-500 bg-green-200',  pillHover: 'hover:bg-green-200',  dot: 'bg-green-400',  label: 'Siddhānta' },
  stone:  { pill: 'bg-stone-100 border-stone-300 text-stone-700',     pillSelected: 'ring-2 ring-stone-500 bg-stone-200',  pillHover: 'hover:bg-stone-200',  dot: 'bg-stone-400',  label: 'Opening / Closing' },
}

// ── Movements ─────────────────────────────────────────────────────────────────

const MOVEMENTS = [
  { label: 'Jagatsatya', subtitle: '§1 to §25', range: [1, 25] as [number, number] },
  { label: 'Bhedasatya', subtitle: '§26 to §40', range: [26, 40] as [number, number] },
]

const STREAM_LABELS: Record<ArgumentStream, string> = {
  mula: 'मूलम्',
  bhavadipika: 'भावदीपिका',
  vadavaliprakasha: 'वादावलीप्रकाशः',
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ArgumentMapView({ textId, textTitle, sections, approvedNodes }: Props) {
  const [selectedStream, setSelectedStream] = useState<ArgumentStream>('mula')
  const [selectedSectionNumber, setSelectedSectionNumber] = useState<number | null>(null)

  // Build a set of passage IDs that have approved nodes for the selected stream
  const approvedPassageIds = new Set(
    approvedNodes
      .filter(n => n.stream === selectedStream)
      .map(n => n.passage_id)
  )

  const sectionsMap = new Map(sections.map(s => [s.sectionNumber, s]))
  const selectedSection = selectedSectionNumber != null
    ? sectionsMap.get(selectedSectionNumber) ?? null
    : null

  return (
    <div>
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-900">Argument Map — Vādāvalī</h1>
        <p className="text-stone-500 mt-1 text-sm">
          The logical architecture of Jayatīrtha's refutation of Advaita Vedānta
        </p>
      </div>

      {/* Stream toggle */}
      <div className="flex gap-2 mb-8">
        {(['mula', 'bhavadipika', 'vadavaliprakasha'] as ArgumentStream[]).map(stream => (
          <button
            key={stream}
            onClick={() => setSelectedStream(stream)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors font-devanagari ${
              selectedStream === stream
                ? 'bg-saffron-600 text-white'
                : 'border border-stone-300 text-stone-600 hover:border-saffron-400 hover:text-saffron-700'
            }`}
          >
            {STREAM_LABELS[stream]}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-8">
        {(Object.entries(COLOR_CLASSES) as [ColorKey, typeof COLOR_CLASSES[ColorKey]][]).map(([key, cls]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${cls.dot}`} />
            <span className="text-xs text-stone-500">{cls.label}</span>
          </div>
        ))}
      </div>

      {/* Movement bands */}
      <div className="space-y-8">
        {MOVEMENTS.map(movement => {
          const movementSections = sections.filter(
            s => s.sectionNumber >= movement.range[0] && s.sectionNumber <= movement.range[1]
          )

          return (
            <div key={movement.label}>
              <div className="mb-3">
                <h2 className="text-base font-semibold text-stone-800">{movement.label}</h2>
                <p className="text-xs text-stone-400">{movement.subtitle}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {movementSections.map(section => {
                  const color = getSectionColor(section.sectionNumber)
                  const cls = COLOR_CLASSES[color]
                  const isSelected = selectedSectionNumber === section.sectionNumber
                  const shortName = (section.sectionName ?? '').slice(0, 18)

                  return (
                    <button
                      key={section.sectionNumber}
                      onClick={() => setSelectedSectionNumber(
                        isSelected ? null : section.sectionNumber
                      )}
                      className={`flex flex-col items-center px-3 py-2 rounded-xl border text-left transition-all
                        ${cls.pill} ${cls.pillHover}
                        ${isSelected ? cls.pillSelected : ''}
                      `}
                      style={{ minWidth: '64px' }}
                    >
                      <span className="text-xs font-bold">§{section.sectionNumber}</span>
                      {shortName && (
                        <span className="text-[10px] font-devanagari leading-tight mt-0.5 opacity-75 text-center max-w-[80px] truncate">
                          {shortName}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Section detail panel */}
      {selectedSection && (
        <div className="mt-10 border-t border-stone-200 pt-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-stone-900">
                §{selectedSection.sectionNumber}
                {selectedSection.sectionName && (
                  <span className="font-devanagari ml-2 text-saffron-700">
                    {selectedSection.sectionName}
                  </span>
                )}
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                {selectedSection.passages.length} passage{selectedSection.passages.length !== 1 ? 's' : ''}
              </p>
            </div>
            <span className="text-xs text-stone-300 italic">Argument detail — Phase 2</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedSection.passages.map(passage => {
              const hasApproved = approvedPassageIds.has(passage.id)
              return (
                <Link
                  key={passage.id}
                  href={`/study/${textId}/${passage.id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 hover:border-saffron-400 hover:bg-saffron-50 transition-colors group"
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      hasApproved ? 'bg-green-400' : 'bg-stone-300'
                    }`}
                    title={hasApproved ? 'Has approved argument nodes' : 'No approved nodes yet'}
                  />
                  <span className="text-xs text-stone-700 group-hover:text-saffron-700">
                    {passage.sequence_order}
                  </span>
                </Link>
              )
            })}
          </div>

          <p className="text-xs text-stone-400 mt-4">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              has approved argument nodes in selected stream
            </span>
            <span className="mx-2">·</span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-stone-300 inline-block" />
              not yet generated
            </span>
          </p>
        </div>
      )}
    </div>
  )
}
