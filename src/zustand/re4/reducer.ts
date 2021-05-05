import { XYCoord } from 'react-dnd'
import { toUpper, clone } from 'lodash'

import { initialState, RE4State } from './store'

import { Item } from '@pages/re4/data/definitions'

const reducers = (state = initialState, action: any): RE4State => {
  switch (toUpper(action.type)) {
    //
    // ─── DRAGGING ───────────────────────────────────────────────────────────────────
    //

    case 'UPDATE_DRAGGING': {
      const dragging = clone(state.dragging)

      Object.entries(action.properties).forEach(([key, value]) => {
        switch (key) {
          case 'item':
            dragging.item = value as Item | null
            break

          case 'from':
            dragging.from = value as string | null
            break

          case 'to':
            dragging.to = value as string | null
            break

          case 'index':
            dragging.index = value as number | null
            break

          case 'mouseOffset':
            dragging.mouseOffset = value as XYCoord
            break

          case 'snapOffset':
            dragging.snapOffset = value as XYCoord
            break

          default:
            break
        }
      })

      return { ...state, dragging: dragging }
    }

    case 'SET_DRAG_MOUSE_OFFSET': {
      return { ...state, dragging: { ...state.dragging, mouseOffset: action.offset } }
    }

    case 'UPDATE_DRAG_HOVERING_SLOTS': {
      return { ...state, dragging: { ...state.dragging, hovering: action.slots } }
    }

    case 'CLEAR_DRAG_OFFSETS': {
      return {
        ...state,
        dragging: {
          ...state.dragging,
          mouseOffset: { x: 0, y: 0 },
          snapOffset: { x: 0, y: 0 },
        },
      }
    }

    //
    // ─── BRIEFCASE ──────────────────────────────────────────────────────────────────
    //

    case 'GRID_ADD_ITEM': {
      const grid = clone(state.grids[action.id])

      if (!grid) return state

      grid.items = [...grid.items, { ...action.item, position: action.position }]

      return { ...state, grids: { ...state.grids, [action.id]: grid } }
    }

    case 'GRID_MOVE_ITEM': {
      const grid = clone(state.grids[action.id])

      if (!grid) return state

      const existing = grid.items.find(({ position }) => position === action.item.position)

      if (existing) existing.position = action.position

      return { ...state, grids: { ...state.grids, [action.id]: grid } }
    }

    case 'GRID_REMOVE_ITEM': {
      const grid = clone(state.grids[action.id])

      if (!grid) return state

      const existingIndex = grid.items.findIndex(
        ({ position }) => position === action.item.position
      )

      if (existingIndex !== -1) grid.items.splice(existingIndex, 1)

      return { ...state, grids: { ...state.grids, [action.id]: grid } }
    }

    case 'GRID_UPDATE_OCCUPIED_SLOTS': {
      const grid = clone(state.grids[action.id])

      if (!grid) return state

      grid.occupied = [...action.slots]

      return { ...state, grids: { ...state.grids, [action.id]: grid } }
    }

    //
    // ─── GRID ────────────────────────────────────────────────────────
    //

    case 'GRID_INITIALIZE':
      const grids = clone(state.grids)

      grids[action.id] = { items: [], occupied: [], area: action.area }

      return { ...state, grids: grids }

    default:
      return state
  }
}

export default reducers
