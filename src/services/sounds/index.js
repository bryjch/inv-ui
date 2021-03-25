import React from 'react'
import { Howl } from 'howler'
import { get, uniq } from 'lodash'
import { flatten } from 'flat'

import { SoundBindings } from './bindings'

import { getState } from '@zus/store'

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

  static preload = async (bindings = []) => {
    try {
      if (!!instance) {
        await instance._preload(bindings)
        return true
      }
      return false
    } catch (error) {
      console.error(error)
      return false
    }
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
  _preload = async (bindings = []) => {
    try {
      const soundNames = []

      // Find all the sounds that should be preloaded
      for (const binding of bindings) {
        try {
          const exists = get(SoundBindings, binding)

          if (!exists) throw new Error(`Sound binding doesn't exist.`)

          const sounds = flatten(exists)

          soundNames.push(...uniq(Object.values(sounds)))
        } catch (error) {
          console.error(error)
          console.warn(`Unable to find sound binding (${binding}). Skipping...`)
        }
      }

      for (const soundName of soundNames) {
        new Howl({ src: soundName })
      }
    } catch (error) {
      console.error(error)
    }
  }

  _play = (soundName, options = {}) => {
    try {
      const { soundsEnabled } = getState().settings

      if (!soundsEnabled) return false

      const howl = new Howl({
        src: soundName,
        volume: 0.5,
        ...options,
      })

      return howl.play()
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    return <>{this.props.children}</>
  }
}
