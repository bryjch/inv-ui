import { toUpper, clone } from 'lodash'

import { initialState, RE4State } from './store'

import { Item } from '@pages/re4/data/definitions'

const reducers = (state = initialState, action: any): RE4State => {
  switch (toUpper(action.type)) {
    case 'UPDATE_DRAGGING': {
      const dragging = clone(state.dragging)

      Object.entries(action.properties).forEach(([key, value]) => {
        switch (key) {
          case 'item':
            dragging.item = value as Item | null
            break

          case 'from':
            dragging.from = value as 'briefcase' | 'storage' | null
            break

          case 'to':
            dragging.to = value as 'briefcase' | 'storage' | null
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

    case 'UPDATE_QUADRANTS':
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

    default:
      return state
  }
}

export default reducers
