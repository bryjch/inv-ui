import create, { GetState, State } from 'zustand'
import { devtools, redux } from 'zustand/middleware'
import { XYCoord } from 'react-dnd'

import rootReducer from './reducer'

import { Item, DropType } from '@pages/re4/data/definitions'

export interface RE4State extends State {
  dragging: {
    item: Item | null
    from: DropType | null
    to: DropType | null
    index: number | null
    occupying: number[]
    mouseOffset: XYCoord
  }

  briefcase: {
    items: Item[]
    occupied: number[]
  }
}

export const initialState: RE4State = {
  dragging: {
    item: null,
    from: null,
    to: null,
    index: null,
    occupying: [],
    mouseOffset: { x: 0, y: 0 },
  },

  briefcase: {
    items: [],
    occupied: [],
  },
}

const useStore = create(devtools(redux<RE4State, any>(rootReducer, initialState)))

// Seems like the redux middleware doesn't work friendly with Typescript &
// doesn't include dispatch() definition; so we manually extend it
// https://github.com/pmndrs/zustand/issues/212
// https://github.com/pmndrs/zustand/issues/166
const storeApi = useStore as typeof useStore & { dispatch: (action: any) => any }

// Export these functions at first level because they will be used very frequently
// and are essentially the Redux equivalents (makes migration/adoption easier)
const dispatch = storeApi.dispatch
const getState: GetState<RE4State> = useStore.getState

export { useStore, storeApi, dispatch, getState }
