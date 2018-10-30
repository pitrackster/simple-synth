import React, { Component } from 'react'
import {PropTypes as T} from 'prop-types'
import './filter-cmp.css'


class Filter extends Component {


  render = () => {
    console.log(this.props)
    return (
      <div>
        <input onChange={(e) => this.props.onChange('q', e)} orient="vertical" type="range" min="1" max="100" step="10" value={this.props.q}/>
        <input onChange={(e) => this.props.onChange('gain', e)} orient="vertical" type="range" min="1" max="15" step="1" value={this.props.gain}/>
        <input onChange={(e) => this.props.onChange('freq', e)} orient="vertical" type="range" min="40" max="1000" step="10" value={this.props.frequency}/>
        <input onChange={(e) => this.props.onChange('type', e)} type="radio" value="lowpass" name="type" selected={this.props.type === 'lowpass'} />
        <input onChange={(e) => this.props.onChange('type', e)} type="radio" value="highpass" name="type" selected={this.props.type === 'highpass'} />
      </div>
    )
  }
}

Filter.propTypes = {
  gain: T.number.isRequired,
  frequency: T.number.isRequired,
  type: T.string.isRequired,
  onChange: T.func
}



export default Filter
