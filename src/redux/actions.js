import { merge } from 'lodash'
import localForage from 'localforage'

//
// ─── SETTINGS ───────────────────────────────────────────────────────────────────
//

export const loadSettingsAction = () => async (dispatch, getState) => {
  try {
    const defaultSettings = getState().settings
    const settings = await localForage.getItem('invenstorySettings')

    await dispatch({ type: 'LOAD_SETTINGS', settings: merge(defaultSettings, settings) })
  } catch (error) {
    console.error(error)
  }
}

export const updateSettingsOptionAction = (option, value) => async dispatch => {
  try {
    await dispatch({ type: 'UPDATE_SETTINGS_OPTION', option, value })
  } catch (error) {
    console.error(error)
  }
}
