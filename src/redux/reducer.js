import localForage from 'localforage'
import { set, clone } from 'lodash'

const reducers = (state = {}, action) => {
  switch (action.type) {
    //
    // ─── SETTINGS ────────────────────────────────────────────────────
    //

    case 'LOAD_SETTINGS':
      return { ...state, settings: action.settings }

    case 'UPDATE_SETTINGS_OPTION':
      let updatedSettings = set(clone(state.settings), action.option, action.value)

      localForage.setItem('invenstorySettings', updatedSettings)

      return { ...state, settings: updatedSettings }

    case 'SHOW_MONOGATARI':
      return { ...state, monogatari: { active: true, label: action.label } }

    case 'HIDE_MONOGATARI':
      return { ...state, monogatari: { active: false, label: null } }

    default:
      return state
  }
}

export default reducers
