'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useInView, useMotionValue, useTransform } from 'motion/react'
import { EASE } from '@/constants/motion'

const PRICE = 4200
const brl = (v: number) => `R$ ${Math.round(v).toLocaleString('pt-BR')}`

function Price() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const value = useMotionValue(0)
  const text = useTransform(value, brl)

  useEffect(() => {
    if (!inView) return
    const controls = animate(value, PRICE, { duration: 1.4, ease: EASE })
    return () => controls.stop()
  }, [inView, value])

  return (
    <motion.div ref={ref} aria-label={brl(PRICE)} className="font-display text-[clamp(40px,7vw,80px)] leading-none tabular-nums">
      {text}
    </motion.div>
  )
}

export function Buy() {
  const [reserved, setReserved] = useState(false)

  return (
    <motion.div
      id="comprar"
      className="mt-[60px] flex scroll-mt-6 flex-wrap items-end justify-between gap-5"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div>
        <div className="tag mb-2.5 inline-block">KIT COMPLETO · 6 MÓDULOS + 5 CABOS</div>
        <Price />
      </div>
      <motion.button
        className="min-w-[180px] overflow-hidden rounded bg-hot px-[26px] py-4 font-semibold text-[#111]"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setReserved(true)}
        disabled={reserved}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={reserved ? 'ok' : 'cta'}
            className="block"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {reserved ? 'Reservado ✓' : 'Reservar kit'}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </motion.div>
  )
}
