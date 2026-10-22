import { MotionConfig } from 'motion/react'
import About from './components/About'
import Closing from './components/Closing'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import Footer from './components/Footer'
import Grain from './components/Grain'
import Hero from './components/Hero'
import Nav from './components/Nav'
import Services from './components/Services'
import Works from './components/Works'

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
        <Services />
        <Works />
        <About />
        <Closing />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <Grain />
    </MotionConfig>
  )
}
