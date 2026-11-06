export type SignalKind = 'audio' | 'mod'
export type JackId =
  | 'osc'
  | 'noise'
  | 'lfo'
  | 'filterOut'
  | 'delayOut'
  | 'filterIn'
  | 'filterMod'
  | 'delayIn'
  | 'out1'
  | 'out2'

export interface JackSpec {
  dir: 'in' | 'out'
  kind: SignalKind
  label: string
}

export interface Connection {
  from: JackId
  to: JackId
}

export const JACKS: Record<JackId, JackSpec> = {
  osc: { dir: 'out', kind: 'audio', label: 'OUT' },
  noise: { dir: 'out', kind: 'audio', label: 'OUT' },
  lfo: { dir: 'out', kind: 'mod', label: 'MOD' },
  filterIn: { dir: 'in', kind: 'audio', label: 'IN' },
  filterMod: { dir: 'in', kind: 'mod', label: 'MOD' },
  filterOut: { dir: 'out', kind: 'audio', label: 'OUT' },
  delayIn: { dir: 'in', kind: 'audio', label: 'IN' },
  delayOut: { dir: 'out', kind: 'audio', label: 'OUT' },
  out1: { dir: 'in', kind: 'audio', label: 'IN 1' },
  out2: { dir: 'in', kind: 'audio', label: 'IN 2' },
}

export const DEFAULT_PATCH: Connection[] = [
  { from: 'osc', to: 'filterIn' },
  { from: 'filterOut', to: 'delayIn' },
  { from: 'delayOut', to: 'out1' },
  { from: 'lfo', to: 'filterMod' },
  { from: 'noise', to: 'out2' },
]

export type PatchCheck = { ok: true } | { ok: false; reason?: string }

/** Um cabo sai de uma saída e entra numa entrada livre do mesmo tipo de sinal. */
export function canConnect(
  from: JackId,
  to: JackId,
  patch: Connection[],
): PatchCheck {
  const a = JACKS[from],
    b = JACKS[to]
  if (a.dir !== 'out' || b.dir !== 'in') return { ok: false }
  if (a.kind !== b.kind)
    return {
      ok: false,
      reason:
        a.kind === 'mod'
          ? 'A saída do LFO só controla a entrada MOD do filtro.'
          : 'A entrada MOD aceita só o LFO.',
    }
  if (patch.some((c) => c.to === to)) return { ok: false }
  return { ok: true }
}

export const cableAt = (to: JackId, patch: Connection[]) =>
  patch.find((c) => c.to === to)
