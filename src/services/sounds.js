import React from 'react'
import { Howl } from 'howler'
import { connect } from 'react-redux'

let instance = null

//
// ─── SOUND MANAGER ──────────────────────────────────────────────────────────────
//

class SoundManager {
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
//

class SoundProvider extends React.Component {
  _play = (soundName, options = {}) => {
    try {
      const { soundsEnabled } = this.props

      if (!soundsEnabled) return false

      const [project, sound] = soundName.split('/')

      const soundFile = BINDINGS[project][sound]

      if (!soundFile) throw new Error(`Unable to find sound for "${soundName}"`)

      const howl = new Howl({ src: soundFile, ...options })

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

export { SoundManager, SoundProvider }

const BINDINGS = {
  FALLOUT: {
    SECTION_NEXT: 'fallout/audio/ui_pipboy_mode.wav',
    SECTION_PREV: 'fallout/audio/ui_pipboy_mode.wav',
    SECTION_CLICK: 'fallout/audio/ui_pipboy_mode.wav',
    SECTION_ERROR: 'fallout/audio/ui_menu_cancel.wav',

    LIST_ITEM_NEXT: 'fallout/audio/ui_menu_ok.wav',
    LIST_ITEM_PREV: 'fallout/audio/ui_menu_ok.wav',
    LIST_ITEM_SELECT: 'fallout/audio/ui_menu_ok.wav',
    LIST_ITEM_ERROR: 'fallout/audio/ui_menu_cancel.wav',

    TAB_NEXT: 'fallout/audio/ui_pipboy_tab.wav',
    TAB_PREV: 'fallout/audio/ui_pipboy_tab.wav',
    TAB_ERROR: 'misc/audio/meep_merp.mp3', //'fallout/audio/ui_menu_cancel.wav',
  },

  MISC: {
    MEEP_MERP: 'misc/audio/meep_merp.mp3',
  },
}
