import { createContext, use, type PointerEvent } from 'react'

import type { JackId } from '@domain/patch'
import type { useSynth } from '@hooks/useSynth'

export interface PatchApi {
  register: (id: JackId, el: HTMLElement | null) => void
  startDrag: (id: JackId, e: PointerEvent) => void
}

export const PatchContext = createContext<PatchApi | null>(null)
export const SynthContext = createContext<ReturnType<typeof useSynth> | null>(
  null,
)

export const usePatch = () => use(PatchContext)!
export const useSynthContext = () => use(SynthContext)!
