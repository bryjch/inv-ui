import localForage from 'localforage'
import { set, clone, uniq, without } from 'lodash'

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

    //
    // ─── UI ──────────────────────────────────────────────────────────
    //

    case 'SET_UI_PANEL_ACTIVE':
      return {
        ...state,
        ui: { ...state.ui, activePanels: uniq([...state.ui.activePanels, action.panelName]) },
      }

    case 'SET_UI_PANEL_INACTIVE':
      return {
        ...state,
        ui: { ...state.ui, activePanels: without(state.ui.activePanels, action.panelName) },
      }

    case 'POP_UI_PANEL':
      return {
        ...state,
        ui: {
          ...state.ui,
          activePanels: state.ui.activePanels.slice(0, state.ui.activePanels.length - 1),
        },
      }

    default:
      return state
  }
}

export default reducers
