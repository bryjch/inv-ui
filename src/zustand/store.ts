import create, { GetState, State } from 'zustand'
import { devtools, redux } from 'zustand/middleware'

import rootReducer from './reducer'

import { Game } from '@shared/data/definitions'

export interface SharedState extends State {
  app: {
    activeGame: Game | null
  }

  settings: {
    general: {
      soundsEnabled: boolean
      soundsVolume: number
    }

    fallout: {
      tiltEnabled: boolean
    }

    minecraft: {
      persistInventory: boolean
    }
  }

  ui: {
    sidebarOpen: boolean
    activePanels: string[]
  }
}

export const initialState: SharedState = {
  app: {
    activeGame: null,
  },

  settings: {
    general: {
      soundsEnabled: true,
      soundsVolume: 0.5,
    },

    fallout: {
      tiltEnabled: true,
    },

    minecraft: {
      persistInventory: false,
    },
  },

  ui: {
    sidebarOpen: false,
    activePanels: [],
  },
}

const useStore = create(devtools(redux<SharedState, any>(rootReducer, initialState)))

// Seems like the redux middleware doesn't work friendly with Typescript &
// doesn't include dispatch() definition; so we manually extend it
// https://github.com/pmndrs/zustand/issues/212
// https://github.com/pmndrs/zustand/issues/166
const storeApi = useStore as typeof useStore & { dispatch: (action: any) => any }

// Export these functions at first level because they will be used very frequently
// and are essentially the Redux equivalents (makes migration/adoption easier)
const dispatch = storeApi.dispatch
const getState: GetState<SharedState> = useStore.getState

export { useStore, storeApi, dispatch, getState }
