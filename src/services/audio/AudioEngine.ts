import * as Tone from 'tone'

import { JACKS, type Connection, type JackId } from '@domain/patch'
import { NOTES, type ParamValues, type Waveform } from '@domain/synth'

export interface SynthState {
  params: ParamValues
  wave: Waveform
  steps: boolean[]
  hats: boolean[]
  patch: Connection[]
}

export const startAudio = () => Tone.start()

const key = (c: Connection) => `${c.from}>${c.to}`

/** Grafo de áudio do FM-6: recebe o estado do painel e o reflete no Tone. */
export class AudioEngine {
  private synth = new Tone.Synth({
    oscillator: { type: 'sawtooth' },
    envelope: { attack: 0.005, decay: 0.2, sustain: 0.15, release: 0.2 },
  })
  private oscOut = new Tone.Gain(0.6)
  private noise = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.05, sustain: 0 },
  })
  private noiseOut = new Tone.Gain(0.3)
  private filter = new Tone.Filter({ type: 'lowpass', rolloff: -24 })
  private lfo = new Tone.LFO(0.35, 100, 2000).start()
  private delay = new Tone.FeedbackDelay(0.4, 0.4)
  private in1 = new Tone.Gain(1)
  private in2 = new Tone.Gain(1)
  private master = new Tone.Gain(0.7)
  private meter = new Tone.Meter({ smoothing: 0.6 })
  private transport = Tone.getTransport()

  private outputs: Partial<Record<JackId, Tone.ToneAudioNode>> = {
    osc: this.oscOut,
    noise: this.noiseOut,
    filterOut: this.filter,
    delayOut: this.delay,
  }
  private inputs: Partial<Record<JackId, Tone.InputNode>> = {
    filterIn: this.filter,
    delayIn: this.delay,
    out1: this.in1,
    out2: this.in2,
  }

  private state: SynthState
  private wired = new Map<string, Connection>()

  constructor(state: SynthState, onStep: (i: number) => void) {
    this.state = state
    this.synth.connect(this.oscOut)
    this.noise.chain(new Tone.Filter(7000, 'highpass'), this.noiseOut)
    this.in1.connect(this.master)
    this.in2.connect(this.master)
    this.master.connect(this.meter)
    this.master.toDestination()

    new Tone.Sequence<number>(
      (time, i) => {
        if (this.state.steps[i])
          this.synth.triggerAttackRelease(NOTES[i], '16n', time)
        if (this.state.hats[i])
          this.noise.triggerAttackRelease('32n', time, 0.8)
        Tone.getDraw().schedule(() => onStep(i), time)
      },
      [0, 1, 2, 3, 4, 5, 6, 7],
      '8n',
    ).start(0)

    this.sync(state)
  }

  sync(state: SynthState) {
    this.state = state
    const p = state.params
    if (this.synth.oscillator.type !== state.wave)
      this.synth.oscillator.type = state.wave
    this.synth.envelope.decay = p.decay
    this.noiseOut.gain.rampTo(p.hat * 0.5, 0.05)
    this.lfo.frequency.rampTo(p.rate, 0.05)
    this.lfo.min = Math.max(60, p.cutoff * (1 - 0.85 * p.depth))
    this.lfo.max = Math.min(12000, p.cutoff * (1 + 3 * p.depth))
    this.filter.Q.rampTo(p.q, 0.05)
    this.delay.delayTime.rampTo(p.time, 0.1)
    this.delay.feedback.rampTo(p.fb, 0.05)
    this.delay.wet.rampTo(p.mix, 0.05)
    this.master.gain.rampTo(p.vol, 0.05)
    this.transport.bpm.rampTo(p.bpm, 0.1)
    this.syncPatch(state.patch)
    // Com o LFO ligado é ele quem move o corte; sem ele, vale o botão.
    if (!state.patch.some((c) => JACKS[c.from].kind === 'mod'))
      this.filter.frequency.rampTo(p.cutoff, 0.05)
  }

  start() {
    this.transport.start()
  }

  stop() {
    this.transport.stop()
    Tone.getDraw().cancel()
  }

  /** Nível de saída de 0 a 1, para o VU. */
  level() {
    const db = this.meter.getValue() as number
    return Math.max(0, Math.min(1, (db + 48) / 48))
  }

  private syncPatch(patch: Connection[]) {
    const next = new Map(patch.map((c) => [key(c), c]))
    for (const [k, c] of this.wired) if (!next.has(k)) this.wire(c, false)
    for (const [k, c] of next) if (!this.wired.has(k)) this.wire(c, true)
    this.wired = next
  }

  private wire({ from, to }: Connection, on: boolean) {
    if (JACKS[from].kind === 'mod') {
      if (on) this.lfo.connect(this.filter.frequency)
      else this.lfo.disconnect()
      return
    }
    const src = this.outputs[from]!,
      dst = this.inputs[to]!
    if (on) src.connect(dst)
    else src.disconnect(dst)
  }
}
