import { isEqual, uniqWith } from 'lodash'

import { dispatch, getState } from './store'

import { getItemInfo, getInventorySlot } from '@pages/minecraft/data/helpers'
import { Item, SlotType } from '@pages/minecraft/data/definitions'

//
// ─── LEFT CLICK SLOT ────────────────────────────────────────────────────────────
//

export const leftClickSlotAction = async (type: SlotType, index: number) => {
  try {
    const clicked = { item: getState().slots[type][index], slot: { type, index } }
    const holding = getState().holding

    let action

    if (holding.item) {
      if (clicked.item) action = 'swapOrStackItem'
      if (!clicked.item) action = 'moveItem'
    }

    if (!holding.item) {
      if (clicked.item) action = 'holdClickedItem'
      if (!clicked.item) action = ''
    }

    switch (action) {
      ////////////////////////
      // SWAP OR STACK ITEM //
      ////////////////////////
      case 'swapOrStackItem': {
        if (!holding.item || !clicked.item) return false

        // Same item type & its stackable -- try to stack
        if (holding.item.iid === clicked.item.iid && getItemInfo(clicked.item)?.stackable) {
          const stackQuantity = getItemInfo(clicked.item)?.stackQuantity || 0
          const numToAdd =
            Math.min(holding.item.quantity, stackQuantity - clicked.item.quantity) || 0

          const updatedHeldQuantity = holding.item.quantity - numToAdd
          const updatedClickedQuantity = clicked.item.quantity + numToAdd

          dispatch({
            type: `UPDATE_${clicked.slot.type}_SLOT`,
            slotIndex: clicked.slot.index,
            slotItem: { ...clicked.item, quantity: updatedClickedQuantity },
          })

          dispatch({
            type: `SET_HELD_ITEM`,
            item: { ...holding.item, quantity: updatedHeldQuantity },
          })
        }

        // Different item types -- swap places
        else {
          dispatch({
            type: `UPDATE_${type}_SLOT`,
            slotIndex: clicked.slot.index,
            slotItem: holding.item,
          })

          dispatch({
            type: `SET_HELD_ITEM`,
            item: clicked.item,
          })
        }

        break
      }

      ///////////////
      // MOVE ITEM //
      ///////////////
      case 'moveItem': {
        dispatch({ type: `CLEAR_HELD_ITEM` })
        dispatch({
          type: `UPDATE_${type}_SLOT`,
          slotIndex: clicked.slot.index,
          slotItem: holding.item,
        })
        break
      }

      ///////////////////////
      // HOLD CLICKED ITEM //
      ///////////////////////
      case 'holdClickedItem': {
        dispatch({ type: `SET_HELD_ITEM`, item: clicked.item })
        dispatch({ type: `UPDATE_${type}_SLOT`, slotIndex: index, slotItem: null })
        break
      }

      case 'doNothing':
      default:
        break
    }

    if (holding.item) {
      addHeldDraggedToSlotAction(type, index)
    }

    cleanupHeldItem()
  } catch (error) {
    console.error(error)
  }
}

//
// ─── RIGHT CLICK SLOT ───────────────────────────────────────────────────────────
//

