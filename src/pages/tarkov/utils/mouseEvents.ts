import React from 'react'

import { Item } from '../data/definitions'
import { parseMouseEvent } from '../data/helpers'

import { dispatch, getState } from '@zus/tarkov/store'
import {
  updateDraggingAction,
  completedDraggingAction,
  clearDragHoveringSlotsAction,
} from '@zus/tarkov/actions'

// There are various "areas" which we need to listen for mouse hover / click events
// which overall have similar behaviour and zustand actions; so we use these common
// handlers to reduce repetition, then handle the inter-area behaviour in actions.ts

//
// ────────────────────────────────────────────────────────────────────────────────
//

export const onMouseOverDragArea =
  (areaId: string, state: 'enter' | 'exit') => (event: React.MouseEvent) => {
    try {
      if (!(event.relatedTarget instanceof Element)) return null

      const { dragging } = getState()

      if (state === 'enter') {
        if (dragging.item) {
          dispatch(updateDraggingAction({ to: areaId, index: null }))
        } else {
          dispatch(updateDraggingAction({ from: areaId, index: null }))
        }
      }

      if (state === 'exit') {
        dispatch(updateDraggingAction({ to: null, index: null }))
        dispatch(clearDragHoveringSlotsAction())
      }
    } catch (error) {
      console.error(error)
    }
  }

//
// ────────────────────────────────────────────────────────────────────────────────
//

export const onClickDragArea = (areaId: string) => async (event: React.MouseEvent) => {
  event.stopPropagation()

  const { dragging } = getState()

  if (!dragging.item) return false

  switch (event.button) {
    case 0: {
      dispatch(completedDraggingAction())
      dispatch(updateDraggingAction({ from: areaId }))
    }
  }
}

//
// ────────────────────────────────────────────────────────────────────────────────
//

export const onClickDragAreaItem =
  (areaId: string, item: Item) => async (event: React.MouseEvent) => {
    const { dragging } = getState()

    // TODO: this behaviour would need to be different if wanna handle item swapping
    if (dragging.item) return false

    event.stopPropagation()

    switch (event.button) {
      case 0: {
        const { clientOffset, rect } = parseMouseEvent(event, item ? undefined : `#${areaId}`)

        if (item && rect) {
          const gridOffset = { x: clientOffset.x - rect.left, y: clientOffset.y - rect?.top }

          await dispatch(
            updateDraggingAction({
              item: item,
              from: areaId,
              to: areaId,
              gridOffset: gridOffset,
            })
          )
        }
      }
    }
  }
