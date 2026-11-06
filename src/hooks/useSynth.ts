import { useState } from 'react'
import { INITIAL_HATS, INITIAL_STEPS, PARAMS, toNormal, type ParamId, type Waveform } from '@/domain/synth'

const initialKnobs = () =>
  Object.fromEntries(Object.entries(PARAMS).map(([id, s]) => [id, toNormal(s, s.initial)])) as Record<ParamId, number>

const flip = (i: number) => (list: boolean[]) => list.map((v, j) => (j === i ? !v : v))

export function useSynth() {
  const [knobs, setKnobs] = useState(initialKnobs)
  const [wave, setWave] = useState<Waveform>('sawtooth')
  const [steps, setSteps] = useState(INITIAL_STEPS)
  const [hats, setHats] = useState(INITIAL_HATS)

  return {
    knobs,
    setKnob: (id: ParamId, n: number) => setKnobs(k => ({ ...k, [id]: n })),
    wave,
    setWave,
    steps,
    toggleStep: (i: number) => setSteps(flip(i)),
    hats,
    toggleHat: (i: number) => setHats(flip(i)),
  }
}
