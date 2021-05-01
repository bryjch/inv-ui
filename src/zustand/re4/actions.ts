import { isEqual, throttle } from 'lodash'

import { dispatch, getState } from './store'

export const updateDraggingAction = async (properties: { [key: string]: any }) => {
  try {
    await dispatch({ type: 'UPDATE_DRAGGING', properties: properties })
  } catch (error) {
    console.error(error)
  }
}

export const updateQuadrantsAction = throttle(
  async (quadrants: { [key: string]: boolean }) => {
    try {
      const previousQuadrants = getState().quadrants

      if (isEqual(previousQuadrants, quadrants)) return null

      await dispatch({ type: 'UPDATE_QUADRANTS', quadrants: quadrants })
    } catch (error) {
      console.error(error)
    }
  },
  100,
  { leading: true, trailing: true }
)
