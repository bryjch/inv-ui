import create, { GetState, State } from 'zustand'
import { devtools, redux } from 'zustand/middleware'
import { fill } from 'lodash'

import rootReducer from './reducer'

import { Item, SlotType } from '@pages/minecraft/data/definitions'

//
// ─── INITIAL BACKPACK CONTENTS ──────────────────────────────────────────────────
//

const DEFAULT_BACKPACK: (Item | null)[] = fill(Array(27), null)
const DEFAULT_HOTBAR: (Item | null)[] = fill(Array(9), null)

DEFAULT_BACKPACK[0] = { iid: 'woodPlank', quantity: 16 }
DEFAULT_BACKPACK[3] = { iid: 'woodPlank', quantity: 32 }
DEFAULT_BACKPACK[4] = { iid: 'cobblestone', quantity: 10 }

DEFAULT_HOTBAR[0] = { iid: 'ironPickaxe', quantity: 1 }
DEFAULT_HOTBAR[4] = { iid: 'enderPearl', quantity: 8 }
DEFAULT_HOTBAR[5] = { iid: 'woodPlank', quantity: 20 }
DEFAULT_HOTBAR[6] = { iid: 'woodPlank', quantity: 10 }

//
// ─── ZUSTAND STATE ──────────────────────────────────────────────────────────────
//

export interface MinecraftState extends State {
  slots: {
    backpack: (Item | null)[]
    hotbar: (Item | null)[]
  }

  holding: {
    item: Item | null
    isDragging: 'lmb' | 'rmb' | null // Keep track to know when to "spread" stack across slots
    draggedTo: { type: SlotType; index: number }[]
  }
}

export const initialState: MinecraftState = {
  slots: {
    backpack: DEFAULT_BACKPACK,
    hotbar: DEFAULT_HOTBAR,
  },

  holding: {
    item: null,
    isDragging: null,
    draggedTo: [],
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
const getState: GetState<MinecraftState> = useStore.getState

export { useStore, storeApi, dispatch, getState }
