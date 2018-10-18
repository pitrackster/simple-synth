import React, { Component } from 'react'
import logo from './logo.svg'
import './assets/css/App.css'
import Voice from './core/voice'
import VuMeter from './components/vu-meter-cmp'

class App extends Component {
  constructor() {
    super()
    this.ac = new AudioContext()
    this.master = this.ac.createGain()
    this.master.connect(this.ac.destination)
    this.master.gain.value = 1
    this.meter = null
  }

  playOneVoice() {
    const voice = new Voice(this.ac)
    voice.start(440, 1, this.master)
    window.setTimeout(() => {
      voice.stop(this.master)
    }, 3000)
  }

  playMultipleVoices() {
    const voice1 = new Voice(this.ac)
    const voice2 = new Voice(this.ac)
    const voice3 = new Voice(this.ac)
    const voice4 = new Voice(this.ac)
    voice1.start(440, 0.25, this.master)
    voice2.start(220, 0.25, this.master)
    voice3.start(880, 0.25, this.master)
    voice4.start(550, 0.25, this.master)
    window.setTimeout(() => {
      voice1.stop(this.master)
      voice2.stop(this.master)
      voice3.stop(this.master)
      voice4.stop(this.master)
    }, 3000)
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <button onClick={() => this.playOneVoice()}>One Voice</button>
          <button onClick={() => this.playMultipleVoices()}>Multiple Voices</button>

          <VuMeter ac={this.ac} node={this.master} />
        </header>
      </div>
    )
  }
}

export default App
