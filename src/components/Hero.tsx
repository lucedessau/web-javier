import { ArrowDown } from '@phosphor-icons/react'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import Lens from './Lens'
import WhatsAppButton from './WhatsAppButton'

const proof = [
  { value: '3', label: 'premios Martín Fierro' },
  { value: '40+', label: 'años en medios' },
  { value: '12', label: 'países recorridos' },
]

export default function Hero() {
  const reduce = useReducedMotion()

  // Cada bloque entra "haciendo foco": de desenfocado a nítido.
  const item: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 22, filter: 'blur(10px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 1.05, ease: [0.23, 1, 0.32, 1] },
    },
  }

  return (
    <section className="relative isolate overflow-hidden px-5 pb-16 pt-28 sm:px-8 md:flex md:min-h-[100dvh] md:items-center md:pb-20 md:pt-32">
      {/* resplandor ambiente detrás del lente */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[20%] top-[-10%] -z-10 h-[70vh] w-[70vw] rounded-full bg-[radial-gradient(closest-side,rgb(40_128_251/0.12),transparent)]"
      />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-[1.15fr_0.85fr] md:gap-10">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.09, delayChildren: 0.25 }}
        >
          <h1 className="font-display text-[clamp(2.7rem,6.4vw,5.9rem)] font-[340] leading-[0.98] tracking-[-0.025em] text-balance [font-variation-settings:'opsz'_144]">
            <motion.span variants={item} className="block">
              Las ideas necesitan
            </motion.span>
            <motion.span variants={item} className="block">
              una imagen{' '}
              <em className="font-[300] text-silver italic">a la altura.</em>
            </motion.span>
          </h1>

          <motion.p variants={item} className="mt-7 max-w-[46ch] text-[1.05rem] leading-relaxed text-mute sm:text-lg">
            Producción y dirección audiovisual para televisión, marcas, empresas e instituciones, con la mirada de más
            de 40 años detrás de cámara.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-5">
            <WhatsAppButton />
            <a
              href="#trabajos"
              className="group inline-flex items-center gap-2 text-sm text-cream/75 transition-colors duration-200 hover:text-cream"
            >
              Ver trabajos
              <ArrowDown
                size={16}
                weight="light"
                className="transition-transform duration-300 ease-out-strong group-hover:translate-y-0.5"
              />
            </a>
          </motion.div>

          <motion.dl
            variants={item}
            className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-7"
          >
            {proof.map((p) => (
              <div key={p.label} className="flex flex-col-reverse justify-end">
                <dt className="mt-1.5 font-mono text-[0.62rem] uppercase leading-snug tracking-[0.16em] text-mute">
                  {p.label}
                </dt>
                <dd className="font-display text-3xl font-[350] tabular-nums tracking-tight text-cream sm:text-[2.1rem]">
                  {p.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <div className="mx-auto w-[min(82vw,26rem)] md:w-full">
          <Lens />
        </div>
      </div>
    </section>
  )
}
