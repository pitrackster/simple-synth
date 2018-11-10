import React, { Component } from 'react'
import {PropTypes as T} from 'prop-types'
import './filter-cmp.css'

/*

        <input onChange={(e) => this.props.onChange('gain', e)} orient="vertical" type="range" min="1" max="15" step="1" value={this.props.gain}/>


        <label>Frequency</label>
            <input type="range" ng-model="dsp.filter.cutoff" min="0" max="15" step="0.1">
            <label>Resonance</label>
            <input type="range" ng-model="dsp.filter.Q.value" min="0" max="20" step="0.1">
            <hr>
            <label>Mod Env</label>
            <input type="range" ng-model="dsp.filter.modEnv" min="0" max="100" step="1">
            <hr>
            <label>Filter LFO frequency</label>
            <input type="range" ng-model="dsp.filterLFO.frequency.value" min="0" max="20" step="0.1">
            <label>Filter LFO gain</label>
        <input type="range" ng-model="dsp.filterLFOGain.gain.value" min="0" max="150" step="0.1">
 */

class Filter extends Component {


  render = () => {
    console.log(this.props)
    return (
      <div className={'filter-container'}>
        <div className={'range-item'}>
          <label>{this.props.q}</label>
          <input onChange={(e) => this.props.onChange('q', e)} orient="vertical" type="range" min="1" max="20" step="0.1" value={this.props.q}/>
          <label>Q</label>
        </div>
        <div className={'range-item'}>
          <label>{Math.pow(2, this.props.cutoff)}</label>
          <input onChange={(e) => this.props.onChange('cutoff', e)} orient="vertical" type="range" min="0" max="15" step="0.1" value={this.props.cutoff}/>
          <label>F</label>
        </div>
        <div className="radio-group">
          <label className="labeled-radio">
            <input onChange={(e) => this.props.onChange('type', e)} type="radio" value="lowpass" name="type" checked={this.props.type === 'lowpass'} />
          lowpass
          </label>

          <label className="labeled-radio">
            <input onChange={(e) => this.props.onChange('type', e)} type="radio" value="highpass" name="type" checked={this.props.type === 'highpass'} />
          highpass
          </label>
        </div>
      </div>
    )
  }
}

Filter.propTypes = {
  cutoff: T.number.isRequired,
  type: T.string.isRequired,
  onChange: T.func
}



export default Filter
