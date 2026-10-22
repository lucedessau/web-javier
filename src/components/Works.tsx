import { AnimatePresence } from 'motion/react'
import { useCallback, useState } from 'react'
import { WORKS, workSrc, workSrcSet, type Work } from '../data/works'
import Dome from './gallery/Dome'
import Lightbox from './gallery/Lightbox'
import { useGalleryMode } from './gallery/useGalleryMode'
import Reveal from './Reveal'

function Thumb({ work, onOpen, sizes }: { work: Work; onOpen: () => void; sizes: string }) {
  return (
    <button type="button" onClick={onOpen} className="group block w-full text-left">
      <span className="block aspect-[4/3] overflow-hidden rounded-2xl bg-ink-2">
        <img
          src={workSrc(work.slug, 800)}
          srcSet={workSrcSet(work.slug)}
          sizes={sizes}
          width={800}
          height={600}
          loading="lazy"
          decoding="async"
          alt={`${work.title}: ${work.detail}`}
          className="size-full object-cover transition-transform duration-500 ease-out-strong group-hover:scale-[1.03]"
        />
      </span>
      <span className="mt-3 block font-display text-lg leading-tight text-cream">{work.title}</span>
      <span className="mt-0.5 block text-sm text-mute">{work.detail}</span>
    </button>
  )
}

export default function Works() {
  const mode = useGalleryMode()
  const [open, setOpen] = useState<number | null>(null)
  const close = useCallback(() => setOpen(null), [])
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + WORKS.length) % WORKS.length)), [])

  return (
    <section id="trabajos" className="scroll-mt-24 py-28 md:py-40">
      <div className="page">
        <Reveal className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <h2 className="text-section">Cuatro décadas detrás de cámara.</h2>
          <p className="text-lede max-w-[40ch] md:justify-self-end">
            Transmisiones internacionales, deportes, eventos, televisión y rodajes. Una selección del archivo de Javier.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-14 md:mt-16">
          {mode === 'dome' && <Dome onOpen={setOpen} />}

          {mode === 'grid' && (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
              {WORKS.map((w, i) => (
                <li key={w.slug}>
                  <Thumb work={w} onOpen={() => setOpen(i)} sizes="(min-width: 768px) 25vw, 50vw" />
                </li>
              ))}
            </ul>
          )}

          {mode === 'carousel' && (
            <>
              <div className="-mx-5 snap-x snap-mandatory scroll-px-5 overflow-x-auto overscroll-x-contain [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 [&::-webkit-scrollbar]:hidden">
                <ul className="flex w-max gap-3 px-5 sm:px-8">
                  {WORKS.map((w, i) => (
                    <li key={w.slug} className="w-[80vw] max-w-[26rem] shrink-0 snap-start">
                      <Thumb work={w} onOpen={() => setOpen(i)} sizes="80vw" />
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-6 text-xs text-mute">Deslizá para ver más · tocá una foto para verla en grande</p>
            </>
          )}
        </Reveal>
      </div>

      <AnimatePresence>{open !== null && <Lightbox index={open} onClose={close} onStep={step} />}</AnimatePresence>
    </section>
  )
}
