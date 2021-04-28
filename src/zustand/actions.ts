import { merge } from 'lodash'
import localForage from 'localforage'

import { dispatch, getState } from './store'

import { Game } from '@shared/data/definitions'

//
// ─── APP ────────────────────────────────────────────────────────────────────────
//

export const setActiveGameAction = async (game: Game, options?: { updateUrl: boolean }) => {
  try {
    const { updateUrl = true } = options || {}

    await dispatch({ type: 'SET_ACTIVE_GAME', activeGame: game })

    if (updateUrl) window.history.replaceState(null, '', `/${game.id}`)
  } catch (error) {
    console.error(error)
  }
}

//
// ─── SETTINGS ───────────────────────────────────────────────────────────────────
//

export const loadSettingsAction = async () => {
  try {
    const defaultSettings = getState().settings
    const settings = await localForage.getItem('invenstorySettings')

    await dispatch({ type: 'LOAD_SETTINGS', settings: merge(defaultSettings, settings) })
  } catch (error) {
    console.error(error)
  }
}

export const updateSettingsOptionAction = async (option: string, value: any) => {
  try {
    await dispatch({ type: 'UPDATE_SETTINGS_OPTION', option, value })
  } catch (error) {
    console.error(error)
  }
}

//
// ─── UI ─────────────────────────────────────────────────────────────────────────
//

export const toggleSidebarAction = async (open: boolean | undefined = undefined) => {
  try {
    // Use {active} value if provided - otherwise use the inverse of current value
    const isOpen = open !== undefined ? !!open : !getState().ui.sidebarOpen

    await dispatch({ type: 'SET_SIDEBAR_OPEN', isOpen: isOpen })
  } catch (error) {
    console.error(error)
  }
}

export const toggleUIPanelAction = async (
  name: string,
  active: boolean | undefined = undefined
) => {
  try {
    // Use {active} value if provided - otherwise use the inverse of current value
    const isActive = active !== undefined ? active : !getState().ui.activePanels.includes(name)

    if (isActive) {
      await dispatch({ type: 'SET_UI_PANEL_ACTIVE', panelName: name })
    } else {
      await dispatch({ type: 'SET_UI_PANEL_INACTIVE', panelName: name })
    }
  } catch (error) {
    console.error(error)
  }
}

export const popUIPanelAction = async () => {
  try {
    await dispatch({ type: 'POP_UI_PANEL' })
  } catch (error) {
    console.error(error)
  }
}
