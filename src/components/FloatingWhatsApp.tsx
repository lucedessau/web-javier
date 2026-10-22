import { WhatsappLogo } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { site } from '../config/site'

/*
 * Acceso a WhatsApp siempre a un toque.
 * Aparece cuando el hero (que ya tiene su botón) sale de pantalla
 * y se esconde en el cierre, donde está el botón grande: nunca hay dos a la vista.
 */
export default function FloatingWhatsApp() {
  const [hidden, setHidden] = useState({ hero: true, contact: false })

  useEffect(() => {
    const targets = [
      ['hero', document.getElementById('inicio')],
      ['contact', document.getElementById('contacto')],
    ] as const
    // el hero cuenta como "a la vista" mientras ocupe una parte real de la pantalla, no una franja
    const io = new IntersectionObserver(
      (entries) => {
        setHidden((prev) => {
          const next = { ...prev }
          for (const e of entries) {
            const key = targets.find(([, el]) => el === e.target)?.[0]
            if (key) next[key] = key === 'hero' ? e.intersectionRatio > 0.2 : e.isIntersecting
          }
          return next
        })
      },
      { threshold: [0, 0.2] },
    )
    targets.forEach(([, el]) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  const show = !hidden.hero && !hidden.contact

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={site.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Escribile a ${site.person} por WhatsApp`}
          initial={{ opacity: 0, scale: 0.85, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 12 }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40 grid size-14 place-items-center rounded-full bg-accent-strong text-white shadow-[0_10px_30px_-8px_rgb(0_0_0/0.7)] transition-colors duration-200 hover:bg-accent active:scale-[0.96] sm:right-8 sm:bottom-8"
        >
          <WhatsappLogo size={28} weight="regular" />
        </motion.a>
      )}
    </AnimatePresence>
  )
}
