import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform, type MotionValue } from 'motion/react'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { ISO, ISO_BLADES, ISO_TAIL } from './lensPieces'

/*
 * Anillo de foco de un lente de cine, interactivo.
 * - Al entrar en pantalla, el anillo va de infinito a 3 m y la Q se enfoca.
 * - Se puede girar: con el mouse, girando alrededor del centro; en touch,
 *   deslizando de costado (el scroll vertical sigue libre).
 * - El desenfoque de la Q depende de cuánto se aleja el anillo de 3 m.
 * - Al soltarlo sigue por inercia y después hace "autofoco" a 3 m.
 */
const C = 200
const RING = 184
const MARKS = [
  { label: '∞', angle: -64 },
  { label: '10', angle: -46 },
  { label: '5', angle: -29 },
  { label: '3', angle: -12 },
  { label: '2', angle: 5 },
  { label: '1.5', angle: 22 },
  { label: '1', angle: 40 },
  { label: '.7', angle: 60 },
  { label: 'm', angle: 76 },
]
const TICKS = Array.from({ length: 120 }, (_, i) => i * 3)
const FOCUSED = 12 // la marca de 3 m queda bajo el índice
const START = 64 // arranca en infinito: el sujeto está fuera de foco
const pull = [0.77, 0, 0.175, 1] as const

/** Grados que separan al anillo de la posición en foco más cercana. */
const offFocus = (r: number) => Math.abs((((r - FOCUSED) % 360) + 540) % 360 - 180)
const nearestFocus = (r: number) => FOCUSED + Math.round((r - FOCUSED) / 360) * 360

/** Cuánto se "desarma" el isotipo (0 = armado, 1 = abierto del todo). */
const openness = (r: number) => {
  const t = Math.min(1, Math.max(0, (offFocus(r) - 3) / 50))
  return t * t * (3 - 2 * t)
}

// Recorridos máximos de cada pieza, en % del lienzo del isotipo
const BLADE_TRAVEL = 8
const BLADE_TWIST = 14 // grados: el iris gira levemente al abrirse
const RING_GROWTH = 0.07
const TAIL_TRAVEL = 6
const ASPECT = ISO.width / ISO.height // traduce % de ancho a % de alto
const ORIGIN = `${ISO.originX}% ${ISO.originY}%`
// tamaño del disco interior (donde aparece la luz), en % del lienzo
const IRIS_W = 76.8
const IRIS_H = IRIS_W * ASPECT

function Blade({ src, dx, dy, open }: { src: string; dx: number; dy: number; open: MotionValue<number> }) {
  const transform = useTransform(
    open,
    (k) => `rotate(${(k * BLADE_TWIST).toFixed(2)}deg) translate(${(dx * k * BLADE_TRAVEL).toFixed(3)}%, ${(dy * k * BLADE_TRAVEL * ASPECT).toFixed(3)}%)`,
  )
  return <motion.img src={src} alt="" draggable={false} className="absolute inset-0 size-full" style={{ transform, transformOrigin: ORIGIN }} />
}

type Drag = { id: number; mode: 'angle' | 'x'; last: number; lastT: number; vel: number }

