// Selección del archivo de fotos de Javier (Drive "FOTOS PARA WEB JAVIER").
// Cada foto existe en /works/{slug}-800.webp y /works/{slug}-1600.webp.
export type Work = { slug: string; title: string; detail: string; w: number; h: number }

export const WORKS: Work[] = [
  { slug: 'aerea-helicoptero', title: 'Tomas aéreas', detail: 'Cámara desde helicóptero', w: 1600, h: 1202 },
  { slug: 'grua', title: 'Cámara en grúa', detail: 'Cobertura de evento', w: 1600, h: 1063 },
  { slug: 'copa-america', title: 'Copa América', detail: 'Transmisión internacional', w: 1600, h: 1064 },
  { slug: 'movil-tv', title: 'Móvil de televisión', detail: 'Dirección de transmisión', w: 1600, h: 1065 },
  { slug: 'estadio-hd', title: 'Transmisión deportiva', detail: 'Cámara HD en estadio', w: 1600, h: 1200 },
  { slug: 'toronto-2015', title: 'Juegos Panamericanos', detail: 'Toronto 2015', w: 1600, h: 1200 },
  { slug: 'sala-control', title: 'Sala de control', detail: 'Transmisión en vivo', w: 1600, h: 1200 },
  { slug: 'estudio-tv', title: 'Estudio de televisión', detail: 'Programa en piso', w: 1600, h: 1067 },
  { slug: 'rodaje-bodega', title: 'Rodaje en bodega', detail: 'Producción audiovisual', w: 1600, h: 1200 },
  { slug: 'evento-noche', title: 'Evento en vivo', detail: 'Cobertura nocturna', w: 1600, h: 900 },
  { slug: 'cine-red', title: 'Cine digital', detail: 'Cámara RED', w: 1600, h: 827 },
  { slug: 'cbc-toronto', title: 'CBC', detail: 'Toronto', w: 1600, h: 1200 },
  { slug: 'rodaje-exterior', title: 'Rodaje en exteriores', detail: 'Producción para televisión', w: 1600, h: 1200 },
  { slug: 'helicoptero-san-juan', title: 'Tomas aéreas', detail: 'San Juan', w: 1600, h: 900 },
  { slug: 'grua-quadrofilms', title: 'Grúa QuadroFilms', detail: 'Equipamiento propio', w: 1600, h: 900 },
  { slug: 'control-tecnico', title: 'Control técnico', detail: 'Transmisión internacional', w: 1600, h: 1200 },
]

export const workSrc = (slug: string, size: 800 | 1600) => `/works/${slug}-${size}.webp`
export const workSrcSet = (slug: string) => `${workSrc(slug, 800)} 800w, ${workSrc(slug, 1600)} 1600w`
