import { site } from '../config/site'

const linkClass = 'text-cream/80 transition-colors duration-200 hover:text-cream'
const year = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="border-t border-white/10 pb-10 pt-16">
      <div className="page">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <img src="/brand/isotipo.webp" alt="" width={512} height={585} loading="lazy" className="h-12 w-auto" />
              <img
                src="/brand/wordmark-title.webp"
                alt="QuadroFilms"
                width={1000}
                height={102}
                loading="lazy"
                className="h-4 w-auto sm:h-[1.15rem]"
              />
            </div>
            <p className="mt-6 font-display text-xl font-[340] italic text-silver">Tu idea, nuestra mirada.</p>
          </div>

          <div>
            <h2 className="text-sm text-mute">Contacto</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  WhatsApp {site.whatsappDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className={linkClass}>
                  {site.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm text-mute">Redes</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href={site.instagram} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Instagram
                </a>
              </li>
              <li>
                <a href={site.facebook} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-mute sm:flex-row sm:justify-between">
          <p>© {year} QuadroFilms · Javier Vrana</p>
          <p>
            Sitio por{' '}
            <a href="https://genlab.com.ar" target="_blank" rel="noopener noreferrer" className="hover:text-cream">
              GenLab
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
