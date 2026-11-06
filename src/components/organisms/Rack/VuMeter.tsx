import { useEffect, useRef } from 'react'

const BARS = Array.from({ length: 8 }, (_, i) => i)

export function VuMeter({ level, active }: { level: () => number; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bars = [...ref.current!.children]
    if (!active) return bars.forEach(b => b.classList.remove('on'))
    let raf = 0
    const tick = () => {
      const l = level()
      bars.forEach((b, i) => b.classList.toggle('on', i < l * 8))
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [active, level])

  return (
    <div ref={ref} className="vu" aria-hidden>
      {BARS.map(i => (
        <i key={i} className={i > 6 ? 'hi pk' : i > 4 ? 'hi' : ''} style={{ height: `${30 + i * 10}%` }} />
      ))}
    </div>
  )
}
