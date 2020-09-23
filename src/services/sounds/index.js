import React from 'react'
import { Howl } from 'howler'
import { connect } from 'react-redux'

import { SoundBindings } from './bindings'

let instance = null

//
// ─── SOUND BINDINGS ─────────────────────────────────────────────────────────────
// Export all bindings from here so we can import it easily / at the
// same time as SoundManager

export const Sounds = SoundBindings

//
// ─── SOUND MANAGER ──────────────────────────────────────────────────────────────
// Static class that can be used to easily trigger functions in the
// top-level SoundProvider component

export class SoundManager {
  constructor() {
    if (!instance) {
      instance = this
    }

    return instance
  }

  static getInstance = () => {
    return instance
  }

  static setTopLevelInstance = ref => {
    instance = ref
  }

  static play = (soundName, options = {}) => {
    if (!!instance) {
      instance._play(soundName, options)
    }
  }
}

//
// ─── SOUND PROVIDER ─────────────────────────────────────────────────────────────
// Top-level provider component that should wrap the entire app
// (similar to ReduxProvider)

export class SoundProvider extends React.Component {
  _play = (soundName, options = {}) => {
    try {
      const { soundsEnabled } = this.props

      if (!soundsEnabled) return false

      const howl = new Howl({ src: soundName, ...options })

      return howl.play()
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    return <>{this.props.children}</>
  }
}

const mapStateToProps = state => ({
  soundsEnabled: state.settings.soundsEnabled,
})

SoundProvider = connect(mapStateToProps, null, null, { forwardRef: true })(SoundProvider)
