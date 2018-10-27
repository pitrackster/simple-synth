import React, { Component } from 'react'
import './App.css'
import Voice from './core/voice'
import VuMeter from './components/vu-meter/vu-meter-cmp'
import Osc from './components/osc/osc-cmp'
import XYPad from './components/xy-pad/xy-pad'

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

  vco1OctaveChanged = (value) => {
    this.setState(Object.assign(this.state.vco1, {octave: value}))
  }

  vco2OctaveChanged = (value) => {
    this.setState(Object.assign(this.state.vco2, {octave: value}))
  }

  vco1TypeChanged(e) {
    this.setState(Object.assign(this.state.vco1, {type: this.state.types[e.target.value]}))
  }

  vco2TypeChanged(e) {
    this.setState(Object.assign(this.state.vco2, {type: this.state.types[e.target.value]}))

  }

  playOneVoice() {
    const voice = new Voice(this.ac, this.state.vco1.type)
    const voice2 = new Voice(this.ac, this.state.vco2.type)
    const freq = this.state.freq
    voice.start(freq * this.state.vco1.octave, 0.5, this.master)
    voice2.start(freq * this.state.vco2.octave, 0.5, this.master)
    window.setTimeout(() => {
      voice.stop(this.master)
      voice2.stop(this.master)
    }, 3000)
  }

  playMultipleVoices() {
    const osc1Freq = 440
    const osc2Freq = 320
    const voice1 = new Voice(this.ac, this.state.vco1.type)
    const voice2 = new Voice(this.ac, this.state.vco1.type)
    const voice3 = new Voice(this.ac, this.state.vco2.type)
    const voice4 = new Voice(this.ac, this.state.vco2.type)
    voice1.start(osc1Freq * this.state.vco1.octave, 0.25, this.master)
    voice2.start(osc1Freq * this.state.vco1.octave, 0.25, this.master)
    voice3.start(osc2Freq * this.state.vco2.octave, 0.25, this.master)
    voice4.start(osc2Freq * this.state.vco2.octave, 0.25, this.master)
    window.setTimeout(() => {
      voice1.stop(this.master)
      voice2.stop(this.master)
      voice3.stop(this.master)
      voice4.stop(this.master)
    }, 3000)
  }

  handleMouseMove(data) {
    // document.body.style.backgroundColor = `hsl(${event.clientX}, 60%, 60%)
    // this.setState(Object.assign(this.state, {padBgColor: `hsl(${data.clientX}, 60%, 60%)`}))
    if(this.state.playing) {
      const frequency = Math.round(data.percentY * 1000 / 100)
      const vca1Gain = (100 - data.percentX) / 100
      const vca2Gain = data.percentX / 100
      console.log(vca1Gain, vca2Gain, data.percentX)
      this.voices.forEach((voice, index) => {
        voice.vco.frequency.value =  index === 0 ? frequency * this.state.vco1.octave : frequency * this.state.vco2.octave
        const gain = index === 0 ? vca1Gain : vca2Gain
        voice.vca.gain.setValueAtTime(gain, this.ac.currentTime)
      })
      this.setState(Object.assign(this.state, {freq: frequency}))
    }
  }

  onPressStart = (data) => {
    const frequency = Math.round(data.percentY * 1000 / 100)
    const voice1 = new Voice(this.ac, this.state.vco1.type, this.state.vcoEnv)
    const voice2 = new Voice(this.ac, this.state.vco2.type, this.state.vcoEnv)
    this.voices = [voice1,voice2]
    voice1.start(frequency * this.state.vco1.octave, 1 / this.voices.length, this.master)
    voice2.start(frequency * this.state.vco2.octave, 1 / this.voices.length, this.master)

    this.setState(Object.assign(this.state, {playing: true, freq: frequency}))
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
        <p>The idea is (once again) to learn the basic's of react and see what is possible to do with the (fantastic) WebAudio API</p>
        <button onClick={() => this.playOneVoice()}>Trigger one Voice</button>
        <button onClick={() => this.playMultipleVoices()}>Trigger multiple Voices</button>
        <div className="synth">
          <div className="oscillators">
            <Osc
              octaveValue={this.state.vco1.octave}
              handleOctaveChange={this.vco1OctaveChanged}
              value={this.state.types.indexOf(this.state.vco1.type)}
              title={'OSC1'}
              label={this.state.vco1.type}
              onChange={(e) => this.vco1TypeChanged(e)} />
            <Osc
              octaveValue={this.state.vco2.octave}
              handleOctaveChange={this.vco2OctaveChanged}
              value={this.state.types.indexOf(this.state.vco2.type)}
              title={'OSC2'}
              label={this.state.vco2.type}
              onChange={(e) => this.vco2TypeChanged(e)} />
          </div>
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
