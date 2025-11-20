import { useEffect, useMemo, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import HTMLFlipBook from 'react-pageflip'

export default function Book({ items = [], onSelect, coverTitle = 'CookBook', onClose }) {
  const pages = useMemo(() => items.map((item, idx) => ({ ...item, _page: idx })), [items])
  const [current, setCurrent] = useState(0)
  const bookRef = useRef(null)

  useEffect(() => { if (current > pages.length) setCurrent(pages.length) }, [pages.length, current])
  useEffect(() => { try { bookRef.current?.pageFlip()?.update() } catch {} }, [pages.length])

  const pageElements = useMemo(() => {
    if (!pages.length) {
      return [
        (
          <motion.div key="empty" className="book-page rounded-xl bg-white book-shadow overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <EmptyPage />
          </motion.div>
        )
      ]
    }
    return pages.map((p) => (
      <motion.div key={p.id} className="book-page rounded-xl bg-white book-shadow overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <PageContent page={p} onSelect={() => onSelect?.(p)} />
      </motion.div>
    ))
  }, [pages, onSelect])

  function next() { bookRef.current?.pageFlip()?.flipNext() }
  function prev() { bookRef.current?.pageFlip()?.flipPrev() }

  return (
    <div className="book-perspective mx-auto max-w-5xl select-none">
      <div className="relative min-h-[560px] flex items-center justify-center">
        <div className="flex items-center justify-center">
          <HTMLFlipBook
            width={520}
            height={520}
            className="mx-auto"
            showPageCorners
            maxShadowOpacity={0.35}
            usePortrait
            onFlip={(e) => setCurrent(e.data)}
            ref={bookRef}
          >
          <motion.div className="book-page rounded-xl bg-[#fff7ea] book-shadow overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CoverPage title={coverTitle} />
          </motion.div>
          {pageElements}
          </HTMLFlipBook>
        </div>
        <div className="absolute left-0 right-0 bottom-4 z-10">
          <Controls onPrev={prev} onNext={next} canPrev={current > 0} canNext={current < pages.length} />
        </div>
        {onClose && (
          <button onClick={onClose} className="absolute -top-10 right-0 px-3 py-1 rounded bg-neutral-800 text-white">Close Book</button>
        )}
        <div className="absolute bottom-2 left-0 right-0 text-center text-sm text-neutral-600">Recipe {Math.min(current, pages.length)} of {pages.length}</div>
      </div>
    </div>
  )
}

function Controls({ onPrev, onNext, canPrev, canNext }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button disabled={!canPrev} onClick={onPrev} className="px-4 py-2 rounded bg-neutral-200 disabled:opacity-50">Prev</button>
      <button disabled={!canNext} onClick={onNext} className="px-4 py-2 rounded bg-brand-600 text-white disabled:opacity-50">Next</button>
    </div>
  )
}

function PageContent({ page, onSelect }) {
  return (
    <div className="h-full p-6 flex flex-col">
      <div className="flex-1 grid grid-cols-2 gap-4">
        <img src={page.image} alt={page.title} className="w-full h-full object-cover rounded" />
        <div className="space-y-2">
          <h2 className="text-xl font-bold">{page.title}</h2>
          {page.cuisine && <span className="text-sm text-neutral-500">{page.cuisine}</span>}
          <div className="flex items-center gap-2">
            {page.isFavorite && <span className="inline-block px-2 py-0.5 text-xs rounded bg-orange-100 text-orange-700">Favorite</span>}
            {page.isMine && <span className="inline-block px-2 py-0.5 text-xs rounded bg-emerald-100 text-emerald-700">My Recipe</span>}
          </div>
          <p className="text-sm text-neutral-700 line-clamp-6">{page.summary || 'Tap to open'}</p>
          <div className="mt-3">
            <button onClick={(e)=>{ e.stopPropagation(); onSelect?.(); }} className="px-3 py-2 rounded bg-brand-600 text-white">Open Recipe</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyPage() {
  return <div className="h-full rounded-xl bg-[#fffdfa] grid place-items-center text-neutral-400">Blank</div>
}

function CoverPage({ title }) {
  return (
    <div className="h-full rounded-xl bg-[#fff7ea] grid place-items-center">
      <div className="text-center">
        <div className="text-5xl text-brand-500">🍳</div>
        <div className="mt-2 text-xl font-semibold text-brand-700">{title}</div>
      </div>
    </div>
  )
}