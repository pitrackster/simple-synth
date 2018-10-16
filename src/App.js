import React, { Component } from 'react'
import logo from './logo.svg'
import './assets/css/App.css'
import Osc from './core/osc'

class App extends Component {
  constructor(){
    super()
    this.ac = new AudioContext()
    this.osc = new Osc(this.ac)
    this.master = this.ac.createGain()
    this.master.connect(this.ac.destination)
    this.master.gain.value = 0.5
    this.osc.start(440, 0.5, this.master)
    window.setTimeout(() => {
      this.osc.stop(440, this.master)
    }, 1000)

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
        </header>
      </div>
    )
  }
}

export default App