export const rightClickSlotAction = async (type: SlotType, index: number) => {
  try {
    const clicked = { item: getState().slots[type][index], slot: { type, index } }
    const holding = getState().holding

    let action

    if (holding.item) {
      if (clicked.item) action = 'swapOrIncrementStack'
      if (!clicked.item) action = 'createSingleQuantityStack'
    }

    if (!holding.item) {
      if (clicked.item) action = 'takeHalfOfStack'
      if (!clicked.item) action = ''
    }

    switch (action) {
      /////////////////////////////
      // SWAP OR INCREMENT STACK //
      /////////////////////////////
      case 'swapOrIncrementStack': {
        if (holding.item && clicked.item) {
          const updatedHeldQuantity = holding.item.quantity - 1
          const updatedClickedQuantity = clicked.item.quantity + 1
          const stackQuantity = getItemInfo(clicked.item)?.stackQuantity || 0

          // Swap if items are different types
          if (clicked.item.iid !== holding.item.iid) {
            leftClickSlotAction(type, index)
            return false
          }

          // Short circuit if exceeds stack limit
          if (updatedClickedQuantity > stackQuantity) {
            return false
          }

          dispatch({
            type: `SET_HELD_ITEM`,
            item: { ...holding.item, quantity: updatedHeldQuantity },
          })

          dispatch({
            type: `UPDATE_${type}_SLOT`,
            slotIndex: index,
            slotItem: { ...clicked.item, quantity: updatedClickedQuantity },
          })
        }

        break
      }

      //////////////////////////////////
      // CREATE SINGLE QUANTITY STACK //
      //////////////////////////////////
      case 'createSingleQuantityStack': {
        if (holding.item) {
          const updatedHeldQuantity = holding.item.quantity - 1

          dispatch({
            type: `SET_HELD_ITEM`,
            item: { ...holding.item, quantity: updatedHeldQuantity },
          })

          dispatch({
            type: `UPDATE_${type}_SLOT`,
            slotIndex: index,
            slotItem: { ...holding.item, quantity: 1 },
          })
        }

        break
      }

      ////////////////////////
      // TAKE HALF OF STACK //
      ////////////////////////
      case 'takeHalfOfStack': {
        if (clicked.item) {
          const half = Math.floor(clicked.item.quantity / 2)
          const updatedHeldQuantity = clicked.item.quantity - half
          const updatedClickedQuantity = half

          if (updatedClickedQuantity === 0) {
            leftClickSlotAction(type, index)
            return true
          }

          dispatch({
            type: `SET_HELD_ITEM`,
            item: { ...clicked.item, quantity: updatedHeldQuantity },
          })

          dispatch({
            type: `UPDATE_${clicked.slot.type}_SLOT`,
            slotIndex: clicked.slot.index,
            slotItem: { ...clicked.item, quantity: updatedClickedQuantity },
          })
        }

        break
      }

      default:
        break
    }

    if (holding.item) {
      addHeldDraggedToSlotAction(type, index)
    }

    cleanupHeldItem()
  } catch (error) {
    console.error(error)
  }
}

//
// ─── LEFT CLICK DROPZONE ────────────────────────────────────────────────────────
//

export const leftClickDropzoneAction = async () => {
  try {
    const holding = getState().holding

    if (holding.item) {
      dispatch({ type: `CLEAR_HELD_ITEM` })
    }
  } catch (error) {
    console.error(error)
  }
}

//
// ─── QUICK SWAP SLOT TYPE ───────────────────────────────────────────────────────
//

export const quickSwapSlotTypeAction = async (type: SlotType, index: number) => {
  try {
    const clicked = { item: getState().slots[type][index], slot: { type, index } }

    if (clicked.item) {
      let destinationSlotType: SlotType = SlotType.BACKPACK

      if (type === SlotType.BACKPACK) destinationSlotType = SlotType.HOTBAR
      if (type === SlotType.HOTBAR) destinationSlotType = SlotType.BACKPACK

      const remaining = await addItemToInventoryAction(clicked.item.iid, clicked.item.quantity, {
        slotType: destinationSlotType,
      })

      dispatch({
        type: `UPDATE_${type}_SLOT`,
        slotIndex: index,
        slotItem: remaining === 0 ? null : { ...clicked.item, quantity: remaining },
      })
    }
  } catch (error) {
    console.error(error)
  }
}

//
// ─── QUICK COMBINE HELD INTO STACK ──────────────────────────────────────────────
//

export const quickCombineHeldIntoStackAction = async () => {
  try {
    const holding = getState().holding
    const itemInfo = getItemInfo(holding.item)

    if (!holding || !holding.item) return false
    if (!itemInfo?.stackable) return false
    if (itemInfo?.stackQuantity === holding.item.quantity) return false

    // Determine what quantity is needed to fill stack
    let quantityNeeded = itemInfo.stackQuantity - holding.item.quantity

    // Loop through all backpack & hotbar slots
    const slotTypes = [SlotType.BACKPACK, SlotType.HOTBAR]

    slotTypes.forEach(type => {
      const slots = getState().slots[type]

      slots.forEach((item: Item | null, index: number) => {
        if (!item || item.iid !== holding?.item?.iid) return // Ignore empty slots & non-same items
        if (item.quantity === itemInfo.stackQuantity) return // Ignore already full stacks
        if (quantityNeeded <= 0) return // Stack in hand is filled

        quantityNeeded = quantityNeeded - item.quantity

        dispatch({
          type: `UPDATE_${type}_SLOT`,
          slotIndex: index,
          slotItem: quantityNeeded >= 0 ? null : { iid: item.iid, quantity: -quantityNeeded },
        })
      })

      setHeldItemQuantity(itemInfo.stackQuantity - Math.max(0, quantityNeeded))
    })
  } catch (error) {
    console.error(error)
  }
}

