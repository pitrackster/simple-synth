

export default class Osc {
  constructor(ac){
    this.frequency = 440
    this.ac = ac
    this.voices = []
  }

  start(freq, volume, output) {
    // create a new oscillator
    let osc = this.ac.createOscillator()
    let vca = this.ac.createGain()
    vca.connect(output)
    osc.frequency.value = freq
    osc.type = 'sin'
    osc.detune.value = 0
    osc.start()


    // Silence oscillator gain
    vca.gain.setValueAtTime(0, this.ac.currentTime)
    // ATTACK
    vca.gain.linearRampToValueAtTime(volume, this.ac.currentTime)
    //vca.gain.linearRampToValueAtTime(volume, this.ac.currentTime + this.ENV.getAttack())
    // SUSTAIN
    //vca.gain.linearRampToValueAtTime(volume * this.ENV.getSustain(), this.ac.currentTime + this.ENV.getAttack() + this.ENV.getDecay())
    // connect
    osc.connect(vca)
    let voice = { osc: osc, vca: vca }
    this.voices[freq] = voice
  }

  stop(freq, output) {
    let voice = this.voices[freq]
    if (voice) {
      let vca = voice.vca
      let osc = voice.osc
      // Clear previous envelope values
      vca.gain.cancelScheduledValues(this.ac.currentTime)
      // RELEASE
      vca.gain.linearRampToValueAtTime(0, this.ac.currentTime)
      // Terminate after release
      window.setTimeout(function () {
        // Stop oscillator
        vca.gain.value = 0.0
        osc.stop(0)
        osc.disconnect(vca)
        osc = null
        vca.disconnect(output)
        delete this.voices[freq]
        vca = null
      }.bind(this), 0 * 1000)
    }
  }
}
