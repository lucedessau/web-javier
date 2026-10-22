import { site } from '../config/site'
import Reveal from './Reveal'
import WhatsAppButton from './WhatsAppButton'

export default function Closing() {
  return (
    <section id="contacto" className="scroll-mt-24 border-t border-white/10 py-28 md:py-44">
      <div className="page">
        <Reveal>
          <p className="max-w-[34ch] font-display text-xl font-[340] italic leading-snug text-silver sm:text-2xl">
            Cada proyecto tiene un objetivo. Nuestra tarea es encontrar la mejor manera de comunicarlo, combinando
            creatividad, experiencia y tecnología.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-16 md:mt-24">
          <h2 className="font-display text-[clamp(2.6rem,7vw,6rem)] font-[330] leading-[0.98] tracking-[-0.025em] text-balance [font-variation-settings:'opsz'_144]">
            ¿Tenés un proyecto en mente?
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
            <p className="text-lede max-w-[44ch]">
              Conversemos sobre tu idea y encontremos juntos la solución audiovisual adecuada.
            </p>
            <div className="flex flex-col items-start gap-4 md:items-end">
              <WhatsAppButton />
              <a
                href={`mailto:${site.email}`}
                className="text-sm text-cream/70 underline decoration-white/20 underline-offset-4 transition-colors duration-200 hover:text-cream hover:decoration-white/50"
              >
                o escribí a {site.email}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
