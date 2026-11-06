import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type PointerEvent,
} from 'react'

import {
  JACKS,
  cableAt,
  canConnect,
  type Connection,
  type JackId,
} from '@domain/patch'
import {
  createRope,
  drawRope,
  stepRope,
  type Point,
  type Rope,
} from '@lib/rope'

const COLORS = [
  '#ff5c39',
  '#ffd23a',
  '#3ab0ff',
  '#6be38f',
  '#ff7ad9',
  '#b18cff',
]
const HIT_RADIUS = 24

interface Options {
  patch: Connection[]
  onPatch: (c: Connection) => void
  onUnpatch: (c: Connection) => void
  onMessage: (text: string) => void
}

const toLocal = (rack: HTMLElement, x: number, y: number): Point => {
  const r = rack.getBoundingClientRect()
  return [x - r.left, y - r.top]
}

export function useCables(options: Options) {
  const { patch } = options
  const latest = useRef(options)
  useLayoutEffect(() => {
    latest.current = options
  })

  const rack = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const jacks = useRef(new Map<JackId, HTMLElement>())
  const ropes = useRef(new Map<JackId, Rope<JackId>>()) // um cabo por entrada
  const drag = useRef<{ rope: Rope<JackId>; pointer: Point } | null>(null)
  const colorIndex = useRef(0)

  const nextColor = useCallback(
    () => COLORS[colorIndex.current++ % COLORS.length],
    [],
  )
  const local = useCallback(
    (x: number, y: number) => toLocal(rack.current!, x, y),
    [],
  )
  const center = useCallback((id: JackId): Point => {
    const r = jacks.current.get(id)!.getBoundingClientRect()
    return toLocal(rack.current!, r.left + r.width / 2, r.top + r.height / 2)
  }, [])
  const jackAt = ([x, y]: Point) =>
    [...jacks.current.keys()].find((id) => {
      const [jx, jy] = center(id)
      return (jx - x) ** 2 + (jy - y) ** 2 < HIT_RADIUS ** 2
    })

  const register = useCallback((id: JackId, el: HTMLElement | null) => {
    if (el) jacks.current.set(id, el)
    else jacks.current.delete(id)
  }, [])

  // Cabos novos nascem esticados e caem balançando até assentar.
  useEffect(() => {
    for (const c of patch)
      if (!ropes.current.has(c.to))
        ropes.current.set(
          c.to,
          createRope(c.from, center(c.from), center(c.to), nextColor()),
        )
    for (const to of ropes.current.keys())
      if (!cableAt(to, patch)) ropes.current.delete(to)
  }, [patch, center, nextColor])

  const startDrag = useCallback(
    (id: JackId, e: PointerEvent) => {
      e.preventDefault()
      const { patch, onUnpatch, onMessage } = latest.current
      let rope: Rope<JackId>
      if (JACKS[id].dir === 'in') {
        const c = cableAt(id, patch)
        if (!c)
          return onMessage(
            'Comece o cabo numa saída (etiqueta preta) e solte numa entrada.',
          )
        rope =
          ropes.current.get(id) ??
          createRope(c.from, center(c.from), center(id), nextColor())
        ropes.current.delete(id)
        onUnpatch(c)
      } else rope = createRope(id, center(id), center(id), nextColor())
      drag.current = { rope, pointer: local(e.clientX, e.clientY) }
      rack.current!.setPointerCapture(e.pointerId)
    },
    [center, local, nextColor],
  )

  const handlers = {
    onPointerMove: (e: PointerEvent) => {
      if (drag.current) drag.current.pointer = local(e.clientX, e.clientY)
    },
    onPointerUp: (e: PointerEvent) => {
      const d = drag.current
      if (!d) return
      drag.current = null
      const target = jackAt(local(e.clientX, e.clientY))
      if (!target) return
      const check = canConnect(d.rope.from, target, latest.current.patch)
      if (check.ok) {
        ropes.current.set(target, d.rope)
        latest.current.onPatch({ from: d.rope.from, to: target })
        latest.current.onMessage('')
      } else if (check.reason) latest.current.onMessage(check.reason)
    },
    onPointerCancel: () => (drag.current = null),
  }

  // O canvas passa da borda de baixo do rack para os cabos ficarem pendurados; redesenha a cada quadro.
  useEffect(() => {
    const cv = canvas.current!,
      cx = cv.getContext('2d')!
    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2)
      cv.width = cv.clientWidth * dpr
      cv.height = cv.clientHeight * dpr
      cx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(cv)
    let raf = 0
    const frame = () => {
      cx.clearRect(0, 0, cv.width, cv.height)
      for (const [to, rope] of ropes.current) {
        stepRope(rope, center(rope.from), center(to))
        drawRope(cx, rope)
      }
      const d = drag.current
      if (d) {
        stepRope(d.rope, center(d.rope.from), d.pointer)
        drawRope(cx, d.rope)
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [center])

  return { rack, canvas, register, startDrag, handlers }
}
