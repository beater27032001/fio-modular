'use client'

import { motion } from 'motion/react'

import { EASE } from '@constants/motion'

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="flex items-center justify-between gap-3 py-[18px]"
    >
      <span className="font-display text-base tracking-[.02em]">FIO</span>
      <a href="#comprar" className="tag hover:border-hot hover:text-hot">
        Reservar
      </a>
    </motion.header>
  )
}
