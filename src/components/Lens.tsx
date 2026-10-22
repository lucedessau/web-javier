import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform, type MotionValue } from 'motion/react'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { ISO, ISO_BLADES, ISO_BOX, ISO_IRIS, ISO_TAIL, ISO_UNIT } from './lensPieces'

/*
 * Anillo de foco de un lente de cine, interactivo.
 * - Arranca quieto: el isotipo armado y en foco, con el anillo en 3 m.
 * - Se gira siguiendo el ángulo del puntero alrededor del centro (mouse o dedo), en todo el aro.
 * - Al alejarse de 3 m pasa en dos tiempos: primero el isotipo se expande y se desarma
 *   como un diafragma que se abre; recién después, si se sigue girando, se desenfoca.
 * - Al soltarlo sigue por inercia y después hace "autofoco" a 3 m (se enfoca y se vuelve a armar).
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
const pull = [0.77, 0, 0.175, 1] as const

/** Grados que separan al anillo de la posición en foco más cercana. */
const offFocus = (r: number) => Math.abs((((r - FOCUSED) % 360) + 540) % 360 - 180)
const nearestFocus = (r: number) => FOCUSED + Math.round((r - FOCUSED) / 360) * 360

/** 0 → 1 con arranque y llegada suaves, entre dos ángulos de desenfoque. */
const phase = (r: number, from: number, to: number) => {
  const t = Math.min(1, Math.max(0, (offFocus(r) - from) / (to - from)))
  return t * t * (3 - 2 * t)
}

// Primer tramo del giro: se desarma. Segundo tramo: se desenfoca.
const OPEN_FROM = 3
const OPEN_TO = 45
const BLUR_FROM = 50
const BLUR_TO = 120
const MAX_BLUR = 4 // px

/** Cuánto se "desarma" el isotipo (0 = armado, 1 = abierto del todo). */
const openness = (r: number) => phase(r, OPEN_FROM, OPEN_TO)

// Recorridos máximos de cada pieza, en % del lienzo del isotipo
const BLADE_TRAVEL = 16 * ISO_UNIT
const BLADE_TWIST = 14 // grados: el iris gira levemente al abrirse
const RING_GROWTH = 0.07
const TAIL_TRAVEL = 6 * ISO_UNIT
const ISO_GROWTH = 0.08 // el isotipo entero se agranda mientras se abre
const ASPECT = ISO.width / ISO.height // traduce % de ancho a % de alto
const ORIGIN = `${ISO.originX}% ${ISO.originY}%`
// borde interior del aro, apenas agrandado para que el corte quede tapado por el aro
const IRIS_CLIP = `ellipse(${(ISO_IRIS.width * 0.51).toFixed(3)}% ${(ISO_IRIS.height * 0.51).toFixed(3)}% at ${ORIGIN})`

/**
 * Zona de agarre en pantallas táctiles: solo el aro (anillo entre el 31% y el 50% del radio).
 * El centro queda libre para que el dedo pueda scrollear la página.
 */
const ringHitArea = (() => {
  const pts = (r: number, reverse: boolean) =>
    Array.from({ length: 49 }, (_, i) => {
      const a = ((reverse ? 48 - i : i) / 48) * Math.PI * 2
      return `${(50 + r * Math.cos(a)).toFixed(2)}% ${(50 + r * Math.sin(a)).toFixed(2)}%`
    })
  return `polygon(evenodd, ${[...pts(50, false), ...pts(31, true)].join(', ')})`
})()

