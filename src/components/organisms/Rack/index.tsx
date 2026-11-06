import { motion } from 'motion/react'
import { useSynth } from '@/hooks/useSynth'
import { PatchContext, SynthContext, type PatchApi } from '@/providers/rack'
import { DelayModule, FilterModule, LfoModule, NoiseModule, OscModule, OutModule } from './modules'

const noPatch: PatchApi = { register: () => {}, startDrag: () => {} }

export function Rack() {
  const synth = useSynth()

  return (
    <SynthContext value={synth}>
      <PatchContext value={noPatch}>
        <motion.div className="rack" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
          <motion.div
            className="grid grid-cols-2 gap-1.5 sm:grid-cols-6 rack:flex"
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
      </PatchContext>
    </SynthContext>
  )
}
