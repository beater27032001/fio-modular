import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { Connection } from '@domain/patch'
import {
  INITIAL_HATS,
  INITIAL_STEPS,
  PARAMS,
  fromNormal,
  toNormal,
  type ParamId,
  type ParamValues,
  type Waveform,
} from '@domain/synth'
import type { AudioEngine } from '@services/audio/AudioEngine'

const initialKnobs = () =>
  Object.fromEntries(
    Object.entries(PARAMS).map(([id, s]) => [id, toNormal(s, s.initial)]),
  ) as Record<ParamId, number>

const toValues = (knobs: Record<ParamId, number>) =>
  Object.fromEntries(
    Object.entries(knobs).map(([id, n]) => [
      id,
      fromNormal(PARAMS[id as ParamId], n),
    ]),
  ) as ParamValues

const flip = (i: number) => (list: boolean[]) =>
  list.map((v, j) => (j === i ? !v : v))

// O Tone só carrega depois da página: deixa a primeira tela leve.
const loadEngine = () => import('@services/audio/AudioEngine')

export function useSynth(patch: Connection[]) {
  const [knobs, setKnobs] = useState(initialKnobs)
  const [wave, setWave] = useState<Waveform>('sawtooth')
  const [steps, setSteps] = useState(INITIAL_STEPS)
  const [hats, setHats] = useState(INITIAL_HATS)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(-1)
  const engine = useRef<AudioEngine | null>(null)
  const loader = useRef<ReturnType<typeof loadEngine> | null>(null)

  const state = useMemo(
    () => ({ params: toValues(knobs), wave, steps, hats, patch }),
    [knobs, wave, steps, hats, patch],
  )

  useEffect(() => {
    loader.current = loadEngine()
  }, [])
  useEffect(() => {
    engine.current?.sync(state)
  }, [state])

  const togglePower = async () => {
    const audio = await (loader.current ?? loadEngine())
    await audio.startAudio()
    engine.current ??= new audio.AudioEngine(state, setCurrent)
    if (playing) {
      engine.current.stop()
      setCurrent(-1)
    } else engine.current.start()
    setPlaying(!playing)
  }

  const level = useCallback(() => engine.current?.level() ?? 0, [])

  return {
    knobs,
    setKnob: (id: ParamId, n: number) => setKnobs((k) => ({ ...k, [id]: n })),
    wave,
    setWave,
    steps,
    toggleStep: (i: number) => setSteps(flip(i)),
    hats,
    toggleHat: (i: number) => setHats(flip(i)),
    playing,
    togglePower,
    current,
    level,
  }
}
