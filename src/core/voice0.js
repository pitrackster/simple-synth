

export default class Voice3 {
  constructor(state, output) {
    this.ac = state.ac
    this.state = state
    this.output = output
  }

  start(freq, volume) {
    // create a new oscillator
    this.vco = this.ac.createOscillator()
    //  this.vca = this.ac.createGain()
    //  this.vca.connect(this.output)


    this.vco.frequency.value = freq * Math.pow(2, 1)
    this.vco.type = this.type
    this.vco.detune.value = 0

    this.vco.gain = this.ac.createGain()
    this.vco.gain.gain.value = 0.5
    this.vco.connect(this.vco.gain)
    this.vco.gain.connect(this.output)

    this.vco.start()

    // Silence oscillator gain
    /*  this.vca.gain.setValueAtTime(0, this.ac.currentTime)
    // Handle ATTACK parameter
    this.vca.gain.linearRampToValueAtTime(volume, this.ac.currentTime + this.state.vcoEnv.attack)
    // Handle SUSTAIN parameter
    this.vca.gain.linearRampToValueAtTime(volume * this.state.vcoEnv.sustain, this.ac.currentTime + this.state.vcoEnv.attack + this.state.vcoEnv.decay)
    // connect
    this.vco.connect(this.vca)*/

  }

  setEnv(env) {
    this.ENV = env
  }

  stop() {
    // Clear previous envelope values... mmm does not work... make release not working ! on chrome and ff
    var now = this.ac.currentTime
    var release = now + Number(2)
    this.vco.stop(release)

  }
}