//
// ─── ADD ITEM TO INVENTORY ──────────────────────────────────────────────────────
// This function will try to add {quantity} number of {iid} item to the
// inventory, with rules:
// - Try to fill existing backpack stacks (if stackable)
// - Try to fill existing hotbar stacks (if stackable)
// - Try to create new stack in empty backpack slot
// - Try to create new stack in empty hotbar slot

export const addItemToInventoryAction = async (
  iid: string,
  quantity: number,
  options?: { slotType?: SlotType }
) => {
  try {
    const itemInfo = getItemInfo({ iid, quantity })
    if (!itemInfo) throw new Error(`Unable to determine item properties for "${iid}"`)

    // Keep track of the quantity we need to add per slot
    let remaining = quantity

    // If stackable, try to fill existing slots stack(s) first
    // Note: if {options.slotType} is provided, it will only attempt to fill slots of the specified
    // type. Otherwise, it will attempt to first fill all BACKPACK stacks then HOTBAR stacks
    if (itemInfo.stackable) {
      if (options?.slotType) {
        remaining = addToExistingSlot(iid, remaining, options.slotType)
      } else {
        remaining = addToExistingSlot(iid, remaining, SlotType.BACKPACK)
        remaining = addToExistingSlot(iid, remaining, SlotType.HOTBAR)
      }
    }

    // Otherwise fill into new slot(s) for the item
    // Note: if {options.slotType} is provided, it will only attempt to fill slots of the specified
    // type. Otherwise, it will attempt to first fill all BACKPACK slots then HOTBAR slots
    if (remaining > 0) {
      if (options?.slotType) {
        remaining = addToEmptySlot(iid, remaining, options.slotType)
      } else {
        remaining = addToEmptySlot(iid, remaining, SlotType.BACKPACK)
        remaining = addToEmptySlot(iid, remaining, SlotType.HOTBAR)
      }
    }

    // If there is any quantity remaining, that mean's there was no space left in the inventory
    return remaining
  } catch (error) {
    console.error(error)
  }
}

//
// ─── PURGE INVENTORY ────────────────────────────────────────────────────────────
//

export const purgeInventoryAction = async () => {
  try {
    dispatch({ type: `PURGE_INVENTORY` })
  } catch (error) {
    console.error(error)
  }
}

//
// ─── SET HELD DRAGGING ──────────────────────────────────────────────────────────
//

export const setHeldDraggingAction = async (isDragging: 'lmb' | 'rmb' | null) => {
  try {
    dispatch({ type: `SET_HELD_DRAGGING`, isDragging: isDragging })
  } catch (error) {
    console.error(error)
  }
}

//
// ─── ADD HELD DRAGGED TO SLOT ───────────────────────────────────────────────────
//

export const addHeldDraggedToSlotAction = async (type: SlotType, index: number) => {
  try {
    const hovered = getInventorySlot(type, index)
    const holding = getState().holding

    const updatedDraggedTo = uniqWith([...holding.draggedTo, { type, index }], isEqual)

    // Prevent logic running twice if user drags over already dragged slot
    if (updatedDraggedTo.length === holding.draggedTo.length) return false

    // Only run the logic if more than 1 slot has been dragged over
    if (updatedDraggedTo.length > 1) {
      const originalQuantity =
        updatedDraggedTo.reduce(
          (a, b) => a + (getInventorySlot(b.type, b.index).item?.quantity || 0),
          0
        ) + (holding.item?.quantity || 0)

      const original = getInventorySlot(updatedDraggedTo[0].type, updatedDraggedTo[0].index)

      // Distribute evenly across all {updatedDraggedTo} slots
      if (holding.isDragging === 'lmb') {
        // Short circuit if some item swapping had occurred
        if (hovered.item && hovered.item.iid !== original.item?.iid) return false
        if (holding.item && holding.item.iid !== original.item?.iid) return false

        // Determine how much should be in hand & how much per split stack
        const leftInHand = originalQuantity % updatedDraggedTo.length
        const splitQuantity = (originalQuantity - leftInHand) / updatedDraggedTo.length
        if (splitQuantity <= 0) return false

        // Update the stacks / slots
        updatedDraggedTo.forEach(draggedSlot => {
          dispatch({
            type: `UPDATE_${draggedSlot.type}_SLOT`,
            slotIndex: draggedSlot.index,
            slotItem: { iid: original.item?.iid, quantity: splitQuantity },
          })

          dispatch({
            type: `SET_HELD_ITEM`,
            item: leftInHand > 0 ? { iid: original.item?.iid, quantity: leftInHand } : null,
          })
        })
      }

      // Distribute by single increments across all {updatedDraggedTo} slots
      if (holding.isDragging === 'rmb') {
        // Short circuit if non-same item or nothing left in hand
        if (hovered.item && hovered.item.iid !== holding.item?.iid) return false
        if (!holding.item) return false

        if (holding.item) {
          if (hovered.item) addToExistingSlot(holding.item?.iid, 1, type, index)
          else addToEmptySlot(holding.item.iid, 1, type, index)

          setHeldItemQuantity(holding.item?.quantity - 1)
        }
      }
    }

    dispatch({ type: `SET_HELD_DRAGGED_TO_SLOT`, draggedTo: updatedDraggedTo })
  } catch (error) {
    console.error(error)
  }
}

