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

const useStore = create(devtools(redux(rootReducer, initialState)))

// Seems like the redux middleware doesn't work friendly with Typescript &
// doesn't include dispatch() definition; so we manually extend it
// https://github.com/pmndrs/zustand/issues/212
// https://github.com/pmndrs/zustand/issues/166
const storeApi = useStore as typeof useStore & { dispatch: (action: any) => any }

// Export these functions at first level because they will be used very frequently
// and are essentially the Redux equivalents (makes migration/adoption easier)
const dispatch = storeApi.dispatch
const getState = useStore.getState

export { useStore, storeApi, dispatch, getState }
