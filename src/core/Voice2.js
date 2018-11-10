/*

detune  <input type="range" min="-24" max="24" ng-model="dsp.osc1.detune.value">

<label>Frequency</label>
    <input type="range" ng-model="dsp.filter.cutoff" min="0" max="15" step="0.1">
    <label>Resonance</label>
    <input type="range" ng-model="dsp.filter.Q.value" min="0" max="20" step="0.1">
    <hr>
    <label>Mod Env</label>
    <input type="range" ng-model="dsp.filter.modEnv" min="0" max="100" step="1">
    <hr>
    <label>Filter LFO frequency</label>
    <input type="range" ng-model="dsp.filterLFO.frequency.value" min="0" max="20" step="0.1">
    <label>Filter LFO gain</label>
<input type="range" ng-model="dsp.filterLFOGain.gain.value" min="0" max="150" step="0.1">

 */

export default class Voice2 {
  constructor(state, note, output) {
    const now = state.ac.currentTime
    this.volEnv = state.ac.createGain()
    this.volEnv.gain.cancelScheduledValues(now)
    this.volEnv.gain.setValueAtTime(0, now)
    this.volEnv.gain.linearRampToValueAtTime(1, now + state.vcoEnv.attack)
    this.volEnv.gain.setTargetAtTime(Number(state.vcoEnv.sustain), now + Number(state.vcoEnv.attack), Number(state.vcoEnv.decay) + 0.001)
    this.volEnv.connect(output)

    this.filter = state.ac.createBiquadFilter()
    this.filter.type = state.filter.type
    this.filter.Q.value = state.filter.q
    this.filter.frequency.value = Math.pow(2, state.filter.cutoff)
    this.filter.connect(this.volEnv)

    /*
    //Filter Envelope
    this.filter.attackLevel = dsp.filter.modEnv * 72
    this.filter.sustainLevel = this.filter.attackLevel * dsp.filterEnv.sustain
    this.filter.detune.setValueAtTime(0, now)
    this.filter.detune.linearRampToValueAtTime(this.filter.attackLevel, now + Number(dsp.filterEnv.attack))
    this.filter.detune.setTargetAtTime(this.filter.sustainLevel, now + Number(dsp.filterEnv.attack), Number(dsp.filterEnv.decay))

    //Create Filter LFO
    this.filterLFOGain = dsp.ctx.createGain()
    this.filterLFOGain.gain.value = dsp.filterLFOGain.gain.value
    this.filterLFOGain.connect(this.filter.frequency)
    this.filterLFO = dsp.ctx.createOscillator()
    this.filterLFO.frequency.value = dsp.filterLFO.frequency.value
    this.filterLFO.connect(this.filterLFOGain)
    this.filterLFO.start(now)
*/
    this.osc1 = state.ac.createOscillator()
    this.osc1.frequency.value = note * Math.pow(2, state.vco1.octave)
    this.osc1.detune.value = state.vco1.detune
    this.osc1.type = state.vco1.type
    this.osc1.gain = state.ac.createGain()
    this.osc1.gain.gain.value = 1 - (Number(state.vcoMix) / 100)
    this.osc1.connect(this.osc1.gain)
    this.osc1.gain.connect(this.filter)
    this.osc1.start(now)

    //Oscillator 2
    this.osc2 = state.ac.createOscillator()
    this.osc2.frequency.value = note * Math.pow(2, state.vco2.octave)
    this.osc2.detune.value = state.vco2.detune
    this.osc2.type = state.vco2.type
    this.osc2.gain = state.ac.createGain()
    this.osc2.gain.gain.value = 1 - this.osc1.gain.gain.value
    this.osc2.connect(this.osc2.gain)
    this.osc2.gain.connect(this.filter)
    this.osc2.start(now)

    this.note = note
  }

  noteOff = (state) => {
    const now = state.ac.currentTime
    const release = now + Number(2)
    this.volEnv.gain.cancelScheduledValues(now)
    this.volEnv.gain.setValueAtTime(this.volEnv.gain.value, now)
    this.volEnv.gain.setTargetAtTime(0, now, Number(state.vcoEnv.release)/10)
    //this.filter.detune.cancelScheduledValues(now)
    //this.filter.detune.setTargetAtTime(0, now, Number(2)/10)
    this.osc1.stop(release)
    this.osc2.stop(release)
  }


  setOsc1Type = (value) => {
    this.osc1.type = value
  }

  setOsc2Type = (value) => {
    this.osc2.type = value
  }

  setOsc1Octave = (value) => {
    this.osc1.frequency.value = this.note * Math.pow(2, value)
  }

  setOsc2Octave = (value) => {
    this.osc2.frequency.value = this.note * Math.pow(2, value)
  }

  setOsc1Detune = (value) => {
    this.osc1.detune.value = value
  }

  setOsc2Detune = (value) => {
    this.osc2.detune.value = value
  }

  setOscMix = (value) => {
    this.osc1.gain.gain.value = 1 - (value/100)
    this.osc2.gain.gain.value = 1 - this.osc1.gain.gain.value
  }

  setFilterType = (value) => {
    this.filter.type = value
  }

  setFilterFreq = (value) => {
    this.filter.frequency.value = Math.pow(2, value)
  }

  setFilterQ = (value) => {
    this.filter.Q.value = value
  }

  setFilterLFOFreq = (value) => {
    this.filterLFO.frequency.value = value
  }

  setFilterLFOGain = (value) => {
    this.filterLFOGain.gain.value = value
  }
}
