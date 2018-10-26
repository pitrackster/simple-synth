

export default class Voice {
  constructor(ac, type, env){
    this.ac = ac
    this.ENV = env ? env : {
      attack: 0, // seconds
      decay: 1,  // seconds after decay time sustain gain level will be applied
      sustain: 0.1, // gain value (0 <= value <= 1)
      release: 0.8 // seconds
    }
    this.type = type
  }

  start(freq, volume, output) {
    // create a new oscillator
    this.vco = this.ac.createOscillator()
    this.vca = this.ac.createGain()
    this.vca.connect(output)
    this.vco.frequency.value = freq
    this.vco.type = this.type
    this.vco.detune.value = 0
    this.vco.start()

    // Silence oscillator gain
    this.vca.gain.setValueAtTime(0, this.ac.currentTime)
    // Handle ATTACK parameter
    this.vca.gain.linearRampToValueAtTime(volume, this.ac.currentTime + this.ENV.attack)
    // Handle SUSTAIN parameter
    this.vca.gain.linearRampToValueAtTime(volume * this.ENV.sustain, this.ac.currentTime + this.ENV.attack + this.ENV.decay)
    // connect
    this.vco.connect(this.vca)

  }

  setEnv(env) {
    this.ENV = env
  }

  stop(output) {
    // Clear previous envelope values... mmm does not work... make release not working ! on chrome and ff
    //this.vca.gain.cancelScheduledValues(this.ac.currentTime)
    // RELEASE
    this.vca.gain.linearRampToValueAtTime(0, this.ac.currentTime + this.ENV.release)
    // Terminate after release
    window.setTimeout(() => {
      // Stop oscillator
      this.vca.gain.value = 0.0
      this.vco.stop(0)
      this.vco.disconnect(this.vca)
      this.vco = null
      this.vca.disconnect(output)
      this.vca = null
    }, this.ENV.release * 1000)

  }
}
