import React, { Component } from 'react'
import './App.css'
import Voice from './core/voice'
import VuMeter from './components/vu-meter/vu-meter-cmp'
import Osc from './components/osc/osc-cmp'
import XYPad from './components/xy-pad/xy-pad'
import Env from './components/envelope/env-cmp'

class App extends Component {
  constructor(props) {
    super(props)
    this.ac = new AudioContext()
    this.master = this.ac.createGain()
    this.master.connect(this.ac.destination)
    this.master.gain.value = 1
    this.meter = null

    this.initialState = {
      padBgColor: '#eee',
      ac: this.ac,
      master: this.master,
      freq: 440,
      vcoEnv: {
        attack: 0.5, // seconds
        decay: 1,  // seconds after decay time sustain gain level will be applied
        sustain: 1, // gain value (0 <= value <= 1)
        release: 0.5 // seconds
      },
      filter: {
        freq: 0,
        type: 'LP',
        res: 0,
        env : {
          attack: 0, // seconds
          decay: 1,  // seconds after decay time sustain gain level will be applied
          sustain: 1, // gain value (0 <= value <= 1)
          release: 0 // seconds
        }
      },
      vco1: {
        type: 'sine',
        detune: 0,
        octave: 1
      },
      vco2: {
        type: 'sine',
        detune: 0,
        octave: 1
      },
      types: [
        'sine',
        'square',
        'sawtooth',
        'triangle'
      ],
      playing: false
    }

    this.state = this.initialState
  }

  updateVcoOctave = (vco, value) => {
    this.setState(Object.assign(vco, {octave: value}))
  }

  updateVcoType(vco, event) {
    this.setState(Object.assign(vco, {type: this.state.types[event.target.value]}))
  }

  handleMouseMove(data) {
    if(this.state.playing) {
      const frequency = this.getFrequency(data)
      const gains = this.getVcaGain(data)
      this.voices.forEach((voice, index) => {
        voice.vco.frequency.value =  index === 0 ? frequency * this.state.vco1.octave : frequency * this.state.vco2.octave
        const gain = index === 0 ? gains.gain1 : gains.gain2
        voice.vca.gain.setValueAtTime(gain, this.ac.currentTime)
      })
      this.setState(Object.assign(this.state, {freq: frequency}))
    }
  }

  getVcaGain = (data) => {
    const vca1Gain = (100 - data.percentX) / 100
    const vca2Gain = data.percentX / 100
    return {gain1: vca1Gain, gain2: vca2Gain}
  }

  getFrequency = (data) => {
    return Math.round(data.percentY * 1000 / 100)
  }

  onPressStart = (data) => {
    const frequency = this.getFrequency(data)
    const gains = this.getVcaGain(data)
    const voice1 = new Voice(this.ac, this.state.vco1.type, this.state.vcoEnv)
    const voice2 = new Voice(this.ac, this.state.vco2.type, this.state.vcoEnv)
    this.voices = [voice1, voice2]
    voice1.start(frequency * this.state.vco1.octave, gains.gain1, this.master)
    voice2.start(frequency * this.state.vco2.octave, gains.gain2, this.master)

    this.setState(Object.assign(this.state, {playing: true, freq: frequency}))
  }

  oscEnvChanged = (prop, value) => {
    const clonedEnv = Object.assign({}, this.state.vcoEnv)
    clonedEnv[prop] = Number(value)
    this.setState(Object.assign(this.state, {vcoEnv: clonedEnv}))
  }

  onPressStop = () => {
    this.voices.forEach(voice => {
      voice.stop(this.master)
    })
    this.voices = []
    this.setState(Object.assign(this.state, {playing: false}))
  }


  render() {
    return (
      <div className="app">
        <h3>Simple Synth built with React</h3>
        <p>Play with react and the WebAudio API</p>
        <div className="synth">
          <div className="oscillators">
            <Osc
              octaveValue={this.state.vco1.octave}
              handleOctaveChange={(value) => this.updateVcoOctave(this.state.vco1, value)}
              value={this.state.types.indexOf(this.state.vco1.type)}
              title={'OSC1'}
              label={this.state.vco1.type}
              onChange={(e) => this.updateVcoType(this.state.vco1, e)} />
            <Osc
              octaveValue={this.state.vco2.octave}
              handleOctaveChange={(value) => this.updateVcoOctave(this.state.vco2, value)}
              value={this.state.types.indexOf(this.state.vco2.type)}
              title={'OSC2'}
              label={this.state.vco2.type}
              onChange={(e) => this.updateVcoType(this.state.vco2, e)} />
          </div>
          <Env env={this.state.vcoEnv} onChange={this.oscEnvChanged}/>
          <XYPad bgColor={this.state.padBgColor} onPressStart={this.onPressStart} onPressStop={this.onPressStop} onMove={(data) => this.handleMouseMove(data)} />
          <VuMeter ac={this.state.ac} node={this.state.master} />
          <div style={{width:350}}>
            <label>{this.state.freq}Hz</label>
          </div>

        </div>

      </div>
    )
  }
}

export default App
