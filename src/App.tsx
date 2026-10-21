import { MotionConfig } from 'motion/react'
import Grain from './components/Grain'
import Hero from './components/Hero'
import Nav from './components/Nav'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-cream focus:px-4 focus:py-2 focus:text-ink"
      >
        Saltar al contenido
      </a>
      <Nav />
      <main id="contenido">
        <Hero />
      </main>
      <Grain />
    </MotionConfig>
  )
}