//
// ─── RESET HELD DRAGGED TO SLOTS ─────────────────────────────────────────────────
//

export const resetHeldDraggedToSlotsAction = async () => {
  try {
    dispatch({ type: `SET_HELD_DRAGGED_TO_SLOT`, draggedTo: [] })
  } catch (error) {
    console.error(error)
  }
}

//
// ─── MISC ───────────────────────────────────────────────────────────────────────
//

// Function that will try to add {amount} of {iid} to any existing slots with the same item
const addToExistingSlot = (iid: string, amount: number, type: SlotType, slotIndex?: number) => {
  const slots = getState().slots[type]
  const itemInfo = getItemInfo(iid)
  if (!itemInfo) throw new Error(`Unable to determine item properties for "${iid}"`)

  const add = (item: Item, index: number) => {
    if (amount > 0) {
      let numToAdd = itemInfo.stackQuantity - (item.quantity || 0)
      numToAdd = Math.min(numToAdd, amount)
      amount = amount - numToAdd

      const slotItem = { iid: iid, quantity: (item.quantity += numToAdd) }

      dispatch({ type: `UPDATE_${type}_SLOT`, slotIndex: index, slotItem: slotItem })
    }
  }

  // Add to specific slot index
  if (slotIndex) {
    const item = slots[slotIndex]
    if (item) add(item, slotIndex)
    return amount
  }

  // Otherwise try to add to slots sequentially
  slots.forEach((item: Item | null, index: number) => {
    if (!item || item.iid !== iid) return // Ignore empty slots & non-same items
    add(item, index)
  })

  return amount
}

// Function that will try to add {amount} of {iid} to an empty slot
const addToEmptySlot = (iid: string, amount: number, type: SlotType, slotIndex?: number) => {
  const slots = getState().slots[type]
  const itemInfo = getItemInfo(iid)
  if (!itemInfo) throw new Error(`Unable to determine item properties for "${iid}"`)

  const add = (index: number) => {
    if (amount > 0) {
      let numToAdd = amount
      numToAdd = Math.min(numToAdd, itemInfo.stackQuantity)
      amount = amount - numToAdd

      const slotItem = { iid: iid, quantity: numToAdd }

      dispatch({ type: `UPDATE_${type}_SLOT`, slotIndex: index, slotItem: slotItem })
    }
  }

  // Add to specific slot index
  if (slotIndex) {
    const item = slots[slotIndex]
    if (!item) add(slotIndex)
    return amount
  }

  // Otherwise try to add to slots sequentially
  slots.forEach((item: Item | null, index: number) => {
    if (!!item) return // Ignore non-empty slots
    add(index)
  })

  return amount
}

const setHeldItemQuantity = (quantity: number) => {
  const holding = getState().holding
  dispatch({ type: `SET_HELD_ITEM`, item: { ...holding.item, quantity: quantity } })

  if (quantity <= 0) cleanupHeldItem()
}

const cleanupHeldItem = () => {
  try {
    const holding = getState().holding

    if (holding.item?.quantity === 0) {
      dispatch({ type: `CLEAR_HELD_ITEM` })
    }
  } catch (error) {
    console.error(error)
  }
}
