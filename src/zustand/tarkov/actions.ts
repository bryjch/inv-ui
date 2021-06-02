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
import { EquipSlotType, Item, XYCoord } from '@pages/tarkov/data/definitions'

//
// ─── FOCUSED ────────────────────────────────────────────────────────────────────
//

export const updateFocusedAction = async (properties: { [key: string]: any }) => {
  try {
    await dispatch({ type: 'UPDATE_FOCUSED', properties: properties })
  } catch (error) {
    console.error(error)
  }
}

export const deleteItemAction = async (from: string, item: Item) => {
  try {
    const [fromAreaType] = from?.split('-') || []

    switch (fromAreaType) {
      case 'grid':
        gridRemoveItemAction(from, item)
        break

      case 'equipSlot':
        unequipItemAction(from)
        break
    }
  } catch (error) {
    console.error(error)
  }
}

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

export const holdItemAction = async (from: string, item: Item, gridOffset: XYCoord) => {
  try {
    await dispatch(
      updateDraggingAction({
        item: item,
        initialItem: item,
        from: from,
        to: from,
        gridOffset: gridOffset,
      })
    )

    const [fromAreaType] = from?.split('-') || []

    switch (fromAreaType) {
      case 'grid': {
        gridRemoveItemAction(from, item)
        break
      }

      case 'equipSlot': {
        unequipItemAction(from)
        break
      }

      case 'listing': {
        break
      }
    }
  } catch (error) {
    console.error(error)
  }
}

export const dropItemAction = async (to: string, item: Item, position: number | null) => {
  const reset = () => {
    clearDraggingItemAction()
    clearDragHoveringSlotsAction()
    cleanupAllGridsAction()
    updateDraggingAction({ from: to })
  }

  try {
    const [toAreaType] = to?.split('-') || []

    switch (toAreaType) {
      case 'grid': {
        if (position === null || !item || !to) break
        if (!isValidGridPlacement(to, item, position)) break

        gridAddItemAction(to, item, position)

        reset()
        break
      }

      case 'equipSlot': {
        if (!item || !to) break
        if (!isValidEquipSlotItem(to, item)) break

        const existingItem = isOccupiedEquipSlot(to)

        equipItemAction(to, item)

        // Support 'quick swapping' of held item into equip slot
        if (existingItem) {
          updateDraggingAction({
            item: existingItem,
            initialItem: existingItem,
            gridOffset: {
              x: existingItem.dimensions.w * DEFAULT_GRID_SIZE * 0.5,
              y: existingItem.dimensions.h * DEFAULT_GRID_SIZE * 0.5,
            },
          })
        } else {
          reset()
        }
        break
      }

      case 'listing': {
        reset()
        break
      }
    }
  } catch (error) {
    console.error(error)
    reset()
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

    await dispatch(updateDraggingAction({ item: item, gridOffset: gridOffset }))
  } catch (error) {
    console.error(error)
  }
}

export const clearDraggingItemAction = async () => {
  try {
    updateDraggingAction({ item: null, initialItem: null, index: null, from: null, to: null })
  } catch (error) {
    console.error(error)
  }
}

export const cancelDraggingAction = async () => {
  try {
    const { from, initialItem } = getState().dragging

    if (!from || !initialItem) return false

    dropItemAction(from, initialItem, initialItem?.position || null)
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
    if (!isValidGridPlacement(gridId, item, position)) return false

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

    if (!grid) return false
    if (item?.position === undefined) return false

    const [itemOccupyingSlots] = getItemOccupiedSlots(item, item.position, grid.area)

    const updatedFilledSlots = difference(grid.occupied, itemOccupyingSlots)

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

export const cleanupAllGridsAction = async () => {
  try {
    dispatch({ type: 'GRID_CLEANUP_ALL' })
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

    dispatch({
      type: 'UPDATE_EQUIP_SLOT',
      slotType: equipSlotType,
      slotItem: instancedItem({ ...item, rotated: false }),
    })
  } catch (error) {
    console.error(error)
  }
}

export const unequipItemAction = (equipSlotId: string) => {
  try {
    const [, equipSlotType] = equipSlotId.split('-') || []

    dispatch({
      type: 'UPDATE_EQUIP_SLOT',
      slotType: equipSlotType,
      slotItem: undefined,
    })
  } catch (error) {
    console.error(error)
  }
}

//
// ─── PANELS ─────────────────────────────────────────────────────────────────────
//

export const toggleItemPopupPanelAction = async (item: Item, active?: boolean) => {
  try {
    if (!item.grids) return false // Ignore items without grids
    if (!item.uuid) return false // Ignore non-instantiated items (e.g. from Listing)

    // Use {active} value if provided - otherwise use the inverse of current value
    const isActive =
      active !== undefined
        ? active
        : !getState().itemPopupPanels.some(({ uuid }) => uuid === item.uuid)

    if (isActive) {
      await dispatch({ type: 'SET_ITEM_POPUP_PANEL_ACTIVE', item: item })
    } else {
      await dispatch({ type: 'SET_ITEM_POPUP_PANEL_INACTIVE', item: item })
    }
  } catch (error) {
    console.error(error)
  }
}

export const reorderItemPopupPanelAction = async (item: Item, order: 'top' | 'bottom') => {
  try {
    if (order === 'top') {
      await dispatch({ type: 'SET_ITEM_POPUP_PANEL_TO_TOP', item: item })
    }

    if (order === 'bottom') {
      await dispatch({ type: 'SET_ITEM_POPUP_PANEL_TO_BOTTOM', item: item })
    }
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

//
// ─── HELPERS ────────────────────────────────────────────────────────────────────
//

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
export const isValidGridPlacement = (gridId: string, item: Item, position: XYCoord | number) => {
  const grid = getState().grids[gridId]

  if (!grid) return false
  if (gridId.includes(item.uuid)) return false // Prevent putting equipSlot item inside itself o_O

  let actualFilledSlots = grid.occupied
  const [hoveringSlots] = getItemOccupiedSlots(item, position, grid.area)

  const overlappingSlots = intersection(actualFilledSlots, hoveringSlots)
  const numSlotsNeeded = item.dimensions.w * item.dimensions.h

  if (hoveringSlots.length < numSlotsNeeded) return false
  if (overlappingSlots.length !== 0) return false

  return true
}

export const isValidEquipSlotItem = (equipSlotId: string, item: Item) => {
  const [, equipSlotType] = equipSlotId.split('-') || []

  return item.tags.includes(equipSlotType)
}

export const isOccupiedEquipSlot = (equipSlotId: string) => {
  const [, equipSlotType] = equipSlotId.split('-') || []

  return getState().equipSlots[equipSlotType as EquipSlotType]
}
