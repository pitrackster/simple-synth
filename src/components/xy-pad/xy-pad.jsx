import React, { Component } from 'react'
import {PropTypes as T} from 'prop-types'
import './xy-pad.css'


class XYPad extends Component {

  constructor(props) {
    super(props)
    this.width = 350
    this.height = 350
    this.state = {
      pressed : false,
      padBgColor: '#258975'
    }
  }

  componentDidMount = () => {
    this.canvasPosition = this.bgLayer.getBoundingClientRect()
    this.canvasHeight = this.canvasPosition.bottom - this.canvasPosition.top
    this.canvasWidth = this.canvasPosition.right - this.canvasPosition.left
    this.draw()
    this.ctx2 = this.cursorLayer.getContext('2d')
  }

  draw = () => {
    this.ctx = this.bgLayer.getContext('2d')

    this.ctx.beginPath()
    // horizontal line
    this.ctx.moveTo(0, this.canvasHeight / 2)
    this.ctx.lineTo(this.canvasWidth, this.canvasHeight / 2)
    this.ctx.stroke()
    // vertical line
    this.ctx.moveTo(this.canvasWidth / 2, 0)
    this.ctx.lineTo(this.canvasWidth / 2, this.canvasHeight)
    this.ctx.stroke()
    // draw axis ticks
    this.ctx.moveTo(0, this.canvasHeight / 2)
    const range = Math.round(this.canvasWidth / 10)
    for(let i = 1; i < 5; i++) {
      // left x-axis tick bars
      this.ctx.moveTo(i * range, (this.canvasHeight / 2) - range / 4)
      this.ctx.lineTo(i * range, (this.canvasHeight / 2) + range / 4)
      this.ctx.stroke()
      // right x-axis tick bars
      this.ctx.moveTo((this.canvasWidth / 2) + i * range, (this.canvasHeight / 2) - range / 4)
      this.ctx.lineTo((this.canvasWidth / 2) + i * range, (this.canvasHeight / 2) + range / 4)
      this.ctx.stroke()
      // top y-axis tick bars
      this.ctx.moveTo((this.canvasWidth / 2) - range / 4, i * range)
      this.ctx.lineTo((this.canvasWidth / 2) + range / 4, i * range)
      this.ctx.stroke()
      // bottom y-axis tick bars
      this.ctx.moveTo((this.canvasWidth / 2) - range / 4, (this.canvasHeight / 2) + i * range)
      this.ctx.lineTo((this.canvasWidth / 2) + range / 4, (this.canvasHeight / 2) + i * range)
      this.ctx.stroke()
    }
  }

  drawCursor = (data) => {


    this.ctx2.beginPath()
    this.ctx2.shadowBlur = this.width / 30
    this.ctx2.shadowColor =  this.props.bgColor
    this.ctx2.arc(data.x, data.y2, this.width / 20, 0, 2 * Math.PI)
    this.ctx2.fillStyle =  this.state.padBgColor
    this.ctx2.strokeStyle = `hsl(${data.x + data.y}, 60%, 60%)`
    this.ctx2.lineWidth=5
    this.ctx2.fill()
    this.ctx2.stroke()
  }

  handleMove = (e) => {
    const data = this.getCoordinates(e)
    if(this.state.pressed) {
      this.ctx2.clearRect(0, 0, this.cursorLayer.width, this.cursorLayer.height)
      this.drawCursor(data)
    }

    this.props.onMove(data)
  }

  handleDown = (e) => {
    this.setState(Object.assign(this.state, {pressed: true}))
    const data = this.getCoordinates(e)
    this.drawCursor(data)
    this.props.onPressStart(data)
  }

  getCoordinates(e) {
    const x = e.clientX - this.canvasPosition.left
    const y = this.canvasPosition.bottom - e.clientY //e.clientY - this.canvasPosition.top => inversed, bottom = max top = min...
    const percentX = x * 100 / this.canvasWidth
    const percentY = y * 100 / this.canvasHeight
    return {
      percentX: percentX,
      percentY: percentY,
      clientX: e.clientX,
      clientY: e.clientY,
      x: x,
      y: y,
      y2 : e.clientY - this.canvasPosition.top
    }
  }

  handleUp = (e) => {
    this.setState(Object.assign(this.state, {pressed: false}))
    this.props.onPressStop()
    this.ctx2.clearRect(0, 0, this.cursorLayer.width, this.cursorLayer.height)
  }

  render = () => {
    return (
      <div className={'stage'} style={{backgroundColor: this.props.bgColor, width: this.width + 'px',  height: this.height + 'px'}}>
        <canvas className={'cursor-layer'} onMouseDown={(e) => this.handleDown(e)} onMouseMove={(e) => this.handleMove(e)} onMouseUp={() => this.handleUp()} width={this.width} height={this.height} ref={canvas => {
          this.cursorLayer = canvas
        }}>
        </canvas>
        <canvas  style={{backgroundColor: '#258975'}}  onMouseDown={(e) => this.handleDown(e)} onMouseMove={(e) => this.handleMove(e)} onMouseUp={() => this.handleUp()} className={'background-layer'} width={this.width} height={this.height} ref={canvas => {
          this.bgLayer = canvas
        }}>
        </canvas>
      </div>
    )
  }

}

XYPad.propType = {
  onPressStart: T.func.isRequired,
  onPressStop: T.func.isRequired,
  onMove: T.func.isRequired,
  bgColor: T.string
}

XYPad.defaultProps = {
  bgColor: '#eee'
}

export default XYPad
