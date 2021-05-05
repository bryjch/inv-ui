import { intersection, difference } from 'lodash'

import { dispatch, getState } from './store'

import { calculateSlotBounds, calculateSlotsFromEdges, indexToCoord } from '@pages/re4/data/helpers'
import { Item } from '@pages/re4/data/definitions'

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
    const { index, item, hovering, from, to } = getState().dragging

    const [fromType] = from?.split('-') || []
    const [toType] = to?.split('-') || []

    if (!fromType || !toType) {
      throw new Error(`Invalid drag action (${from} -> ${to})`)
    }

    const actionType = fromType + ' -> ' + toType

    console.log(`%c${actionType}`, 'color:green;font-size:20px;')

    switch (actionType) {
      ///////////////
      // MOVE ITEM //
      ///////////////
      case 'grid -> grid': {
        if (index === undefined || !item || !to || !from) break
        if (hovering.length < item.dimensions.w * item.dimensions.h) break

        dispatch(gridMoveItemAction(from, to, item, Math.min(...hovering)))
        break
      }

      //////////////
      // ADD ITEM //
      //////////////
      case 'listing -> grid': {
        if (index === undefined || !item || !to) break
        if (hovering.length < item.dimensions.w * item.dimensions.h) break

        dispatch(gridAddItemAction(to, item, Math.min(...hovering)))
        break
      }

      /////////////////
      // REMOVE ITEM //
      /////////////////
      case 'grid -> listing': {
        if (!item || !from) break

        dispatch(gridRemoveItemAction(from, item))
        break
      }

      default: {
        break
      }
    }

    dispatch(updateDraggingAction({ item: null, from: null, to: null, index: null }))
    dispatch(clearDragHoveringSlotsAction())
    dispatch(clearDragOffsetsAction())
  } catch (error) {
    console.error(error)
    dispatch(updateDraggingAction({ item: null, from: null, to: null, index: null }))
    dispatch(clearDragHoveringSlotsAction())
    dispatch(clearDragOffsetsAction())
  }
}

//
// ─── SLOTS ──────────────────────────────────────────────────────────────────────
//

export const updateDragHoveringSlotsAction = async (gridId: string, gridSize: number) => {
  try {
    const { dragging } = getState()
    const grid = getState().grids[gridId]

    if (dragging.index === null || !dragging.item || !grid) return null

    const slotBounds = calculateSlotBounds(
      dragging.index,
      dragging.item.dimensions,
      dragging.mouseOffset,
      grid.area,
      gridSize
    )

    const [hoveringSlots] = calculateSlotsFromEdges(slotBounds[0], slotBounds[1], grid.area)

    await dispatch({ type: 'UPDATE_DRAG_HOVERING_SLOTS', slots: hoveringSlots })
  } catch (error) {
    console.error(error)
  }
}

export const clearDragHoveringSlotsAction = async () => {
  try {
    await dispatch({ type: 'UPDATE_DRAG_HOVERING_SLOTS', slots: [] })
  } catch (error) {
    console.error(error)
  }
}

export const clearDragOffsetsAction = async () => {
  try {
    await dispatch({ type: 'CLEAR_DRAG_OFFSETS' })
  } catch (error) {
    console.error(error)
  }
}

//
// ─── GRID ───────────────────────────────────────────────────────────────────────
//

export const initializeGridAction = async (id: string, cols: number, rows: number) => {
  try {
    await dispatch({ type: 'GRID_INITIALIZE', id: id, area: { cols, rows } })
  } catch (error) {
    console.error(error)
  }
}

export const gridAddItemAction = async (gridId: string, item: Item, position: number) => {
  try {
    const grid = getState().grids[gridId]
    const coordPos = indexToCoord(position, grid.area)

    if (!grid) return false

    const [hoveringSlots] = calculateSlotsFromEdges(
      coordPos,
      {
        x: coordPos.x + item.dimensions.w - 1,
        y: coordPos.y + item.dimensions.h - 1,
      },
      grid.area
    )

    // Check if user is hovering enough briefcase slots
    const numSlotsNeeded = item.dimensions.w * item.dimensions.h

    if (hoveringSlots.length < numSlotsNeeded) return false

    if (intersection(grid.occupied, hoveringSlots).length !== 0) return false

    dispatch({
      type: 'GRID_ADD_ITEM',
      id: gridId,
      item: item,
      position: position,
    })

    dispatch({
      type: 'GRID_UPDATE_OCCUPIED_SLOTS',
      id: gridId,
      slots: [...grid.occupied, ...hoveringSlots],
    })
  } catch (error) {
    console.error(error)
  }
}

export const gridRemoveItemAction = async (gridId: string, item: Item) => {
  try {
    const grid = getState().grids[gridId]

    if (!grid || item?.position === undefined) return false

    const originalPosition = indexToCoord(item?.position, grid.area)

    const [originalOccupyingSlots] = calculateSlotsFromEdges(
      originalPosition,
      {
        x: originalPosition.x + item.dimensions.w - 1,
        y: originalPosition.y + item.dimensions.h - 1,
      },
      grid.area
    )

    const updatedFilledSlots = difference(grid.occupied, originalOccupyingSlots)

    dispatch({
      type: 'GRID_REMOVE_ITEM',
      id: gridId,
      item: item,
    })

    dispatch({
      type: 'GRID_UPDATE_OCCUPIED_SLOTS',
      id: gridId,
      slots: [...updatedFilledSlots],
    })
  } catch (error) {
    console.error(error)
  }
}

export const gridMoveItemAction = async (
  fromGridId: string,
  toGridId: string,
  item: Item,
  position: number
) => {
  try {
    const fromGrid = getState().grids[fromGridId]
    const toGrid = getState().grids[toGridId]
    const coordPos = indexToCoord(position, toGrid.area)

    if (!fromGrid || !toGrid || item?.position === undefined) return false

    const originalPosition = indexToCoord(item?.position, fromGrid.area)

    // The slots that are being hovered (i.e. highlighted green)
    const [hoveredSlots] = calculateSlotsFromEdges(
      coordPos,
      {
        x: coordPos.x + item.dimensions.w - 1,
        y: coordPos.y + item.dimensions.h - 1,
      },
      toGrid.area
    )

    // Slots of the destination grid that are filled
    let actualFilledSlots = toGrid.occupied

    // If the item is being moved within the same grid, we need to
    // consider the item's "original occupying slots" and subtract
    // them from the "actual filled slots"
    if (fromGridId === toGridId) {
      const [originalOccupyingSlots] = calculateSlotsFromEdges(
        originalPosition,
        {
          x: originalPosition.x + item.dimensions.w - 1,
          y: originalPosition.y + item.dimensions.h - 1,
        },
        fromGrid.area
      )

      actualFilledSlots = difference(toGrid.occupied, originalOccupyingSlots)
    }

    if (intersection(actualFilledSlots, hoveredSlots).length !== 0) return false

    dispatch(gridRemoveItemAction(fromGridId, item))

    dispatch(gridAddItemAction(toGridId, item, position))
  } catch (error) {
    console.error(error)
  }
}
