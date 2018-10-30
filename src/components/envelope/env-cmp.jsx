import React, { Component } from 'react'
import { PropTypes as T } from 'prop-types'
import './env-cmp.css'


class Env extends Component {

  render = () => {
    return (
      <div className={'env-container'}>
        <div className={'range-item'}>
          <label>{this.props.env.attack}</label>
          <input value={this.props.env.attack} onChange={(e) => this.props.onChange('attack', e.target.value)} type="range" orient="vertical" step="0.5" max="10" min="0" />
          <label>A</label>
        </div>
        <div className={'range-item'}>
          <label>{this.props.env.decay}</label>
          <input value={this.props.env.decay} onChange={(e) => this.props.onChange('decay', e.target.value)} type="range" orient="vertical" step="0.1" max="5" min="0" />
          <label>D</label>
        </div>
        <div className={'range-item'}>
          <label>{this.props.env.sustain}</label>
          <input value={this.props.env.sustain} onChange={(e) => this.props.onChange('sustain', e.target.value)} type="range" step="0.1" orient="vertical" max="1" min="0" />
          <label>S</label>
        </div>
        <div className={'range-item'}>
          <label>{this.props.env.release}</label>
          <input value={this.props.env.release} onChange={(e) => this.props.onChange('release', e.target.value)} type="range" step="0.5" orient="vertical" max="10" min="0" />
          <label>R</label>
        </div>

      </div>
    )
  }
}




Env.propTypes = {
  onChange: T.func.isRequired,
  env: T.object.isRequired
}

export default Env
