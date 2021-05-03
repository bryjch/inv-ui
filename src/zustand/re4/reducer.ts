import { toUpper, clone } from 'lodash'

import { initialState, RE4State } from './store'

import { Item, DropType } from '@pages/re4/data/definitions'

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
            dragging.from = value as DropType | null
            break

          case 'to':
            dragging.to = value as DropType | null
            break

          case 'index':
            dragging.index = value as number | null
            break

          default:
            break
        }
      })

      return { ...state, dragging: dragging }
    }

    //
    // ─── QUADRANTS ──────────────────────────────────────────────────────────────────
    //

    case 'UPDATE_QUADRANTS': {
      const quadrants = clone(state.quadrants)

      Object.entries(action.quadrants).forEach(([key, value]) => {
        switch (key) {
          case 'top':
          case 'left':
          case 'right':
          case 'bottom':
            quadrants[key] = value as boolean
            break

          default:
            break
        }
      })

      return { ...state, quadrants: quadrants }
    }

    //
    // ─── SLOTS ──────────────────────────────────────────────────────────────────────
    //

    case 'UPDATE_OCCUPYING_SLOTS': {
      return { ...state, dragging: { ...state.dragging, occupying: action.slots } }
    }

    //
    // ─── BRIEFCASE ──────────────────────────────────────────────────────────────────
    //

    case 'ADD_BRIEFCASE_ITEM': {
      const briefcase = clone(state.briefcase)

      briefcase.items = [...briefcase.items, { ...action.item, position: action.position }]

      return { ...state, briefcase: briefcase }
    }

    case 'UPDATE_OCCUPIED_BRIEFCASE_SLOTS': {
      const briefcase = clone(state.briefcase)

      briefcase.occupied = [...action.slots]

      return { ...state, briefcase: briefcase }
    }

    case 'MOVE_BRIEFCASE_ITEM': {
      const briefcase = clone(state.briefcase)

      const existing = briefcase.items.find(({ position }) => position === action.item.position)

      if (existing) existing.position = action.position

      return { ...state, briefcase: briefcase }
    }

    default:
      return state
  }
}

export default reducers
