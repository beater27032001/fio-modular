// Corda com integração de Verlet: pontas presas, gravidade e restrição de distância.
export type Point = [number, number]

interface Node {
  x: number
  y: number
  px: number
  py: number
}

export interface Rope<T> {
  from: T
  color: string
  pts: Node[]
}

const SEG = 14
const GRAVITY = 0.55
const DAMPING = 0.97
const ITERATIONS = 14

export function createRope<T>(
  from: T,
  a: Point,
  b: Point,
  color: string,
): Rope<T> {
  const pts = Array.from({ length: SEG }, (_, i) => {
    const t = i / (SEG - 1)
    const x = a[0] + (b[0] - a[0]) * t,
      y = a[1] + (b[1] - a[1]) * t
    return { x, y, px: x, py: y }
  })
  return { from, color, pts }
}

export function stepRope<T>({ pts }: Rope<T>, a: Point, b: Point) {
  const rest =
    Math.max(10, Math.hypot(b[0] - a[0], b[1] - a[1]) * 1.04 + 30) / (SEG - 1)
  for (let i = 1; i < SEG - 1; i++) {
    const p = pts[i]
    const vx = (p.x - p.px) * DAMPING,
      vy = (p.y - p.py) * DAMPING
    p.px = p.x
    p.py = p.y
    p.x += vx
    p.y += vy + GRAVITY
  }
  const first = pts[0],
    last = pts[SEG - 1]
  for (let it = 0; it < ITERATIONS; it++) {
    first.x = a[0]
    first.y = a[1]
    last.x = b[0]
    last.y = b[1]
    for (let i = 0; i < SEG - 1; i++) {
      const p = pts[i],
        q = pts[i + 1]
      const dx = q.x - p.x,
        dy = q.y - p.y
      const d = Math.hypot(dx, dy) || 0.001,
        diff = ((d - rest) / d) * 0.5
      if (i !== 0) {
        p.x += dx * diff
        p.y += dy * diff
      }
      if (i + 1 !== SEG - 1) {
        q.x -= dx * diff
        q.y -= dy * diff
      }
    }
  }
}

export function drawRope<T>(
  cx: CanvasRenderingContext2D,
  { pts: P, color }: Rope<T>,
) {
  const path = () => {
    cx.beginPath()
    cx.moveTo(P[0].x, P[0].y)
    for (let i = 1; i < SEG - 1; i++)
      cx.quadraticCurveTo(
        P[i].x,
        P[i].y,
        (P[i].x + P[i + 1].x) / 2,
        (P[i].y + P[i + 1].y) / 2,
      )
    cx.lineTo(P[SEG - 1].x, P[SEG - 1].y)
  }
  const stroke = (
    style: string,
    width: number,
    alpha: number,
    dx = 0,
    dy = 0,
  ) => {
    cx.save()
    cx.globalAlpha = alpha
    cx.strokeStyle = style
    cx.lineWidth = width
    cx.translate(dx, dy)
    path()
    cx.stroke()
    cx.restore()
  }
  cx.lineCap = 'round'
  cx.lineJoin = 'round'
  stroke('#000', 9, 0.35, 2, 4)
  stroke(color, 7, 0.92)
  stroke('#fff', 2, 0.35, -1, -1.5)
  for (const p of [P[0], P[SEG - 1]]) {
    cx.fillStyle = '#222'
    cx.beginPath()
    cx.arc(p.x, p.y, 9, 0, Math.PI * 2)
    cx.fill()
    cx.fillStyle = color
    cx.beginPath()
    cx.arc(p.x, p.y, 5, 0, Math.PI * 2)
    cx.fill()
  }
}
