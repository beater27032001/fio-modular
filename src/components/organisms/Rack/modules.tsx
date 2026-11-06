import type { ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'
import { Jack } from '@/components/atoms/Jack'
import { Knob } from '@/components/atoms/Knob'
import { EASE } from '@/constants/motion'
import { NOTES, PARAMS, WAVEFORMS, formatParam, fromNormal, type ParamId } from '@/domain/synth'
import { useSynthContext } from '@/providers/rack'
import { VuMeter } from './VuMeter'

const panelIn: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

function Panel({ title, sub, className, children }: { title: string; sub: string; className: string; children: ReactNode }) {
  return (
    <motion.div variants={panelIn} className={`mod ${className}`}>
      <h3>{title}</h3>
      <div className="sub">{sub}</div>
      {children}
    </motion.div>
  )
}

function ParamKnob({ id }: { id: ParamId }) {
  const { knobs, setKnob } = useSynthContext()
  const spec = PARAMS[id]
  return (
    <Knob
      label={spec.label}
      value={knobs[id]}
      display={formatParam(spec, fromNormal(spec, knobs[id]))}
      onChange={n => setKnob(id, n)}
    />
  )
}

export function OscModule() {
  const { wave, setWave, steps, toggleStep, hats, toggleHat, current } = useSynthContext()
  return (
    <Panel title="OSCILADOR" sub="VCO + SEQUENCIADOR" className="col-span-2 sm:col-span-6 rack:flex-[2.6]">
      <div className="wave">
        {WAVEFORMS.map(w => (
          <button key={w.id} aria-label={w.label} aria-pressed={wave === w.id} onClick={() => setWave(w.id)}>
            {w.icon}
          </button>
        ))}
      </div>
      <div className="seq">
        {NOTES.map((note, i) => (
          <button key={i} aria-label={`Passo ${i + 1}, nota ${note}`} aria-pressed={steps[i]} className={current === i ? 'now' : undefined} onClick={() => toggleStep(i)}>
            {note}
          </button>
        ))}
      </div>
      <div className="seq hats" role="group" aria-label="Chimbal">
        {hats.map((on, i) => (
          <button key={i} aria-label={`Chimbal passo ${i + 1}`} aria-pressed={on} onClick={() => toggleHat(i)} />
        ))}
      </div>
      <div className="row"><ParamKnob id="bpm" /><ParamKnob id="decay" /></div>
      <div className="jacks"><Jack id="osc" /></div>
    </Panel>
  )
}

export function NoiseModule() {
  return (
    <Panel title="RUÍDO" sub="CHIMBAL" className="sm:col-span-2 rack:flex-1">
      <div className="row"><ParamKnob id="hat" /></div>
      <div className="jacks"><Jack id="noise" /></div>
    </Panel>
  )
}

export function LfoModule() {
  return (
    <Panel title="LFO" sub="MODULAÇÃO" className="sm:col-span-2 rack:flex-1">
      <div className="row col"><ParamKnob id="rate" /><ParamKnob id="depth" /></div>
      <div className="jacks"><Jack id="lfo" /></div>
    </Panel>
  )
}

export function FilterModule() {
  return (
    <Panel title="FILTRO" sub="PASSA-BAIXA" className="sm:col-span-2 rack:flex-[1.3]">
      <div className="row"><ParamKnob id="cutoff" /><ParamKnob id="q" /></div>
      <div className="jacks"><Jack id="filterIn" /><Jack id="filterMod" /><Jack id="filterOut" /></div>
    </Panel>
  )
}

export function DelayModule() {
  return (
    <Panel title="DELAY" sub="ECO" className="sm:col-span-3 rack:flex-[1.3]">
      <div className="row"><ParamKnob id="time" /><ParamKnob id="fb" /><ParamKnob id="mix" /></div>
      <div className="jacks"><Jack id="delayIn" /><Jack id="delayOut" /></div>
    </Panel>
  )
}

export function OutModule() {
  const { playing, togglePower, level } = useSynthContext()
  return (
    <Panel title="SAÍDA" sub="MIXER" className="col-span-2 sm:col-span-3 rack:flex-1">
      <motion.button className="power" aria-pressed={playing} onClick={togglePower} whileTap={{ y: 2 }}>
        {playing ? 'DESLIGAR' : 'LIGAR'}
      </motion.button>
      <VuMeter level={level} active={playing} />
      <div className="row"><ParamKnob id="vol" /></div>
      <div className="jacks"><Jack id="out1" /><Jack id="out2" /></div>
    </Panel>
  )
}
