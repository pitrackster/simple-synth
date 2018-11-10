


var Voice = function (note, dsp) {

  var now = dsp.ctx.currentTime

  //Volume Envelope
  this.volEnv = dsp.ctx.createGain()
  this.volEnv.gain.cancelScheduledValues(now)
  this.volEnv.gain.setValueAtTime(0, now)
  this.volEnv.gain.linearRampToValueAtTime(1, now + Number(dsp.volEnv.attack))
  this.volEnv.gain.setTargetAtTime(Number(dsp.volEnv.sustain), now + Number(dsp.volEnv.attack), Number(dsp.volEnv.decay) + 0.001)
  this.volEnv.connect(dsp.voiceChain)

  //Filter
  this.filter = dsp.ctx.createBiquadFilter()
  this.filter.type = dsp.filter.type
  this.filter.Q.value = dsp.filter.Q.value
  this.filter.frequency.value = Math.pow(2, dsp.filter.cutoff)
  this.filter.connect(this.volEnv)

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

  //Oscillator 1
  this.osc1 = dsp.ctx.createOscillator()
  this.note = note
  this.osc1.frequency.value = note * Math.pow(2, dsp.osc1.octave)
  this.osc1.detune.value = dsp.osc1.detune.value
  this.osc1.type = dsp.osc1.type
  this.osc1.gain = dsp.ctx.createGain()
  this.osc1.gain.gain.value = 1 - (Number(dsp.oscMix) / 100)
  this.osc1.connect(this.osc1.gain)
  this.osc1.gain.connect(this.filter)
  this.osc1.start(now)

  //Oscillator 2
  this.osc2 = dsp.ctx.createOscillator()
  this.note = note
  this.osc2.frequency.value = note * Math.pow(2, dsp.osc2.octave)
  this.osc2.detune.value = dsp.osc2.detune.value
  this.osc2.type = dsp.osc2.type
  this.osc2.gain = dsp.ctx.createGain()
  this.osc2.gain.gain.value = 1 - this.osc1.gain.gain.value
  this.osc2.connect(this.osc2.gain)
  this.osc2.gain.connect(this.filter)
  this.osc2.start(now)

}

Voice.prototype.noteOff = function (dsp) {
  var now = dsp.ctx.currentTime
  var release = now + Number(dsp.volEnv.release)
  this.volEnv.gain.cancelScheduledValues(now)
  this.volEnv.gain.setValueAtTime(this.volEnv.gain.value, now)
  this.volEnv.gain.setTargetAtTime(0, now, Number(dsp.volEnv.release)/10)
  this.filter.detune.cancelScheduledValues(now)
  this.filter.detune.setTargetAtTime(0, now, Number(dsp.filterEnv.release)/10)
    	this.osc1.stop(release)
  this.osc2.stop(release)
}

Voice.prototype.setOsc1Type = function (value) {
  this.osc1.type = value
}

Voice.prototype.setOsc2Type = function (value) {
  this.osc2.type = value
}

Voice.prototype.setOsc1Octave = function (value) {
  this.osc1.frequency.value = this.note * Math.pow(2, value)
}

Voice.prototype.setOsc2Octave = function (value) {
  this.osc2.frequency.value = this.note * Math.pow(2, value)
}

Voice.prototype.setOsc1Detune = function (value) {
  this.osc1.detune.value = value
}

Voice.prototype.setOsc2Detune = function (value) {
  this.osc2.detune.value = value
}

Voice.prototype.setOscMix = function (value) {
  this.osc1.gain.gain.value = 1 - (value/100)
  this.osc2.gain.gain.value = 1 - this.osc1.gain.gain.value
}

Voice.prototype.setFilterType = function (value) {
  this.filter.type = value
}

Voice.prototype.setFilterFreq = function (value) {
  this.filter.frequency.value = Math.pow(2, value)
}

Voice.prototype.setFilterQ = function (value) {
  this.filter.Q.value = value
}

Voice.prototype.setFilterLFOFreq = function (value) {
  this.filterLFO.frequency.value = value
}

Voice.prototype.setFilterLFOGain = function (value) {
  this.filterLFOGain.gain.value = value
}

return Voice
