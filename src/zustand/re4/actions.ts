import { isEqual, throttle } from 'lodash'

import { dispatch, getState } from './store'

import { calculateSlotBounds, calculateOccupyingSlots, coordToIndex } from '@pages/re4/data/helpers'

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
    // TODO: drop logic

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

    if (!dragging.item || dragging.index === null) return null

    const slotBounds = calculateSlotBounds(dragging.index, dragging.item.dimensions, quadrants)

    const occupyingSlots = calculateOccupyingSlots(...slotBounds)

    const slotIndices = occupyingSlots.map(coordToIndex)

    await dispatch({ type: 'UPDATE_OCCUPYING_SLOTS', slots: slotIndices })
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
