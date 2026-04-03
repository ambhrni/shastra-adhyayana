'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

interface Video {
  id: string
  title: string
  youtube_url: string
  thumbnail_url: string
}

interface Props {
  videos: Video[]
  compact?: boolean
}

export default function VideoCarousel({ videos, compact = false }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft]   = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
  }, [])

  useEffect(() => {
    // Delay slightly so images have started loading and widths are known
    const t = setTimeout(updateScrollState, 50)
    return () => clearTimeout(t)
  }, [videos, updateScrollState])

  const scrollBy = (dx: number) =>
    scrollRef.current?.scrollBy({ left: dx, behavior: 'smooth' })

  return (
    <div className="relative">
      {/* Left chevron */}
      {!compact && canScrollLeft && (
        <button
          onClick={() => scrollBy(-300)}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10
                     bg-white/80 hover:bg-white rounded-full p-1.5
                     shadow transition-colors"
        >
          <svg className="w-4 h-4 text-stone-700" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Right chevron */}
      {!compact && canScrollRight && (
        <button
          onClick={() => scrollBy(300)}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10
                     bg-white/80 hover:bg-white rounded-full p-1.5
                     shadow transition-colors"
        >
          <svg className="w-4 h-4 text-stone-700" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Scrollable strip */}
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className={`flex overflow-x-auto scroll-smooth snap-x snap-mandatory
                    [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]
                    [scrollbar-width:none]
                    ${compact ? 'gap-2' : 'gap-3'}`}
      >
        {videos.map(v => (
          <a
            key={v.id}
            href={v.youtube_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`snap-start shrink-0 group ${compact ? 'w-32' : 'w-48'}`}
          >
            <div className="aspect-video overflow-hidden rounded-lg bg-stone-100
                            group-hover:scale-105 group-hover:shadow-md
                            transition-all duration-200">
              <img
                src={v.thumbnail_url}
                alt={v.title}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs line-clamp-2 text-stone-700 mt-1 leading-snug">
              {v.title}
            </p>
          </a>
        ))}
      </div>
    </div>
  )
}
