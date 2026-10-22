import { useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useRef } from 'react'
import { WORKS, workSrc } from '../../data/works'

/*
 * Galería en esfera 3D (solo desktop con mouse).
 * Las columnas dan la vuelta completa, así que el giro no tiene fin.
 * Se arrastra para girar, sigue por inercia y deriva lento cuando nadie la toca.
 * El bucle de animación se pausa cuando la galería sale de pantalla.
 */
const COLS = WORKS.length // una foto por columna: cada fila da la vuelta sin repetir
const ROWS = 4
const SPREAD_X = 56 // grados que abarcan las filas
const REST_X = -4

export default function Dome({ onOpen }: { onOpen: (index: number) => void }) {
  const stage = useRef<HTMLDivElement>(null)
  const sphere = useRef<HTMLDivElement>(null)
  const moved = useRef(false)
  const reduce = useReducedMotion()

  const tiles = useMemo(() => {
    const seen = new Set<number>()
    return Array.from({ length: COLS * ROWS }, (_, n) => {
      const r = Math.floor(n / COLS)
      const c = n % COLS
      const index = (n + r * 3) % WORKS.length // desfase por fila: vecinos verticales distintos
      const first = !seen.has(index)
      seen.add(index)
      return {
        key: n,
        index,
        first,
        ry: c * (360 / COLS),
        rx: -SPREAD_X / 2 + r * (SPREAD_X / (ROWS - 1)),
      }
    })
  }, [])

  useEffect(() => {
    const el = stage.current!
    const sp = sphere.current!
    const s = { gx: REST_X, gy: 0, vy: 0, dragging: false, id: -1, sx: 0, sy: 0, bx: 0, by: 0, lastGY: 0, lastT: 0, idle: 0 }
    let raf = 0
    let visible = false

    const apply = () => {
      // la esfera va hacia atrás un radio: las fotos del frente quedan a tamaño real
      sp.style.transform = `translate(-50%, -50%) translateZ(calc(var(--r) * -1)) rotateX(${s.gx.toFixed(2)}deg) rotateY(${s.gy.toFixed(2)}deg)`
    }
    const layout = () => {
      const r = Math.max(300, Math.min(680, el.clientWidth * 0.56, el.clientHeight * 1.05))
      el.style.setProperty('--r', `${r}px`)
      el.style.setProperty('--tw', `${Math.round(r * 0.34)}px`)
      el.style.setProperty('--th', `${Math.round(r * 0.255)}px`)
      el.style.perspective = `${Math.round(r * 2)}px`
    }
    const loop = () => {
      if (!s.dragging) {
        s.gy %= 360 // la esfera es continua: se puede volver a cero sin que se note
        if (Math.abs(s.vy) > 0.02) {
          s.gy += s.vy
          s.vy *= 0.94
        } else {
          s.vy = 0
          if (!reduce && ++s.idle > 60) s.gy += 0.045
        }
        s.gx += (REST_X - s.gx) * 0.04
        apply()
      }
      raf = visible ? requestAnimationFrame(loop) : 0
    }

    const down = (e: PointerEvent) => {
      if (s.dragging || (e.pointerType === 'mouse' && e.button !== 0)) return
      Object.assign(s, { dragging: true, id: e.pointerId, idle: 0, vy: 0, sx: e.clientX, sy: e.clientY, bx: s.gx, by: s.gy, lastGY: s.gy, lastT: performance.now() })
      moved.current = false
    }
    const move = (e: PointerEvent) => {
      if (!s.dragging || e.pointerId !== s.id) return
      const dx = e.clientX - s.sx
      const dy = e.clientY - s.sy
      // recién cuenta como arrastre si se movió: así un clic en una foto abre la foto
      if (!moved.current && Math.abs(dx) + Math.abs(dy) > 6) {
        moved.current = true
        el.setPointerCapture(e.pointerId)
        el.dataset.grabbing = ''
      }
      if (!moved.current) return
      s.gy = s.by + dx * 0.24
      s.gx = Math.max(-24, Math.min(24, s.bx - dy * 0.2))
      const now = performance.now()
      const dt = now - s.lastT
      if (dt > 0) {
        s.vy = ((s.gy - s.lastGY) / dt) * 8
        s.lastGY = s.gy
        s.lastT = now
      }
      apply()
    }
    const up = (e: PointerEvent) => {
      if (!s.dragging || e.pointerId !== s.id) return
      s.dragging = false
      if (performance.now() - s.lastT > 80) s.vy = 0 // si frenó antes de soltar, no hay inercia
      delete el.dataset.grabbing
    }

    const ro = new ResizeObserver(layout)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(loop)
    })
    ro.observe(el)
    io.observe(el)
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    layout()
    apply()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
    }
  }, [reduce])

  return (
    <div
      ref={stage}
      className="relative h-[clamp(30rem,72vh,44rem)] cursor-grab touch-none select-none overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(120%_90%_at_50%_30%,#11141a_0%,var(--color-ink)_70%)] data-[grabbing]:cursor-grabbing"
      style={{ perspectiveOrigin: '50% 45%' }}
    >
      <div ref={sphere} className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]">
        {tiles.map((t) => {
          const w = WORKS[t.index]
          return (
            <button
              key={t.key}
              type="button"
              tabIndex={t.first ? 0 : -1}
              aria-hidden={t.first ? undefined : true}
              aria-label={`${w.title}, ${w.detail}. Ver en grande`}
              onClick={() => !moved.current && onOpen(t.index)}
              className="dome-tile group absolute left-0 top-0 rounded-xl focus-visible:outline-offset-4"
              style={{ transform: `rotateY(${t.ry}deg) rotateX(${t.rx}deg) translateZ(var(--r))` }}
            >
              <img
                src={workSrc(w.slug, 800)}
                alt=""
                width={800}
                height={Math.round((800 * w.h) / w.w)}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="size-full rounded-xl object-cover transition-[filter] duration-300 group-hover:brightness-115"
              />
            </button>
          )
        })}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_75%_at_50%_45%,transparent_55%,rgb(7_8_10/0.9)_100%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-ink to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent" />
      <p className="pointer-events-none absolute inset-x-0 bottom-5 text-center text-xs text-mute">
        Arrastrá para girar · hacé clic en una foto para verla en grande
      </p>
    </div>
  )
}
