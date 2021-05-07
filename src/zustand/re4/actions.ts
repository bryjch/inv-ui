import { intersection, difference } from 'lodash'
import { v4 as uuidv4 } from 'uuid'

import { dispatch, getState } from './store'

import { getItemOccupiedSlots } from '@pages/re4/data/helpers'
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

    console.log(`%c${actionType}`, 'color:green;font-weight:bold;font-size:20px;')

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

    dispatch(updateDraggingAction({ item: null, index: null }))
    dispatch(clearDragHoveringSlotsAction())
  } catch (error) {
    console.error(error)
    dispatch(updateDraggingAction({ item: null, index: null }))
    dispatch(clearDragHoveringSlotsAction())
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

    const [hoveringSlots] = getItemOccupiedSlots(dragging.item, dragging.index, grid.area)

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

//
// ─── GRID ───────────────────────────────────────────────────────────────────────
//

export const initializeGridAction = async (id: string, cols: number, rows: number) => {
  try {
    await dispatch({ type: 'GRID_INITIALIZE', id: id, area: { w: cols, h: rows } })
  } catch (error) {
    console.error(error)
  }
}

export const gridAddItemAction = async (gridId: string, item: Item, position: number) => {
  try {
    const grid = getState().grids[gridId]

    if (!grid) return false

    const [hoveringSlots] = getItemOccupiedSlots(item, position, grid.area)

    // Check if user is hovering enough briefcase slots
    const numSlotsNeeded = item.dimensions.w * item.dimensions.h

    if (hoveringSlots.length < numSlotsNeeded) return false

    if (intersection(grid.occupied, hoveringSlots).length !== 0) return false

    dispatch({
      type: 'GRID_ADD_ITEM',
      id: gridId,
      item: { ...item, uuid: item.uuid ? item.uuid : uuidv4() },
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

    const [originalOccupyingSlots] = getItemOccupiedSlots(item, item.position, grid.area)

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
  newPosition: number
) => {
  try {
    const fromGrid = getState().grids[fromGridId]
    const toGrid = getState().grids[toGridId]

    if (!fromGrid || !toGrid || item?.position === undefined) return false

    // Slots of the user's drag preview
    const [previewSlots] = getItemOccupiedSlots(item, newPosition, toGrid.area)

    // Slots of the destination grid that are filled
    let actualFilledSlots = toGrid.occupied

    // If the item is being moved within the same grid, we need to
    // consider the item's "original occupying slots" and subtract
    // them from the "actual filled slots"
    if (fromGridId === toGridId) {
      const [originalOccupyingSlots] = getItemOccupiedSlots(item, item.position, fromGrid.area)

      actualFilledSlots = difference(toGrid.occupied, originalOccupyingSlots)
    }

    // The user's selection is overlapping with existing "filled" slots
    if (intersection(actualFilledSlots, previewSlots).length !== 0) return false

    // Do the necessary addition / removals
    dispatch(gridRemoveItemAction(fromGridId, item))

    dispatch(gridAddItemAction(toGridId, item, newPosition))
  } catch (error) {
    console.error(error)
  }
}
