'use client'

import { useMemo, useState } from 'react'

import { motion } from 'motion/react'

import { DEFAULT_PATCH, type Connection } from '@domain/patch'
import { useSynth } from '@hooks/useSynth'
import { PatchContext, SynthContext } from '@providers/rack'

import {
  DelayModule,
  FilterModule,
  LfoModule,
  NoiseModule,
  OscModule,
  OutModule,
} from './modules'
import { useCables } from './useCables'

export function Rack() {
  const [patch, setPatch] = useState<Connection[]>(DEFAULT_PATCH)
  const [message, setMessage] = useState('')
  const synth = useSynth(patch)
  const { rack, canvas, register, startDrag, handlers } = useCables({
    patch,
    onPatch: (c) => setPatch((p) => [...p, c]),
    onUnpatch: (c) => setPatch((p) => p.filter((x) => x.to !== c.to)),
    onMessage: setMessage,
  })

  const patchApi = useMemo(
    () => ({ register, startDrag }),
    [register, startDrag],
  )

  return (
    <SynthContext value={synth}>
      <PatchContext value={patchApi}>
        <motion.div
          ref={rack}
          className="rack"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          {...handlers}
        >
          <motion.canvas
            ref={canvas}
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[calc(100%+160px)] w-full"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { delay: 0.5, duration: 0.6 } },
            }}
          />
          <motion.div
            className="grid grid-cols-2 gap-1.5 rack:flex sm:grid-cols-6"
            variants={{ show: { transition: { staggerChildren: 0.07 } } }}
          >
            <OscModule />
            <NoiseModule />
            <LfoModule />
            <FilterModule />
            <DelayModule />
            <OutModule />
          </motion.div>
        </motion.div>
        <p
          className="mt-2.5 min-h-[1.5em] font-mono text-xs text-muted"
          aria-live="polite"
        >
          {message}
        </p>
      </PatchContext>
    </SynthContext>
  )
}
