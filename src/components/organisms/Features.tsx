'use client'

import { motion, type Variants } from 'motion/react'

import { EASE } from '@constants/motion'

const FEATURES = [
  {
    title: 'Sem menu',
    text: 'Cada função tem um botão físico. O que você vê no painel é tudo o que existe.',
  },
  {
    title: 'Patch é composição',
    text: 'Mude a ordem dos módulos e a mesma sequência vira outra música.',
  },
  {
    title: 'Formato padrão',
    text: 'Painéis de 3U, compatíveis com cases que você já tenha.',
  },
]

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

export function Features() {
  return (
    <motion.div
      className="grid gap-[26px] md:grid-cols-3"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={{ show: { transition: { staggerChildren: 0.12 } } }}
    >
      {FEATURES.map((f) => (
        <motion.div key={f.title} variants={fadeUp}>
          <h3 className="m-0 mb-2 font-display text-[15px] font-normal">
            {f.title}
          </h3>
          <p className="m-0 text-muted">{f.text}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
