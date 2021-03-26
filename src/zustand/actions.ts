import { merge } from 'lodash'
import localForage from 'localforage'

import { dispatch, getState } from './store'

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

export const toggleUIPanelAction = async (name: string, active = undefined) => {
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
