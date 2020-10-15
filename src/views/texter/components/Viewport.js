import React from 'react'

import { MonogatariOverlay } from './monogatari'
import { jump } from './monogatari/helpers'

export class Viewport extends React.Component {
  render() {
    return (
      <div id="viewport">
        <MonogatariOverlay />
        <div onClick={() => jump('INTRO_2B')}>2B</div>
        <div onClick={() => jump('INTRO_9S')}>9S</div>
        <div onClick={() => jump('INTRO_A2')}>A2</div>
      </div>
    )
  }
}

export default Viewport
