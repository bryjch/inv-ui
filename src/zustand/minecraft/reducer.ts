import { clone, toUpper } from 'lodash'

import { initialState } from './store'

const reducers = (state = initialState, action: any) => {
  switch (toUpper(action.type)) {
    case 'UPDATE_BACKPACK_SLOT': {
      const slots = clone(state.slots)

      slots.backpack[action.slotIndex].item = action.slotItem

      return { ...state, slots: slots }
    }

    case 'UPDATE_HOTBAR_SLOT': {
      const slots = clone(state.slots)

      slots.hotbar[action.slotIndex].item = action.slotItem

      return { ...state, slots: slots }
    }

    case 'SET_HELD_ITEM': {
      const holding = clone(state.holding)

      holding.item = action.item

      return { ...state, holding: holding }
    }

    case 'CLEAR_HELD_ITEM': {
      const holding = clone(state.holding)

      holding.item = null

      return { ...state, holding: holding }
    }

    case 'SET_HELD_DRAGGING': {
      const holding = clone(state.holding)

      holding.isDragging = action.isDragging as 'lmb' | 'rmb' | null

      return { ...state, holding: holding }
    }

    case 'SET_HELD_DRAGGED_TO_SLOT': {
      const holding = clone(state.holding)

      holding.draggedTo = action.draggedTo

      return { ...state, holding: holding }
    }

    case 'PURGE_INVENTORY': {
      const slots = clone(state.slots)

      slots.backpack = slots.backpack.map(slot => ({ ...slot, item: null }))
      slots.hotbar = slots.hotbar.map(slot => ({ ...slot, item: null }))

      return { ...state, slots: slots }
    }

    case 'SHOW_ITEM_TOOLTIP': {
      const ui = clone(state.ui)

      ui.tooltip = action.iid

      return { ...state, ui: ui }
    }

    case 'SET_HOVERED_INVENTORY_SLOT': {
      const ui = clone(state.ui)

      ui.hovering = action.slot

      return { ...state, ui: ui }
    }

    default:
      return state
  }
}

export default reducers
