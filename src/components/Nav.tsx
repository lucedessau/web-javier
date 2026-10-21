import { motion } from 'motion/react'
import WhatsAppButton from './WhatsAppButton'

const links = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#trabajos', label: 'Trabajos' },
  { href: '#javier', label: 'Javier' },
]

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-3 z-40 flex justify-center px-3 sm:top-5 sm:px-5">
      <motion.nav
        aria-label="Principal"
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
        className="flex w-full max-w-5xl items-center justify-between gap-6 rounded-full border border-white/10 bg-ink/55 py-1.5 pl-4 pr-1.5 backdrop-blur-xl sm:pl-5"
      >
        <a href="#contenido" className="flex items-center gap-3" aria-label="QuadroFilms, inicio">
          <img src="/brand/isotipo.webp" alt="" width={512} height={585} className="h-7 w-auto" />
          <img src="/brand/wordmark-title.webp" alt="QuadroFilms" width={1000} height={102} className="h-[0.7rem] w-auto sm:h-3" />
        </a>

        <ul className="hidden items-center gap-8 text-sm text-cream/65 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition-colors duration-200 hover:text-cream">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <WhatsAppButton size="sm" label="WhatsApp" />
      </motion.nav>
    </header>
  )
}