function useCoarsePointer() {
  const [coarse, setCoarse] = useState(() => window.matchMedia('(pointer: coarse)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    const onChange = () => setCoarse(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return coarse
}

function Blade({ src, dx, dy, open }: { src: string; dx: number; dy: number; open: MotionValue<number> }) {
  const transform = useTransform(open, (k) =>
    k < 0.001
      ? 'none'
      : `rotate(${(k * BLADE_TWIST).toFixed(2)}deg) translate(${(dx * k * BLADE_TRAVEL).toFixed(3)}%, ${(dy * k * BLADE_TRAVEL * ASPECT).toFixed(3)}%)`,
  )
  return (
    <motion.img
      src={src}
      alt=""
      draggable={false}
      className="absolute inset-0 size-full"
      style={{ transform, transformOrigin: ORIGIN }}
    />
  )
}

type Drag = { id: number; last: number; lastT: number; vel: number }

export default function Lens() {
  const reduce = useReducedMotion()
  const coarse = useCoarsePointer()
  const root = useRef<HTMLDivElement>(null)
  const inView = useInView(root, { once: true, amount: 0.4 })
  const [touched, setTouched] = useState(false)

  const rot = useMotionValue(FOCUSED)
  const ring = useTransform(rot, (r) => `rotate(${r}deg)`)
  const open = useTransform(rot, openness)
  // En reposo no se aplica ni filtro ni escala: evita capas extra (y artefactos en Safari)
  const qFilter = useTransform(rot, (r) => {
    const b = phase(r, BLUR_FROM, BLUR_TO) * MAX_BLUR
    return b < 0.05 ? 'none' : `blur(${b.toFixed(2)}px)`
  })
  const qScale = useTransform(open, (k) => (k < 0.001 ? 'none' : `scale(${(1 + k * ISO_GROWTH).toFixed(4)})`))
  const ringScale = useTransform(open, (k) => (k < 0.001 ? 'none' : `scale(${(1 + k * RING_GROWTH).toFixed(4)})`))
  const tailShift = useTransform(open, (k) =>
    k < 0.001
      ? 'none'
      : `translate(${(ISO_TAIL.dx * k * TAIL_TRAVEL).toFixed(3)}%, ${(ISO_TAIL.dy * k * TAIL_TRAVEL * ASPECT).toFixed(3)}%)`,
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

  useEffect(() => () => window.clearTimeout(refocusTimer.current), [])

  const angleOf = (e: PointerEvent) => {
    const b = root.current!.getBoundingClientRect()
    return (Math.atan2(e.clientY - (b.top + b.height / 2), e.clientX - (b.left + b.width / 2)) * 180) / Math.PI
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (drag.current || (e.pointerType === 'mouse' && e.button !== 0)) return
    halt()
    drag.current = { id: e.pointerId, last: angleOf(e), lastT: performance.now(), vel: 0 }
    e.currentTarget.setPointerCapture(e.pointerId)
    setTouched(true)
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d || e.pointerId !== d.id) return
    const a = angleOf(e)
    const delta = ((a - d.last + 540) % 360) - 180
    d.last = a
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
    const a = animate(rot, [rot.get(), r + 16, r], { duration: 1.2, ease: [0.23, 1, 0.32, 1] })
    stopAnim.current = () => a.stop()
  }

  return (
    <div aria-hidden className="select-none">
      <div ref={root} className="relative mx-auto aspect-square w-full max-w-[34rem]">
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

        {/* isotipo en piezas: base, luz del iris, aletas, aro y colita (centrado en el centro del aro) */}
        <motion.div
          className="pointer-events-none absolute"
          style={{
            left: `${ISO_BOX.left}%`,
            top: `${ISO_BOX.top}%`,
            width: `${ISO_BOX.width}%`,
            height: `${ISO_BOX.height}%`,
            filter: qFilter,
            transform: qScale,
            transformOrigin: ORIGIN,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
        >
          <img src="/brand/iso/base.webp" alt="" draggable={false} className="absolute inset-0 size-full" />
          <motion.div
            className="absolute rounded-full bg-[radial-gradient(closest-side,rgb(125_184_255/0.9),rgb(40_128_251/0.45)_45%,transparent)]"
            style={{
              left: `${ISO.originX - ISO_IRIS.width / 2}%`,
              top: `${ISO.originY - ISO_IRIS.height / 2}%`,
              width: `${ISO_IRIS.width}%`,
              height: `${ISO_IRIS.height}%`,
              opacity: open,
            }}
          />
          {/* las aletas solo se ven dentro del aro: al retraerse se esconden bajo el borde, como un diafragma */}
          <div className="absolute inset-0" style={{ clipPath: IRIS_CLIP }}>
            {ISO_BLADES.map((b) => (
              <Blade key={b.src} src={b.src} dx={b.dx} dy={b.dy} open={open} />
            ))}
          </div>
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

        {/* zona de agarre: todo el lente con mouse; solo el aro en pantallas táctiles */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          onPointerEnter={onPointerEnter}
          className="absolute inset-0 cursor-grab touch-none rounded-full active:cursor-grabbing"
          style={coarse ? { clipPath: ringHitArea } : undefined}
        />
      </div>

      <p
        className={`mt-5 text-center text-xs text-mute transition-opacity duration-700 ${touched ? 'opacity-0' : 'opacity-100'}`}
      >
        {coarse ? 'Girá el aro con el dedo' : 'Girá el anillo del lente'}
      </p>
    </div>
  )
}
