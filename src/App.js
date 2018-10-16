import React, { Component } from 'react'
import logo from './logo.svg'
import './assets/css/App.css'
//import Osc from './core/osc'
import Note from './core/note'

class App extends Component {
  constructor(){
    super()
    this.ac = new AudioContext()
    this.master = this.ac.createGain()
    this.master.connect(this.ac.destination)
    this.master.gain.value = 1

  }

  playOneNote() {
    const note1 = new Note(this.ac)
    note1.start(440, 1, this.master)
    window.setTimeout(() => {
      note1.stop(440, this.master)
    }, 1000)
  }

  playThreeNotes() {
    const note1 = new Note(this.ac)
    const note2 = new Note(this.ac)
    const note3 = new Note(this.ac)
    const note4 = new Note(this.ac)
    note1.start(440, 0.25, this.master)
    note2.start(220, 0.25, this.master)
    note3.start(880, 0.25, this.master)
    note4.start(550, 0.25, this.master)
    window.setTimeout(() => {
      note1.stop(440, this.master)
      note2.stop(220, this.master)
      note3.stop(880, this.master)
      note4.stop(550, this.master)
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
          <button onClick={() => this.playOneNote()}>One</button>
          <button onClick={() => this.playThreeNotes()}>3</button>
        </header>
      </div>
    )
  }
}

export default App
