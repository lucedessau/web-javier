import { motion } from 'motion/react'
import type { ReactNode } from 'react'

/** Aparición suave al entrar en pantalla (una sola vez). */
export default function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
