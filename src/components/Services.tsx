import Reveal from './Reveal'

const services = [
  {
    title: 'Producción y dirección audiovisual',
    text: 'De la idea al rodaje y a la edición final, con una misma mirada a cargo de todo el proceso.',
  },
  {
    title: 'Spots publicitarios y contenido digital',
    text: 'Piezas para televisión y redes que hacen que tu marca se vea y se recuerde.',
  },
  {
    title: 'Televisión y transmisiones en vivo por streaming',
    text: 'Programas y eventos en vivo, con calidad de televisión, en la pantalla que elijas.',
  },
  {
    title: 'Hub de producción audiovisual de cobertura nacional',
    text: 'Equipos, móviles y técnicos para producir en cualquier punto del país.',
  },
  {
    title: 'Montaje de escenarios y puesta escénica',
    text: 'Escenario, luces y puesta en escena para que el evento se vea a la altura.',
  },
  {
    title: 'Logística audiovisual para grandes eventos y pantallas LED',
    text: 'Pantallas LED, sonido y cobertura técnica para congresos, shows y estadios.',
  },
]

export default function Services() {
  return (
    <section id="servicios" className="scroll-mt-24 py-28 md:py-40">
      <div className="page grid gap-14 md:grid-cols-[0.95fr_1.05fr] md:gap-20">
        <Reveal className="md:sticky md:top-32 md:self-start">
          <h2 className="text-section">
            Transformamos ideas en producciones que comunican, conectan y{' '}
            <em className="font-[300] text-silver italic">generan impacto.</em>
          </h2>
          <p className="text-lede mt-7 max-w-[42ch]">
            Integramos creatividad, dirección y tecnología para desarrollar proyectos para televisión, marcas, empresas e
            instituciones.
          </p>
        </Reveal>

        <ul className="border-t border-white/10">
          {services.map((s, i) => (
            <li key={s.title} className="border-b border-white/10">
              <Reveal delay={i * 0.05} className="py-7 md:py-8">
                <h3 className="font-display text-[1.45rem] font-[380] leading-snug tracking-[-0.01em] text-cream text-balance sm:text-[1.6rem]">
                  {s.title}
                </h3>
                <p className="mt-2.5 max-w-[48ch] leading-relaxed text-mute">{s.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
