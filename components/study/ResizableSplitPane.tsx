'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface Props {
  left: React.ReactNode
  right: React.ReactNode
  defaultLeftPercent?: number
  minLeftPercent?: number
  maxLeftPercent?: number
}

export default function ResizableSplitPane({
  left,
  right,
  defaultLeftPercent = 58,
  minLeftPercent = 25,
  maxLeftPercent = 80,
}: Props) {
  const [leftPercent, setLeftPercent] = useState(defaultLeftPercent)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  // Hydrate from localStorage after mount
  useEffect(() => {
    const saved = localStorage.getItem('study-split-position')
    if (saved) {
      const n = parseFloat(saved)
      if (!isNaN(n) && n >= minLeftPercent && n <= maxLeftPercent) {
        setLeftPercent(n)
      }
    }
  }, [minLeftPercent, maxLeftPercent])

  const applyPercent = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const raw = ((clientX - rect.left) / rect.width) * 100
    const clamped = Math.min(maxLeftPercent, Math.max(minLeftPercent, raw))
    setLeftPercent(clamped)
    localStorage.setItem('study-split-position', String(clamped))
  }, [minLeftPercent, maxLeftPercent])

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging.current) return
    applyPercent(e.clientX)
  }, [applyPercent])

  const onMouseUp = useCallback(() => {
    if (!dragging.current) return
    dragging.current = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!dragging.current) return
    applyPercent(e.touches[0].clientX)
  }, [applyPercent])

  const onTouchEnd = useCallback(() => {
    dragging.current = false
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('touchmove', onTouchMove, { passive: true })
    document.addEventListener('touchend', onTouchEnd)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onTouchEnd)
    }
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd])

  const startDrag = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    dragging.current = true
    if ('clientX' in e) {
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }
  }, [])

  return (
    <div ref={containerRef} className="flex flex-1 overflow-hidden min-h-0">
      {/* Left panel */}
      <div
        style={{ width: `${leftPercent}%` }}
        className="overflow-y-auto p-6 min-w-0 shrink-0"
      >
        {left}
      </div>

      {/* Divider */}
      <div
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        className="relative w-1 shrink-0 bg-stone-700 hover:bg-saffron-600 active:bg-saffron-600 cursor-col-resize transition-colors duration-150 group select-none z-10"
        title="Drag to resize"
      >
        {/* Vertical grip — three short bars */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 pointer-events-none">
          <div className="w-0.5 h-4 rounded-full bg-stone-500 group-hover:bg-white transition-colors duration-150" />
          <div className="w-0.5 h-4 rounded-full bg-stone-500 group-hover:bg-white transition-colors duration-150" />
          <div className="w-0.5 h-4 rounded-full bg-stone-500 group-hover:bg-white transition-colors duration-150" />
        </div>
      </div>

      {/* Right panel */}
      <div className="overflow-hidden flex flex-col min-w-0 flex-1">
        {right}
      </div>
    </div>
  )
}
