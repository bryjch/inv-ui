import { intersection, difference, merge, clone } from 'lodash'
import localForage from 'localforage'
import { v4 as uuidv4 } from 'uuid'

import { dispatch, getState } from './store'

import {
  getItemOccupiedSlots,
  getRotatedDimensions,
  isItemRotatable,
} from '@pages/tarkov/data/helpers'
import { DEFAULT_GRID_SIZE } from '@pages/tarkov/data/constants'
import { Item } from '@pages/tarkov/data/definitions'

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

    const [fromAreaType] = from?.split('-') || []
    const [toAreaType] = to?.split('-') || []

    if (!fromAreaType || !toAreaType) {
      throw new Error(`Invalid drag action (${from} -> ${to})`)
    }

    const actionType = fromAreaType + ' -> ' + toAreaType

    console.log(`%c${actionType}`, 'color:green;font-weight:bold;font-size:20px;')

    switch (actionType) {
      ///////////////
      // MOVE ITEM //
      ///////////////
      case 'grid -> grid': {
        if (index === null || !item || !to || !from) break
        if (!isValidGridPlacement(item, index, to)) break

        gridMoveItemAction(from, to, item, Math.min(...hovering))
        break
      }

      case 'grid -> equipSlot': {
        if (!item || !from || !to) break
        if (!isValidEquipSlotItem(item, to)) break

        gridRemoveItemAction(from, item)
        equipItemAction(to, item)
        break
      }

      case 'equipSlot -> grid': {
        if (index === null || !item || !from || !to) break
        if (!isValidGridPlacement(item, index, to)) break

        gridAddItemAction(to, item, Math.min(...hovering))
        unequipItemAction(from)
        break
      }

      case 'equipSlot -> equipSlot': {
        if (!item || !from || !to) break
        if (!isValidEquipSlotItem(item, to)) break

        unequipItemAction(from)
        equipItemAction(to, item)

        break
      }

      //////////////
      // ADD ITEM //
      //////////////
      case 'listing -> grid': {
        if (index === null || !item || !to) break
        if (!isValidGridPlacement(item, index, to)) break

        gridAddItemAction(to, item, Math.min(...hovering))
        break
      }

      case 'listing -> equipSlot': {
        if (!item || !to) break
        if (!isValidEquipSlotItem(item, to)) break

        equipItemAction(to, item)
        break
      }

      /////////////////
      // REMOVE ITEM //
      /////////////////
      case 'grid -> listing': {
        if (!item || !from) break

        gridRemoveItemAction(from, item)
        break
      }

      case 'equipSlot -> listing': {
        if (!item || !from) break

        unequipItemAction(from)
        break
      }

      default: {
        break
      }
    }

    updateDraggingAction({ item: null, index: null, from: null, to: null })
    clearDragHoveringSlotsAction()
  } catch (error) {
    console.error(error)
    updateDraggingAction({ item: null, index: null, from: null, to: null })
    clearDragHoveringSlotsAction()
  }
}

export const rotateDraggingItemAction = async () => {
  try {
    const item = clone(getState().dragging.item)

    if (!item) return false
    if (isItemRotatable(item) === false) return false

    item.rotated = !item.rotated

    const gridOffset = {
      x: DEFAULT_GRID_SIZE * (getRotatedDimensions(item).w / 2),
      y: DEFAULT_GRID_SIZE * (getRotatedDimensions(item).h / 2),
    }

    await dispatch(updateDraggingAction({ item: { ...item }, gridOffset: gridOffset }))
  } catch (error) {
    console.error(error)
  }
}

//
// ─── SLOTS ──────────────────────────────────────────────────────────────────────
//

export const updateDragHoveringSlotsAction = async (gridId: string, gridSize?: number) => {
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
    if (!isValidGridPlacement(item, position, gridId)) return false

    const [hoveringSlots] = getItemOccupiedSlots(item, position, grid.area)

    dispatch({
      type: 'GRID_ADD_ITEM',
      id: gridId,
      item: instancedItem(item),
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

    const originalItem = grid.items.find(({ uuid }) => uuid === item.uuid)

    if (!originalItem) throw new Error('Unable to find original item')

    const [originalOccupyingSlots] = getItemOccupiedSlots(originalItem, item.position, grid.area)

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

    return true
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
      const originalItem = fromGrid.items.find(({ uuid }) => uuid === item.uuid)
      if (!originalItem) throw new Error('Unable to find original item')

      const [originalOccupyingSlots] = getItemOccupiedSlots(
        originalItem,
        item.position,
        fromGrid.area
      )

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

//
// ─── EQUIP SLOTS ────────────────────────────────────────────────────────────────
//

export const equipItemAction = (equipSlotId: string, item: Item) => {
  try {
    const [, equipSlotType] = equipSlotId.split('-') || []

    dispatch({ type: 'UPDATE_EQUIP_SLOT', slotType: equipSlotType, slotItem: instancedItem(item) })
  } catch (error) {
    console.error(error)
  }
}

export const unequipItemAction = (equipSlotId: string) => {
  try {
    const [, equipSlotType] = equipSlotId.split('-') || []

    dispatch({ type: 'UPDATE_EQUIP_SLOT', slotType: equipSlotType, slotItem: undefined })
  } catch (error) {
    console.error(error)
  }
}

//
// ─── MISC ───────────────────────────────────────────────────────────────────────
//

export const loadSavedInventoryAction = async () => {
  try {
    const defaultGrids = getState().grids
    const defaultEquipSlots = getState().equipSlots

    const savedGrids = await localForage.getItem('INVUI::TARKOV::GRIDS')
    const savedEquipSlots = await localForage.getItem('INVUI::TARKOV::EQUIPSLOTS')

    dispatch({
      type: 'LOAD_SAVED_GRIDS',
      grids: merge(defaultGrids, savedGrids),
    })

    dispatch({
      type: 'LOAD_SAVED_EQUIP_SLOTS',
      equipSlots: merge(defaultEquipSlots, savedEquipSlots),
    })
  } catch (error) {
    console.error(error)
  }
}

// Make sure the item always has a {uuid} and {rotated} value
const instancedItem = (item: Item | null) => {
  if (!item) return null

  return {
    ...item,
    uuid: item.uuid ? item.uuid : uuidv4(),
    rotated: item.rotated !== undefined ? item.rotated : false,
  }
}

// Check if {item} can be successfully placed on {gridId} at {position}
const isValidGridPlacement = (item: Item, position: number, gridId: string) => {
  const grid = getState().grids[gridId]

  if (!grid) throw new Error(`Invalid grid: ${gridId}`)

  const [hoveringSlots] = getItemOccupiedSlots(item, position, grid.area)

  const numSlotsNeeded = item.dimensions.w * item.dimensions.h

  if (hoveringSlots.length < numSlotsNeeded) return false

  if (intersection(grid.occupied, hoveringSlots).length !== 0) return false

  return true
}

const isValidEquipSlotItem = (item: Item, equipSlotId: string) => {
  const [, equipSlotType] = equipSlotId.split('-') || []

  return item.tags.includes(equipSlotType)
}
