import { useEffect, useState } from 'react'

export type GalleryMode = 'dome' | 'carousel' | 'grid'

const DESKTOP = '(pointer: fine) and (min-width: 900px)'
const REDUCED = '(prefers-reduced-motion: reduce)'

const current = (): GalleryMode => {
  if (!window.matchMedia(DESKTOP).matches) return 'carousel'
  return window.matchMedia(REDUCED).matches ? 'grid' : 'dome'
}

/** Dome 3D con mouse en pantallas grandes; carrusel en touch; grilla si se pide menos movimiento. */
export function useGalleryMode() {
  const [mode, setMode] = useState(current)
  useEffect(() => {
    const queries = [DESKTOP, REDUCED].map((q) => window.matchMedia(q))
    const onChange = () => setMode(current())
    queries.forEach((q) => q.addEventListener('change', onChange))
    return () => queries.forEach((q) => q.removeEventListener('change', onChange))
  }, [])
  return mode
}
