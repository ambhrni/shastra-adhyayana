'use client'

import { useState } from 'react'
import type { ArgumentStream } from '@/lib/argument-map-generator'
import SectionDrillDown from './SectionDrillDown'

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

export interface SectionLink {
  from_section:       number
  to_section:         number
  connection_type:    string
  rationale:          string | null
  rationale_sanskrit: string | null
  is_spine:           boolean
}

type ColorKey = 'red' | 'orange' | 'blue' | 'green' | 'stone'

type ArgumentType = 'lakshanam' | 'pramanam' | 'anumanam' | 'siddhanta' | 'opening_closing'

const ARGUMENT_TYPE_TO_COLOR: Record<ArgumentType, ColorKey> = {
  lakshanam:       'orange',
  pramanam:        'blue',
  anumanam:        'red',
  siddhanta:       'green',
  opening_closing: 'stone',
}

interface Props {
  textId: string
  textTitle: string
  sections: SectionData[]
  approvedNodes: ApprovedNodeInfo[]
  sectionArgumentTypes: Record<number, ArgumentType>
  sectionLinks?: SectionLink[]
  isCurator?: boolean
  initialSectionNumber?: number
}

// ── Color classes ─────────────────────────────────────────────────────────────

const COLOR_CLASSES: Record<ColorKey, {
  pill: string
  pillSelected: string
  pillHover: string
  dot: string
  label: string
}> = {
  red:    { pill: 'bg-red-100 border-red-300 text-red-800',          pillSelected: 'ring-2 ring-red-500 bg-red-200',      pillHover: 'hover:bg-red-200',    dot: 'bg-red-400',    label: 'Anumanam refutation' },
  orange: { pill: 'bg-orange-100 border-orange-300 text-orange-800', pillSelected: 'ring-2 ring-orange-500 bg-orange-200', pillHover: 'hover:bg-orange-200', dot: 'bg-orange-400', label: 'Lakṣaṇam refutation' },
  blue:   { pill: 'bg-blue-100 border-blue-300 text-blue-800',       pillSelected: 'ring-2 ring-blue-500 bg-blue-200',    pillHover: 'hover:bg-blue-200',   dot: 'bg-blue-400',   label: 'Pramāṇam refutation' },
  green:  { pill: 'bg-green-100 border-green-300 text-green-800',    pillSelected: 'ring-2 ring-green-500 bg-green-200',  pillHover: 'hover:bg-green-200',  dot: 'bg-green-400',  label: 'Siddhānta' },
  stone:  { pill: 'bg-stone-100 border-stone-300 text-stone-700',    pillSelected: 'ring-2 ring-stone-500 bg-stone-200',  pillHover: 'hover:bg-stone-200',  dot: 'bg-stone-400',  label: 'Opening / Closing' },
}

// ── Movements ─────────────────────────────────────────────────────────────────

const MOVEMENTS = [
  { label: 'Jagatsatya', subtitle: '§1–25', range: [1, 25] as [number, number] },
  { label: 'Bhedasatya', subtitle: '§26–40', range: [26, 40] as [number, number] },
]

// ── Connection type styles ────────────────────────────────────────────────────

const CONNECTION_TYPE_STYLES: Record<string, { stroke: string; label: string }> = {
  'establishes':  { stroke: '#22c55e', label: 'Establishes' },
  'consolidates': { stroke: '#f97316', label: 'Consolidates' },
  'leads-to':     { stroke: '#3b82f6', label: 'Leads to' },
  'responds-to':  { stroke: '#a855f7', label: 'Responds to' },
  'follows-from': { stroke: '#78716c', label: 'Follows from' },
  'refutes':      { stroke: '#ef4444', label: 'Refutes' },
}

// ── DAG layout constants ──────────────────────────────────────────────────────

const NODE_W      = 200
const NODE_H      = 96
const H_GAP_HALF  = 260   // x-step per virtual column slot; primary columns 520px apart
const V_GAP       = 160   // y-step between stacked nodes in the same column
const PAD_X       = 32
const PAD_Y       = 40
const MAX_PER_COL = 2     // ranks with >2 nodes split into sub-columns

// ── Component ─────────────────────────────────────────────────────────────────