export default function Lens() {
  const reduce = useReducedMotion()
  const root = useRef<HTMLDivElement>(null)
  const inView = useInView(root, { once: true, amount: 0.4 })
  const [touched, setTouched] = useState(false)

  const rot = useMotionValue(reduce ? FOCUSED : START)
  const ring = useTransform(rot, (r) => `rotate(${r}deg)`)
  // desenfoque suave: el protagonista ahora es el diafragma que se abre
  const qFilter = useTransform(rot, (r) => `blur(${Math.min(3, Math.max(0, offFocus(r) - 2) / 14).toFixed(2)}px)`)
  // "focus breathing": la imagen cambia apenas de tamaño al mover el foco
  const qScale = useTransform(rot, (r) => `scale(${(1 + Math.min(offFocus(r), 45) * 0.0012).toFixed(4)})`)
  const open = useTransform(rot, openness)
  const ringScale = useTransform(open, (k) => `scale(${(1 + k * RING_GROWTH).toFixed(4)})`)
  const tailShift = useTransform(
    open,
    (k) => `translate(${(ISO_TAIL.dx * k * TAIL_TRAVEL).toFixed(3)}%, ${(ISO_TAIL.dy * k * TAIL_TRAVEL * ASPECT).toFixed(3)}%)`,
  )

  const drag = useRef<Drag | null>(null)
  const stopAnim = useRef<(() => void) | null>(null)
  const refocusTimer = useRef<number | undefined>(undefined)

  const halt = () => {
    stopAnim.current?.()
    stopAnim.current = null
    window.clearTimeout(refocusTimer.current)
  }

  const autofocus = (delay: number) => {
    refocusTimer.current = window.setTimeout(() => {
      const target = nearestFocus(rot.get())
      if (reduce) return rot.set(target)
      const a = animate(rot, target, { duration: 1.1, ease: pull })
      stopAnim.current = () => a.stop()
    }, delay)
  }

  const fling = (v0: number) => {
    let v = Math.max(-900, Math.min(900, v0))
    let last = performance.now()
    let raf = 0
    const step = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      rot.set(rot.get() + v * dt)
      v *= Math.pow(0.05, dt)
      if (Math.abs(v) > 6) raf = requestAnimationFrame(step)
      else autofocus(900)
    }
    raf = requestAnimationFrame(step)
    stopAnim.current = () => cancelAnimationFrame(raf)
  }

  // entrada: tirar foco de infinito a 3 m
  useEffect(() => {
    if (!inView || reduce) return
    const a = animate(rot, FOCUSED, { duration: 1.9, ease: pull, delay: 0.3 })
    stopAnim.current = () => a.stop()
    return () => a.stop()
  }, [inView, reduce, rot])

  useEffect(() => () => window.clearTimeout(refocusTimer.current), [])

  const angleOf = (e: PointerEvent) => {
    const b = root.current!.getBoundingClientRect()
    return (Math.atan2(e.clientY - (b.top + b.height / 2), e.clientX - (b.left + b.width / 2)) * 180) / Math.PI
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (drag.current || (e.pointerType === 'mouse' && e.button !== 0)) return
    halt()
    const mode = e.pointerType === 'mouse' ? 'angle' : 'x'
    drag.current = { id: e.pointerId, mode, last: mode === 'angle' ? angleOf(e) : e.clientX, lastT: performance.now(), vel: 0 }
    e.currentTarget.setPointerCapture(e.pointerId)
    setTouched(true)
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d || e.pointerId !== d.id) return
    let delta: number
    if (d.mode === 'angle') {
      const a = angleOf(e)
      delta = ((a - d.last + 540) % 360) - 180
      d.last = a
    } else {
      delta = (e.clientX - d.last) * 0.45
      d.last = e.clientX
    }
    rot.set(rot.get() + delta)
    const now = performance.now()
    d.vel = 0.75 * d.vel + 0.25 * ((delta / Math.max(1, now - d.lastT)) * 1000)
    d.lastT = now
  }

  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d || e.pointerId !== d.id) return
    drag.current = null
    const v = performance.now() - d.lastT > 80 ? 0 : d.vel // si frenó antes de soltar, no hay inercia
    if (reduce || Math.abs(v) < 25) autofocus(700)
    else fling(v)
  }

  // pista sutil al pasar el mouse: el anillo se mueve apenas y vuelve
  const onPointerEnter = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || touched || reduce || drag.current || !inView) return
    halt()
    const r = nearestFocus(rot.get())
    const a = animate(rot, [rot.get(), r + 7, r], { duration: 1, ease: [0.23, 1, 0.32, 1] })
    stopAnim.current = () => a.stop()
  }

  return (
    <div aria-hidden className="select-none">
      <div
        ref={root}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onPointerEnter={onPointerEnter}
        className="relative mx-auto aspect-square w-full max-w-[34rem] cursor-grab touch-pan-y active:cursor-grabbing"
      >
        <div className="lens-glow absolute inset-[6%] rounded-full" />

        {/* barril fijo + índice de foco */}
        <svg viewBox="0 0 400 400" className="absolute inset-0 size-full">
          <circle cx={C} cy={C} r={197} fill="none" stroke="rgb(238 235 228 / 0.08)" />
          <circle cx={C} cy={C} r={152} fill="none" stroke="rgb(238 235 228 / 0.1)" />
          <path d="M195 2h10l-5 9z" fill="var(--color-accent)" />
        </svg>

        <motion.div className="absolute inset-0" style={{ transform: ring }}>
          <svg viewBox="0 0 400 400" className="size-full">
            {TICKS.map((a) => {
              const major = a % 15 === 0
              return (
                <line
                  key={a}
                  x1={C}
                  y1={C - RING}
                  x2={C}
                  y2={C - RING + (major ? 11 : 5)}
                  stroke={major ? 'rgb(238 235 228 / 0.45)' : 'rgb(238 235 228 / 0.18)'}
                  strokeWidth={major ? 1.1 : 0.8}
                  transform={`rotate(${a} ${C} ${C})`}
                />
              )
            })}
            {MARKS.map((m) => (
              <text
                key={m.label}
                x={C}
                y={C - RING + 27}
                textAnchor="middle"
                transform={`rotate(${m.angle} ${C} ${C})`}
                fontSize={m.label === 'm' ? 9 : 11}
                fill={m.label === 'm' ? 'rgb(140 148 166 / 0.8)' : 'rgb(238 235 228 / 0.7)'}
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {m.label}
              </text>
            ))}
          </svg>
        </motion.div>

        {/* isotipo en piezas: base, luz del iris, aletas, aro y colita */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <motion.div
            className="relative mt-[6.6%] w-[46%]"
            style={{ aspectRatio: `${ISO.width} / ${ISO.height}`, filter: qFilter, transform: qScale }}
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 1 : 0 }}
            transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
          >
            <img src="/brand/iso/base.webp" alt="" draggable={false} className="absolute inset-0 size-full" />
            <motion.div
              className="absolute rounded-full bg-[radial-gradient(closest-side,rgb(125_184_255/0.9),rgb(40_128_251/0.45)_45%,transparent)]"
              style={{
                left: `${ISO.originX - IRIS_W / 2}%`,
                top: `${ISO.originY - IRIS_H / 2}%`,
                width: `${IRIS_W}%`,
                height: `${IRIS_H}%`,
                opacity: open,
              }}
            />
            {ISO_BLADES.map((b) => (
              <Blade key={b.src} src={b.src} dx={b.dx} dy={b.dy} open={open} />
            ))}
            <motion.img
              src="/brand/iso/ring.webp"
              alt=""
              draggable={false}
              className="absolute inset-0 size-full"
              style={{ transform: ringScale, transformOrigin: ORIGIN }}
            />
            <motion.img
              src={ISO_TAIL.src}
              alt=""
              draggable={false}
              className="absolute inset-0 size-full"
              style={{ transform: tailShift }}
            />
          </motion.div>
        </div>
      </div>

      <p
        className={`mt-5 text-center text-xs text-mute transition-opacity duration-700 ${touched ? 'opacity-0' : 'opacity-100'}`}
      >
        <span className="hidden pointer-fine:inline">Girá el anillo para hacer foco</span>
        <span className="pointer-fine:hidden">Deslizá el anillo para hacer foco</span>
      </p>
    </div>
  )
}
