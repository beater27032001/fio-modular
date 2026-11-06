'use client'

import { JACKS, type JackId } from '@domain/patch'
import { cn } from '@lib/utils'
import { usePatch } from '@providers/rack'

export function Jack({ id }: { id: JackId }) {
  const { register, startDrag } = usePatch()
  const { dir, kind, label } = JACKS[id]
  return (
    <div className={cn('jack', dir === 'out' && 'out', kind === 'mod' && 'cv')}>
      <div
        ref={(el) => register(id, el)}
        className="hole"
        onPointerDown={(e) => startDrag(id, e)}
      />
      <span>{label}</span>
    </div>
  )
}
