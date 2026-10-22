import { CaretLeft, CaretRight, X } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { useEffect, useRef, type PointerEvent } from 'react'
import { WORKS, workSrc, workSrcSet } from '../../data/works'

type Props = { index: number; onClose: () => void; onStep: (delta: number) => void }

const navBtn =
  'grid size-11 place-items-center rounded-full border border-white/15 bg-ink-2/80 text-cream transition-[border-color,transform] duration-200 hover:border-white/35 active:scale-[0.96]'

export default function Lightbox({ index, onClose, onStep }: Props) {
  const w = WORKS[index]
  const closeBtn = useRef<HTMLButtonElement>(null)
  const actions = useRef({ onClose, onStep })
  useEffect(() => {
    actions.current = { onClose, onStep }
  })
  const swipeX = useRef<number | null>(null)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    closeBtn.current?.focus()
    const root = document.documentElement
    const overflow = root.style.overflow
    root.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') actions.current.onClose()
      else if (e.key === 'ArrowRight') actions.current.onStep(1)
      else if (e.key === 'ArrowLeft') actions.current.onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      root.style.overflow = overflow
      previous?.focus?.()
    }
  }, [])

  // deslizar con el dedo para pasar de foto
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') swipeX.current = e.clientX
  }
  const onPointerUp = (e: PointerEvent) => {
    if (swipeX.current === null) return
    const dx = e.clientX - swipeX.current
    swipeX.current = null
    if (Math.abs(dx) > 50) onStep(dx < 0 ? 1 : -1)
  }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${w.title}, ${w.detail}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 px-4 py-20 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      onClick={onClose}
    >
      <button ref={closeBtn} type="button" aria-label="Cerrar" onClick={onClose} className={`${navBtn} absolute right-4 top-4`}>
        <X size={20} weight="light" />
      </button>

      <motion.figure
        key={index}
        className="flex max-h-full max-w-6xl flex-col"
        initial={{ opacity: 0, transform: 'scale(0.985)' }}
        animate={{ opacity: 1, transform: 'scale(1)' }}
        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <img
          src={workSrc(w.slug, 1600)}
          srcSet={workSrcSet(w.slug)}
          sizes="(min-width: 1200px) 1150px, 92vw"
          width={w.w}
          height={w.h}
          alt={`${w.title}: ${w.detail}`}
          draggable={false}
          className="max-h-[72vh] w-auto max-w-full rounded-xl object-contain"
        />
        <figcaption className="mt-4 flex items-baseline justify-between gap-6">
          <span>
            <span className="font-display text-lg text-cream">{w.title}</span>
            <span className="ml-3 text-sm text-mute">{w.detail}</span>
          </span>
          <span className="font-mono text-xs tabular-nums text-mute">
            {index + 1} / {WORKS.length}
          </span>
        </figcaption>
      </motion.figure>

      <div className="absolute inset-x-4 bottom-4 flex justify-center gap-3 md:inset-x-6 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:justify-between">
        <button
          type="button"
          aria-label="Foto anterior"
          onClick={(e) => (e.stopPropagation(), onStep(-1))}
          className={navBtn}
        >
          <CaretLeft size={20} weight="light" />
        </button>
        <button
          type="button"
          aria-label="Foto siguiente"
          onClick={(e) => (e.stopPropagation(), onStep(1))}
          className={navBtn}
        >
          <CaretRight size={20} weight="light" />
        </button>
      </div>
    </motion.div>
  )
}
