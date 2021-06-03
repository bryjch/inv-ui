import create, { GetState, State } from 'zustand'
import { devtools, redux } from 'zustand/middleware'

import rootReducer from './reducer'

import { Item, ItemGrid, XYCoord, EquipSlotType } from '@pages/tarkov/data/definitions'

export interface TarkovState extends State {
  focused: {
    item: Item | null
  }
  dragging: {
    item: Item | null
    initialItem: Item | null // Keep track of {item} initial state when started drag
    from: string | null // TODO: DropType
    to: string | null // TODO: DropType
    index: number | null
    hovering: number[]
    gridOffset: XYCoord
  }
  grids: {
    [key: string]: ItemGrid
  }
  equipSlots: {
    [key in EquipSlotType]?: Item
  }
  itemPopupPanels: Item[]
  miscPanels: string[]
}

export const initialState: TarkovState = {
  focused: {
    item: null,
  },
  dragging: {
    item: null,
    initialItem: null,
    from: null,
    to: null,
    index: null,
    hovering: [],
    gridOffset: { x: 0, y: 0 },
  },
  grids: {},
  equipSlots: {},
  itemPopupPanels: [],
  miscPanels: [],
}

const useStore = create(devtools(redux<TarkovState, any>(rootReducer, initialState)))

// Seems like the redux middleware doesn't work friendly with Typescript &
// doesn't include dispatch() definition; so we manually extend it
// https://github.com/pmndrs/zustand/issues/212
// https://github.com/pmndrs/zustand/issues/166
const storeApi = useStore as typeof useStore & { dispatch: (action: any) => any }

// Export these functions at first level because they will be used very frequently
// and are essentially the Redux equivalents (makes migration/adoption easier)
const dispatch = storeApi.dispatch
const getState: GetState<TarkovState> = useStore.getState

export { useStore, storeApi, dispatch, getState }
