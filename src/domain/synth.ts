export type ParamId = 'bpm' | 'decay' | 'hat' | 'rate' | 'depth' | 'cutoff' | 'q' | 'time' | 'fb' | 'mix' | 'vol'
export type ParamValues = Record<ParamId, number>

type Format = 'bpm' | 'ms' | 'pct' | 'hz' | 'hzlog' | 'dec'

export interface ParamSpec {
  label: string
  min: number
  max: number
  initial: number
  format: Format
}

export const PARAMS: Record<ParamId, ParamSpec> = {
  bpm: { label: 'Tempo', min: 70, max: 150, initial: 104, format: 'bpm' },
  decay: { label: 'Decay', min: 0.05, max: 0.8, initial: 0.22, format: 'ms' },
  hat: { label: 'Nível', min: 0.2, max: 1, initial: 0.6, format: 'pct' },
  rate: { label: 'Rate', min: 0.05, max: 8, initial: 0.35, format: 'hz' },
  depth: { label: 'Depth', min: 0, max: 1, initial: 0.7, format: 'pct' },
  cutoff: { label: 'Corte', min: 80, max: 6000, initial: 900, format: 'hzlog' },
  q: { label: 'Resso', min: 0.5, max: 18, initial: 6, format: 'dec' },
  time: { label: 'Tempo', min: 0.08, max: 0.7, initial: 0.43, format: 'ms' },
  fb: { label: 'Repete', min: 0, max: 0.85, initial: 0.45, format: 'pct' },
  mix: { label: 'Mix', min: 0, max: 1, initial: 0.35, format: 'pct' },
  vol: { label: 'Volume', min: 0, max: 1, initial: 0.7, format: 'pct' },
}

// Os botões trabalham em 0..1; o corte do filtro é logarítmico, como o ouvido.
const isLog = (s: ParamSpec) => s.format === 'hzlog'
export const toNormal = (s: ParamSpec, v: number) =>
  isLog(s) ? Math.log(v / s.min) / Math.log(s.max / s.min) : (v - s.min) / (s.max - s.min)
export const fromNormal = (s: ParamSpec, n: number) =>
  isLog(s) ? s.min * (s.max / s.min) ** n : s.min + n * (s.max - s.min)

const dec = (v: number, d: number) => v.toFixed(d).replace('.', ',')

export function formatParam(s: ParamSpec, v: number): string {
  switch (s.format) {
    case 'bpm': return `${Math.round(v)} bpm`
    case 'ms': return `${Math.round(v * 1000)} ms`
    case 'pct': return `${Math.round(v * 100)}%`
    case 'hz': return `${dec(v, 2)} Hz`
    case 'hzlog': return v >= 1000 ? `${dec(v / 1000, 1)} kHz` : `${Math.round(v)} Hz`
    case 'dec': return dec(v, 1)
  }
}

export type Waveform = 'sine' | 'triangle' | 'sawtooth' | 'square'

export const WAVEFORMS: { id: Waveform; icon: string; label: string }[] = [
  { id: 'sine', icon: '∿', label: 'Senoide' },
  { id: 'triangle', icon: '⋀', label: 'Triangular' },
  { id: 'sawtooth', icon: '⩘', label: 'Dente de serra' },
  { id: 'square', icon: '⊓', label: 'Quadrada' },
]

export const NOTES = ['A2', 'C3', 'E3', 'A2', 'G2', 'A2', 'C3', 'D3']
export const INITIAL_STEPS = [1, 0, 1, 1, 0, 1, 1, 0].map(Boolean)
export const INITIAL_HATS = [0, 1, 0, 1, 0, 1, 1, 1].map(Boolean)
