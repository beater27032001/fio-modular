'use client'

import { useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { motion } from 'motion/react'

interface Props {
  label: string
  /** Posição do botão de 0 a 1. */
  value: number
  display: string
  onChange: (value: number) => void
}

const KEY_STEP: Record<string, number> = { ArrowUp: 0.05, ArrowRight: 0.05, ArrowDown: -0.05, ArrowLeft: -0.05 }

export function Knob({ label, value, display, onChange }: Props) {
  const drag = useRef<{ y: number; n: number } | null>(null)
  const set = (n: number) => onChange(Math.max(0, Math.min(1, n)))

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = { y: e.clientY, n: value }
    e.currentTarget.setPointerCapture(e.pointerId)
    e.preventDefault()
  }
  const onPointerMove = (e: PointerEvent) => {
    if (drag.current) set(drag.current.n + (drag.current.y - e.clientY) / 160)
  }
  const onKeyDown = (e: KeyboardEvent) => {
    const step = KEY_STEP[e.key]
    if (step) { e.preventDefault(); set(value + step) }
  }

  return (
    <div className="knob">
      <div
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value * 100)}
        aria-valuetext={display}
        className="cap"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
        onKeyDown={onKeyDown}
      >
        <motion.i
          initial={{ rotate: -135 }}
          animate={{ rotate: -135 + value * 270 }}
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        />
      </div>
      <span>{label}</span>
      <span className="value">{display}</span>
    </div>
  )
}
