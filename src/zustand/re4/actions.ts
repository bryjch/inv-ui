import { isEqual, throttle, intersection } from 'lodash'
import { XYCoord } from 'react-dnd'

import { dispatch, getState } from './store'

import {
  calculateSlotBounds,
  calculateSlotsFromEdges,
  coordToIndex,
  indexToCoord,
} from '@pages/re4/data/helpers'
import { Item, DropType } from '@pages/re4/data/definitions'

//
// ─── DRAGGING ───────────────────────────────────────────────────────────────────
//

export const updateDraggingAction = async (properties: { [key: string]: any }) => {
  try {
    await dispatch({ type: 'UPDATE_DRAGGING', properties: properties })
  } catch (error) {
    console.error(error)
  }
}

export const completedDraggingAction = async () => {
  try {
    const { dragging } = getState()

    const { Briefcase, Storage } = DropType
    const action = dragging.from + '->' + dragging.to

    switch (action) {
      // Try removing the item from the briefcase
      case Briefcase + '->' + Storage: {
        break
      }

      // Try moving the item in the briefcase
      case Briefcase + '->' + Briefcase: {
        break
      }

      // Try adding the item to briefcase
      case Storage + '->' + Briefcase: {
        const { index, item, occupying } = dragging

        if (!index || !item) break
        if (occupying.length < item.dimensions.w * item.dimensions.h) break

        dispatch(addItemToBriefcaseAction(item, Math.min(...occupying)))
        break
      }

      // Don't need to do anything
      case Storage + '->' + Storage: {
        break
      }

      default: {
        break
      }
    }

    dispatch(clearOccupyingSlotsAction())
    dispatch(updateDraggingAction({ item: null, from: null, to: null, index: null }))
    dispatch(updateQuadrantsAction({ top: false, left: false, right: false, bottom: false }))
  } catch (error) {
    console.error(error)
  }
}

//
// ─── QUADRANTS ──────────────────────────────────────────────────────────────────
//

export const updateQuadrantsAction = throttle(
  async (quadrants: { [key: string]: boolean }) => {
    try {
      const previousQuadrants = getState().quadrants

      if (isEqual(previousQuadrants, quadrants)) return null

      await dispatch({ type: 'UPDATE_QUADRANTS', quadrants: quadrants })

      await dispatch(updateOccupyingSlotsAction())
    } catch (error) {
      console.error(error)
    }
  },
  10,
  { leading: true, trailing: true }
)

//
// ─── SLOTS ──────────────────────────────────────────────────────────────────────
//

export const updateOccupyingSlotsAction = async () => {
  try {
    const { dragging, quadrants } = getState()

    if (dragging.index === null || !dragging.item) return null

    const slotBounds = calculateSlotBounds(dragging.index, dragging.item.dimensions, quadrants)

    const [occupyingSlots] = calculateSlotsFromEdges(...slotBounds)

    await dispatch({ type: 'UPDATE_OCCUPYING_SLOTS', slots: occupyingSlots })
  } catch (error) {
    console.error(error)
  }
}

export const clearOccupyingSlotsAction = async () => {
  try {
    await dispatch({ type: 'UPDATE_OCCUPYING_SLOTS', slots: [] })
  } catch (error) {
    console.error(error)
  }
}

//
// ─── BRIEFCASE ──────────────────────────────────────────────────────────────────
//

export const addItemToBriefcaseAction = async (item: Item, position: number | XYCoord) => {
  try {
    const filledBriefcaseSlots = getState().briefcase.occupied

    if (typeof position === 'number') {
      position = indexToCoord(position)
    }

    const [occupyingSlots] = calculateSlotsFromEdges(position, {
      x: position.x + item.dimensions.w - 1,
      y: position.y + item.dimensions.h - 1,
    })

    // Check if user is hovering enough briefcase slots
    const numSlotsNeeded = item.dimensions.w * item.dimensions.h

    if (occupyingSlots.length < numSlotsNeeded) return false

    if (intersection(filledBriefcaseSlots, occupyingSlots).length !== 0) return false

    dispatch({
      type: 'ADD_BRIEFCASE_ITEM',
      item: item,
      position: coordToIndex(position),
    })

    dispatch({
      type: 'UPDATE_OCCUPIED_BRIEFCASE_SLOTS',
      slots: [...filledBriefcaseSlots, ...occupyingSlots],
    })
  } catch (error) {
    console.error(error)
  }
}
