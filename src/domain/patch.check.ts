// Rode com: npm run check
import assert from 'node:assert/strict'

import { canConnect, DEFAULT_PATCH } from './patch.ts'

assert.deepEqual(canConnect('osc', 'delayIn', []), { ok: true })
assert.equal(canConnect('osc', 'noise', []).ok, false, 'saída em saída')
assert.equal(
  canConnect('filterIn', 'out1', []).ok,
  false,
  'começar numa entrada',
)
assert.equal(
  canConnect('osc', 'out1', DEFAULT_PATCH).ok,
  false,
  'entrada ocupada',
)
const wrong = canConnect('lfo', 'out2', [])
assert.ok(!wrong.ok && wrong.reason, 'tipo de sinal diferente explica o motivo')
console.log('patch ok')
