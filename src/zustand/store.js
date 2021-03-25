import create from 'zustand'
import { devtools, redux } from 'zustand/middleware'

import rootReducer from './reducer'

const initialState = {
  settings: {
    soundsEnabled: true,
    tiltEnabled: true,
  },

  ui: {
    activePanels: [],
  },
}

const [useStore, storeApi] = create(devtools(redux(rootReducer, initialState)))

// Export these functions at first level because they will be used very frequently
// and are essentially the Redux equivalents (makes migration/adoption easier)
const dispatch = storeApi.dispatch
const getState = useStore.getState

export { useStore, storeApi, dispatch, getState }
