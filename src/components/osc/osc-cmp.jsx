import React, { Component } from 'react'
import {PropTypes as T} from 'prop-types'
import './osc-cmp.css'
//import Knob from './../knob'

/**
 *
 * Simple component for the ui control of an oscillator configuration
 * Say you want a synth with two oscillators, put two of this component in you dom each one will set :
 * - the oscillator type (sine, square, sawtooth, triangle)
 * - the octave (@TODO)
 * - the detune level (@TODO)
 *
 *   <Knob
     value={this.props.octaveValue}
     min={-2}
     max={2}
     step={1}
     onChange={this.props.handleOctaveChange}
     width={80}
     height={80}
     angleArc={90}
     cursor={10}
     angleOffset={-45}
     stopper={true}
     showTicks={true}
     disableTextInput={true}
     title={'octave'}
   />

 *
 * @extends Component
 */


class Osc extends Component {
  render() {
    return (
      <div className="osc-item">
        <label>{this.props.title}</label>
        <div className="range">
          <input value={this.props.value} onChange={this.props.onChange} type="range" orient="vertical" step="1" min="0" max="3"></input>
          <div className="sliderticks">
            <label><i className="icon triangle"></i></label>
            <label><i className="icon sawtooth"></i></label>
            <label><i className="square icon"></i></label>
            <label><i className="sine icon"></i></label>
          </div>
        </div>
        <label>{this.props.label}</label>
        <hr/>
        <label>Octave {this.props.octaveValue}</label>
        <input value={this.props.octaveValue} onChange={(e) => this.props.handleOctaveChange(e)} type="range" min="-2" max="2" step="1"></input>

      </div>
    )
  }
}

Osc.propTypes = {
  onChange: T.func,
  handleOctaveChange: T.func,
  octaveValue: T.number,
  label: T.string.isRequired,
  value: T.number.isRequired,
  title: T.string.isRequired
}
export default Osc