export default function ArgumentMapView({
  textId, sections, approvedNodes, sectionArgumentTypes, sectionLinks = [],
  isCurator, initialSectionNumber,
}: Props) {
  const [selectedSectionNumber, setSelectedSectionNumber] = useState<number | null>(initialSectionNumber ?? null)
  const [tooltip, setTooltip] = useState<{ link: SectionLink; x: number; y: number } | null>(null)
  const [seqOpen, setSeqOpen] = useState(false)

  const approvedPassageIds = new Set(approvedNodes.map(n => n.passage_id))
  const sectionsMap = new Map(sections.map(s => [s.sectionNumber, s]))
  const selectedSection = selectedSectionNumber != null
    ? sectionsMap.get(selectedSectionNumber) ?? null
    : null

  // ── Section pill renderer ─────────────────────────────────────────────────

  function SectionPills({ compact }: { compact: boolean }) {
    return (
      <div className="space-y-4">
        {MOVEMENTS.map(movement => {
          const movementSections = sections.filter(
            s => s.sectionNumber >= movement.range[0] && s.sectionNumber <= movement.range[1]
          )
          return (
            <div key={movement.label}>
              <div className="mb-2">
                <p className={`font-semibold text-stone-800 ${compact ? 'text-xs' : 'text-base'}`}>
                  {movement.label}
                </p>
                <p className="text-[10px] text-stone-400">{movement.subtitle}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {movementSections.map(section => {
                  const argType    = sectionArgumentTypes[section.sectionNumber] ?? 'anumanam'
                  const color      = ARGUMENT_TYPE_TO_COLOR[argType]
                  const cls        = COLOR_CLASSES[color]
                  const isSelected = selectedSectionNumber === section.sectionNumber
                  const shortName  = compact ? null : (section.sectionName ?? '') || null
                  const hasNodes   = section.passages.some(p => approvedPassageIds.has(p.id))

                  return (
                    <button
                      key={section.sectionNumber}
                      onClick={() => setSelectedSectionNumber(isSelected ? null : section.sectionNumber)}
                      title={section.sectionName ?? undefined}
                      className={`relative flex flex-col items-center border rounded-lg transition-all
                        ${compact ? 'px-1.5 py-1 min-w-[28px]' : 'px-3 py-2 min-w-[160px] rounded-xl'}
                        ${cls.pill} ${cls.pillHover}
                        ${isSelected ? cls.pillSelected : ''}
                      `}
                    >
                      <span className={`font-bold ${compact ? 'text-[10px]' : 'text-base'}`}>
                        §{section.sectionNumber}
                      </span>
                      {shortName && (
                        <span className="font-devanagari leading-snug mt-0.5 opacity-75 text-center whitespace-normal text-sm">
                          {shortName}
                        </span>
                      )}
                      {hasNodes && (
                        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-green-400" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // ── Argument Flow DAG ─────────────────────────────────────────────────────

  function CrossLinkDAG() {
    const crossLinks = sectionLinks.filter(l => !l.is_spine && l.from_section !== l.to_section)

    if (crossLinks.length === 0) {
      return (
        <p className="text-sm text-stone-400 italic py-4">
          No cross-links available yet. Run the generate-section-links script to populate this view.
        </p>
      )
    }

    // ── Build directed graph ───────────────────────────────────────────────

    const allNums = new Set<number>()
    for (const l of crossLinks) { allNums.add(l.from_section); allNums.add(l.to_section) }
    const allSectionNums = Array.from(allNums).sort((a, b) => a - b)

    const outEdges = new Map<number, number[]>(allSectionNums.map(sn => [sn, []]))
    const inEdges  = new Map<number, number[]>(allSectionNums.map(sn => [sn, []]))
    for (const l of crossLinks) {
      outEdges.get(l.from_section)!.push(l.to_section)
      inEdges.get(l.to_section)!.push(l.from_section)
    }

    // ── Topological sort (Kahn's) ──────────────────────────────────────────

    const inDegree = new Map<number, number>(
      allSectionNums.map(sn => [sn, (inEdges.get(sn) ?? []).length])
    )
    const bfsQueue  = allSectionNums.filter(sn => inDegree.get(sn) === 0)
    const topoOrder: number[] = []
    const visited   = new Set<number>()

    while (bfsQueue.length > 0) {
      const n = bfsQueue.shift()!
      if (visited.has(n)) continue
      visited.add(n)
      topoOrder.push(n)
      for (const nb of (outEdges.get(n) ?? []).sort((a, b) => a - b)) {
        inDegree.set(nb, (inDegree.get(nb) ?? 1) - 1)
        if (inDegree.get(nb) === 0) bfsQueue.push(nb)
      }
    }
    for (const sn of allSectionNums) {
      if (!visited.has(sn)) topoOrder.push(sn)
    }

    // ── Longest-path rank assignment ───────────────────────────────────────

    const rank = new Map<number, number>()
    for (const n of topoOrder) {
      const preds = inEdges.get(n) ?? []
      rank.set(n, preds.length === 0
        ? 0
        : Math.max(...preds.map(p => (rank.get(p) ?? 0) + 1))
      )
    }

    // ── Group by rank, sort within each rank ──────────────────────────────

    const rankGroups = new Map<number, number[]>()
    for (const [sn, r] of rank) {
      if (!rankGroups.has(r)) rankGroups.set(r, [])
      rankGroups.get(r)!.push(sn)
    }
    for (const group of rankGroups.values()) group.sort((a, b) => a - b)

    // ── Split into virtual columns ─────────────────────────────────────────
    // Rank with ≤MAX_PER_COL nodes → virtual column rank*2.
    // Rank with >MAX_PER_COL nodes → first half to rank*2, second half to rank*2+1.

    const vColGroups = new Map<number, number[]>()
    for (const [r, group] of rankGroups) {
      const vCol0 = r * 2
      if (group.length <= MAX_PER_COL) {
        vColGroups.set(vCol0, group)
      } else {
        const split = Math.ceil(group.length / 2)
        vColGroups.set(vCol0,     group.slice(0, split))
        vColGroups.set(vCol0 + 1, group.slice(split))
      }
    }

    // ── Compute node positions ─────────────────────────────────────────────

    const pos = new Map<number, { x: number; y: number }>()
    for (const [vCol, group] of vColGroups) {
      group.forEach((sn, i) => {
        pos.set(sn, {
          x: PAD_X + vCol * H_GAP_HALF,
          y: PAD_Y + i * V_GAP,
        })
      })
    }

    // ── Canvas dimensions ──────────────────────────────────────────────────

    const maxVCol   = Math.max(0, ...Array.from(vColGroups.keys()))
    const maxInVCol = Math.max(1, ...Array.from(vColGroups.values()).map(g => g.length))
    const canvasW   = Math.max(
      2 * PAD_X + maxVCol * H_GAP_HALF + NODE_W,
      (maxVCol + 1) * 300 + 200,
    )
    const canvasH   = Math.max(
      2 * PAD_Y + (maxInVCol - 1) * V_GAP + NODE_H,
      maxInVCol * 180 + 200,
    )

    // ── Connection types present ───────────────────────────────────────────

    const presentTypes = Array.from(new Set(crossLinks.map(l => l.connection_type)))
      .filter(t => t in CONNECTION_TYPE_STYLES)
      .sort()

    // ── Arrow geometry ────────────────────────────────────────────────────

    function arrowGeom(link: SectionLink) {
      const fp = pos.get(link.from_section)
      const tp = pos.get(link.to_section)
      if (!fp || !tp) return null

      const fromRank = rank.get(link.from_section) ?? 0
      const toRank   = rank.get(link.to_section)   ?? 0

      let fx: number, fy: number, tx: number, ty: number
      let cp1x: number, cp1y: number, cp2x: number, cp2y: number

      if (fromRank < toRank) {
        // Forward: exit right edge → enter left edge, horizontal S-curve
        fx = fp.x + NODE_W;  fy = fp.y + NODE_H / 2
        tx = tp.x;           ty = tp.y + NODE_H / 2
        const offset = (tx - fx) * 0.45
        cp1x = fx + offset;  cp1y = fy
        cp2x = tx - offset;  cp2y = ty
      } else {
        // Same-rank or backward: arc below both nodes
        fx = fp.x + NODE_W / 2;  fy = fp.y + NODE_H
        tx = tp.x + NODE_W / 2;  ty = tp.y + NODE_H
        const depth = 60 + Math.abs(fromRank - toRank) * 24
        cp1x = fx;  cp1y = fy + depth
        cp2x = tx;  cp2y = ty + depth
      }

      return { d: `M ${fx} ${fy} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${tx} ${ty}` }
    }

    // ── Pre-compute all geometries ─────────────────────────────────────────

    const geomCache = new Map<string, ReturnType<typeof arrowGeom>>()
    for (const link of crossLinks) {
      geomCache.set(`${link.from_section}-${link.to_section}`, arrowGeom(link))
    }

    // ── Render ────────────────────────────────────────────────────────────

    return (
      <>
        {/* Legend */}
        {presentTypes.length > 0 && (
          <div className="flex flex-wrap gap-x-5 gap-y-2 mb-5">
            {presentTypes.map(type => {
              const s = CONNECTION_TYPE_STYLES[type]
              return (
                <div key={type} className="flex items-center gap-1.5">
                  <svg width="26" height="10" className="shrink-0">
                    <line x1="0" y1="5" x2="20" y2="5" stroke={s.stroke} strokeWidth="1.5" strokeOpacity="0.8" />
                    <polygon points="17,2.5 23,5 17,7.5" fill={s.stroke} fillOpacity="0.85" />
                  </svg>
                  <span className="text-xs text-stone-500">{s.label}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* DAG canvas — full width, scrollable in both axes */}
        <div
          className="overflow-auto rounded-xl border border-stone-100 bg-stone-50"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#d6d3d1 #f5f5f4' }}
        >
          <div className="relative" style={{ width: canvasW, height: canvasH }}>

            {/* SVG arrow layer */}
            <svg
              className="absolute inset-0"
              width={canvasW}
              height={canvasH}
              style={{ zIndex: 0, overflow: 'visible' }}
            >
              <defs>
                {presentTypes.map(type => {
                  const stroke = CONNECTION_TYPE_STYLES[type]?.stroke ?? '#78716c'
                  return (
                    <marker
                      key={type}
                      id={`dag-${type}`}
                      markerWidth="6" markerHeight="5" refX="5.5" refY="2.5" orient="auto"
                    >
                      <polygon points="0 0, 6 2.5, 0 5" fill={stroke} fillOpacity="0.9" />
                    </marker>
                  )
                })}
              </defs>

              {crossLinks.map(link => {
                const key = `${link.from_section}-${link.to_section}`
                const g   = geomCache.get(key)
                if (!g) return null

                const { d } = g
                const style    = CONNECTION_TYPE_STYLES[link.connection_type] ?? CONNECTION_TYPE_STYLES['follows-from']
                const markerId = link.connection_type in CONNECTION_TYPE_STYLES ? link.connection_type : 'follows-from'
                const isHovered = tooltip?.link.from_section === link.from_section &&
                                  tooltip?.link.to_section   === link.to_section

                return (
                  <g key={key}>
                    {/* Visible arc */}
                    <path
                      d={d} fill="none"
                      stroke={style.stroke}
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      strokeOpacity={isHovered ? 0.9 : 0.55}
                      markerEnd={`url(#dag-${markerId})`}
                      style={{ pointerEvents: 'none' }}
                    />
                    {/* Wide transparent hit area */}
                    <path
                      d={d} fill="none" stroke="transparent" strokeWidth={14}
                      style={{ pointerEvents: 'stroke' as any, cursor: 'pointer' }}
                      onMouseEnter={e => setTooltip({ link, x: e.clientX, y: e.clientY })}
                      onMouseMove={e => setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null)}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  </g>
                )
              })}
            </svg>

            {/* Section node cards */}
            {allSectionNums.map(sn => {
              const nodePos    = pos.get(sn)
              if (!nodePos) return null
              const argType    = sectionArgumentTypes[sn] ?? 'anumanam'
              const color      = ARGUMENT_TYPE_TO_COLOR[argType]
              const cls        = COLOR_CLASSES[color]
              const section    = sectionsMap.get(sn)
              const isSelected = selectedSectionNumber === sn

              return (
                <div
                  key={sn}
                  className="absolute"
                  style={{ left: nodePos.x, top: nodePos.y, width: NODE_W, height: NODE_H, zIndex: 1 }}
                >
                  <button
                    onClick={() => setSelectedSectionNumber(isSelected ? null : sn)}
                    title={section?.sectionName ?? undefined}
                    className={`w-full h-full flex flex-col items-start justify-center rounded-lg border p-3 text-left transition-all
                      ${cls.pill} ${cls.pillHover} ${isSelected ? cls.pillSelected : ''}
                      hover:shadow-md
                    `}
                  >
                    <span className="text-base font-bold leading-none">§{sn}</span>
                    {section?.sectionName && (
                      <span className="text-sm font-devanagari leading-snug mt-1 line-clamp-2 w-full opacity-75">
                        {section.sectionName}
                      </span>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Hover tooltip — fixed, follows cursor, viewport-aware */}
        {tooltip && (() => {
          const TIP_W = 320
          const TIP_H = 180   // estimated; enough for 2 rationale paragraphs
          const tipX  = tooltip.x + 14 + TIP_W > (typeof window !== 'undefined' ? window.innerWidth  : 9999)
            ? tooltip.x - TIP_W - 14
            : tooltip.x + 14
          const tipY  = tooltip.y + 14 + TIP_H > (typeof window !== 'undefined' ? window.innerHeight : 9999)
            ? tooltip.y - TIP_H - 14
            : tooltip.y + 14
          const style = CONNECTION_TYPE_STYLES[tooltip.link.connection_type] ?? CONNECTION_TYPE_STYLES['follows-from']
          return (
            <div
              className="fixed z-50 pointer-events-none bg-white rounded-lg shadow-lg border border-stone-200 p-3 max-w-xs text-sm space-y-1.5"
              style={{ left: tipX, top: tipY, width: TIP_W }}
            >
              {/* Connection type + section numbers */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: style.stroke }}
                >
                  {tooltip.link.connection_type.replace(/-/g, ' ')}
                </span>
                <span className="text-xs text-stone-400">
                  §{tooltip.link.from_section} → §{tooltip.link.to_section}
                </span>
              </div>
              {/* Sanskrit rationale — shown first */}
              {tooltip.link.rationale_sanskrit && (
                <p className="font-devanagari font-semibold text-stone-800 leading-snug">
                  {tooltip.link.rationale_sanskrit}
                </p>
              )}
              {/* English rationale — shown second */}
              {tooltip.link.rationale && (
                <p className="text-stone-600 leading-snug mt-1">{tooltip.link.rationale}</p>
              )}
            </div>
          )
        })()}
      </>
    )
  }

  // ── Split layout (section selected) ──────────────────────────────────────

  if (selectedSection) {
    const argType = sectionArgumentTypes[selectedSection.sectionNumber] ?? 'anumanam'

    return (
      <div className="flex gap-0 h-[calc(100vh-120px)]">
        <div
          className="w-1/5 shrink-0 border-r border-stone-200 overflow-y-auto pr-4 pb-8"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#d6d3d1 #f5f5f4' }}
        >
          <SectionPills compact />
        </div>
        <div
          className="flex-1 overflow-y-auto pl-8 pb-8 pt-1"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#d6d3d1 #f5f5f4' }}
        >
          <SectionDrillDown
            key={selectedSection.sectionNumber}
            textId={textId}
            sectionNumber={selectedSection.sectionNumber}
            sectionName={selectedSection.sectionName}
            argumentType={argType}
            isCurator={isCurator}
          />
        </div>
      </div>
    )
  }

  // ── Full layout (no section selected) ────────────────────────────────────

  return (
    <div className="bg-stone-50 py-8 -mx-8 px-8 min-h-full">

      {/* ── Sequence View card — collapsible ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100">
        <button
          onClick={() => setSeqOpen(o => !o)}
          className="w-full flex items-center gap-2.5 p-6 text-left hover:bg-stone-50 transition-colors rounded-2xl cursor-pointer"
        >
          <svg className="w-4 h-4 text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-stone-800 leading-none">Sequence View</h2>
            <p className="text-xs text-stone-500 mt-0.5">40 sections in argumentative order</p>
          </div>
          <span className="text-sm text-stone-400 shrink-0 select-none">
            {seqOpen ? 'Hide ▲' : 'Show ▼'}
          </span>
        </button>

        {seqOpen && (
          <div className="px-6 pb-6">
            <div className="flex flex-wrap gap-3 mb-6">
              {(Object.entries(COLOR_CLASSES) as [ColorKey, typeof COLOR_CLASSES[ColorKey]][]).map(([key, cls]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${cls.dot}`} />
                  <span className="text-xs text-stone-500">{cls.label}</span>
                </div>
              ))}
            </div>
            <SectionPills compact={false} />
          </div>
        )}
      </div>

      {/* ── Argument Flow View card ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 mt-12">
        <div className="flex items-center gap-2.5 mb-6">
          <svg className="w-4 h-4 text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <circle cx="5"  cy="12" r="2" />
            <circle cx="19" cy="5"  r="2" />
            <circle cx="19" cy="19" r="2" />
            <path strokeLinecap="round" d="M7 11.3 15 6.5M7 12.7 15 17.5" />
          </svg>
          <div>
            <h2 className="text-base font-semibold text-stone-800 leading-none">Argument Flow View</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Non-sequential logical dependencies — hover an arrow to read its rationale
            </p>
          </div>
        </div>

        <CrossLinkDAG />
      </div>
    </div>
  )
}
