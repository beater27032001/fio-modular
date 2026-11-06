'use client'

import { motion } from 'motion/react'

import { EASE } from '@constants/motion'

const TITLE = ['Fio Modular', 'FM-6']

const STEPS = [
  'Aperte Ligar na saída',
  'Arraste de uma saída (preta) até uma entrada',
  'Toque numa entrada ocupada para tirar o cabo',
  'Gire os botões arrastando para cima ou para baixo',
]

export function Hero() {
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-6 pt-5 pb-[26px]">
        <h1 className="m-0 font-display text-[clamp(34px,6vw,78px)] leading-[.95] font-normal tracking-[-.01em]">
          {TITLE.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[.06em]">
              <motion.span
                className="block"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: 0.15 + i * 0.12,
                  ease: EASE,
                }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
          className="m-0 max-w-[46ch] text-muted"
        >
          Seis módulos, nenhuma tela. O som muda conforme você liga os cabos.
          Aperte Ligar e mexa em tudo.
        </motion.p>
      </div>
      <motion.ol
        initial="hidden"
        animate="show"
        variants={{
          show: { transition: { staggerChildren: 0.08, delayChildren: 0.6 } },
        }}
        className="m-0 mb-3.5 flex list-none flex-wrap gap-x-[18px] gap-y-2.5 p-0 text-sm text-muted"
      >
        {STEPS.map((step, i) => (
          <motion.li
            key={step}
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <b className="mr-1.5 font-mono font-medium text-hot">
              {String(i + 1).padStart(2, '0')}
            </b>
            {step}
          </motion.li>
        ))}
      </motion.ol>
    </section>
  )
}
