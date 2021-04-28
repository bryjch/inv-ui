import localForage from 'localforage'
import { set, clone, uniq, without } from 'lodash'

import { initialState, SharedState } from './store'

const reducers = (state = initialState, action: any): SharedState => {
  switch (action.type) {
    //
    // ─── APP ─────────────────────────────────────────────────────────
    //

    case 'SET_ACTIVE_GAME':
      return { ...state, app: { ...state.app, activeGame: action.activeGame } }

    //
    // ─── SETTINGS ────────────────────────────────────────────────────
    //

    case 'LOAD_SETTINGS':
      return { ...state, settings: action.settings }

    case 'UPDATE_SETTINGS_OPTION':
      let updatedSettings = set(clone(state.settings), action.option, action.value)

      localForage.setItem('INVUI::SETTINGS', updatedSettings)

      return { ...state, settings: updatedSettings }

    //
    // ─── UI ──────────────────────────────────────────────────────────
    //

    case 'SET_SIDEBAR_OPEN':
      return { ...state, ui: { ...state.ui, sidebarOpen: action.isOpen } }

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
