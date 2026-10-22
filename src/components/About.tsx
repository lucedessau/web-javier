import Reveal from './Reveal'

const record = [
  {
    label: 'Dirección en',
    value: 'Canal 7 Mendoza (Grupo América), Canal 9 Mendoza, Canal 12 (Medios Andinos) y Señal U (UNCuyo)',
  },
  { label: 'Coberturas', value: 'Dos Copas América, los Juegos Panamericanos de Toronto y Cosquín Rock' },
  { label: 'Reconocimientos', value: 'Cinco nominaciones y tres premios Martín Fierro' },
]

export default function About() {
  return (
    <section id="javier" className="scroll-mt-24 py-28 md:py-40">
      <div className="page grid items-center gap-16 md:grid-cols-[0.85fr_1.15fr] md:gap-20">
        <Reveal className="relative mx-auto w-full max-w-md md:max-w-none">
          <img
            src="/javier/javier-vrana-1000.webp"
            srcSet="/javier/javier-vrana-600.webp 600w, /javier/javier-vrana-1000.webp 1000w"
            sizes="(min-width: 768px) 40vw, 90vw"
            width={1000}
            height={1250}
            loading="lazy"
            decoding="async"
            alt="Javier Vrana en estudio, junto a una cámara y una luz de cine"
            className="aspect-[4/5] w-full rounded-[1.75rem] object-cover"
          />
          <figure className="mt-4 w-[46%] md:absolute md:-bottom-10 md:-right-10 md:mt-0 md:w-[44%]">
            <img
              src="/javier/martin-fierro-700.webp"
              width={700}
              height={875}
              loading="lazy"
              decoding="async"
              alt="Javier Vrana con sus tres premios Martín Fierro"
              className="aspect-[4/5] w-full rounded-2xl border-4 border-ink object-cover"
            />
            <figcaption className="mt-2 text-xs text-mute">Tres premios Martín Fierro</figcaption>
          </figure>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-sm text-mute">Director de Fotografía · Productor · Realizador audiovisual</p>
          <h2 className="text-section mt-3">Javier Vrana</h2>

          <div className="mt-8 max-w-[56ch] space-y-5 text-[1.05rem] leading-relaxed text-cream/80">
            <p>
              Desde chico jugaba con cámaras de cartón y estudios de papel en Medrano, un pueblo de viñedos de Mendoza.
              De mi padre, José, fotógrafo, recibí los primeros conocimientos; de mi madre, Esther, el empuje para salir
              adelante.
            </p>
            <p>
              Con espíritu aventurero recorrí medio mundo con una cámara junto a un gran maestro, Atilio Spinello. Hoy,
              con cuatro décadas como director de televisión y editor, la experiencia y la pasión siguen siendo el motor
              de cada proyecto.
            </p>
          </div>

          <blockquote className="mt-10 border-l border-accent pl-5 font-display text-2xl font-[340] italic leading-snug text-silver sm:text-[1.7rem]">
            La vida es una gran película. Elegí con sabiduría tu personaje.
          </blockquote>

          <dl className="mt-12 divide-y divide-white/10 border-y border-white/10">
            {record.map((r) => (
              <div key={r.label} className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <dt className="text-sm text-mute">{r.label}</dt>
                <dd className="text-cream/90">{r.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
