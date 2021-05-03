import { XYCoord } from 'react-dnd'
import { intersection } from 'lodash'

import { NUM_COLUMNS, NUM_ROWS } from '../components/Briefcase'

import { ItemConfig, Item, Quadrants, Dimensions } from '../data/definitions'
import items from '../data/items.json'

import { getState } from '@zus/re4/store'

const itemsConfig = items as ItemConfig[]

//
// ────────────────────────────────────────────────────────────────────────────────
//

/**
 * Get item data from items.json based on {iid}
 */

export const getItem = (iid: string): Item => {
  const item = itemsConfig.find(item => item.iid === iid)

  if (item) return item

  throw new Error(`Unable to find item with iid: ${iid}`)
}

//
// ────────────────────────────────────────────────────────────────────────────────
//

/**
 * Return the {x,y} position of an item at position {index} in array
 */

export const indexToCoord = (index: number): XYCoord => {
  return { x: index % NUM_COLUMNS, y: Math.floor(index / NUM_COLUMNS) }
}

//
// ────────────────────────────────────────────────────────────────────────────────
//

/**
 * Return the index position of an item at coord {x,y} on the grid
 */

export const coordToIndex = (coord: XYCoord): number => {
  return coord.x + coord.y * NUM_COLUMNS
}

//
// ────────────────────────────────────────────────────────────────────────────────
//

/**
 * Determine the correct bounds for the item being held if user is
 * hovering over {currentIndex} slot.
 *
 * Takes into account the quadrant of the slot they are hovering over.
 *
 * This is necessary because we force the cursor to always be centered
 * on the held item, and the slot our cursor is hovering will be the
 * "center" of the item, not the "top left" of the item.
 */

export const calculateSlotBounds = (
  currentIndex: number,
  dimensions: Dimensions,
  quadrants: Quadrants
): [topLeft: XYCoord, bottomRight: XYCoord] => {
  // Convert the 1D index to 2D slot coordinate
  const currentCoord = indexToCoord(currentIndex)

  // Determine the necessary offset depending on the quadrant in focus
  const wFunc = quadrants.left ? Math.ceil : Math.floor
  const hFunc = quadrants.top ? Math.ceil : Math.floor
  const offset: XYCoord = { x: wFunc((dimensions.w - 1) / 2), y: hFunc((dimensions.h - 1) / 2) }

  // Determine what the new top-left and bottom-right coordinates should be
  const topLeft = { x: currentCoord.x - offset.x, y: currentCoord.y - offset.y }
  const bottomRight = { x: topLeft.x + dimensions.w - 1, y: topLeft.y + dimensions.h - 1 }

  return [topLeft, bottomRight]
}

//
// ────────────────────────────────────────────────────────────────────────────────
//

/**
 * Determine which slots would be occupied on the grid from {topLeft}
 * to {bottomRight}.
 * Takes into account if any of these slots are out of bounds.
 */

export const calculateOccupyingSlots = (topLeft: XYCoord, bottomRight: XYCoord): XYCoord[] => {
  const slots = []

  for (let x = topLeft.x; x <= bottomRight.x; x++) {
    for (let y = topLeft.y; y <= bottomRight.y; y++) {
      const slot = { x: x, y: y }

      if (slot.x < 0 || slot.x > NUM_COLUMNS - 1) continue
      if (slot.y < 0 || slot.y > NUM_ROWS - 1) continue

      slots.push(slot)
    }
  }

  return slots
}

export function canBeBriefcased(item: Item, position: XYCoord): boolean
export function canBeBriefcased(item: Item, index: number): boolean
export function canBeBriefcased(item: Item, at: any): boolean {
  const { dragging, briefcase } = getState()

  if (typeof at === 'number') at = indexToCoord(at)

  // Check if user is hovering enough briefcase slots
  const numSlotsNeeded = item.dimensions.w * item.dimensions.h

  if (dragging.index && dragging.occupying.length < numSlotsNeeded) return false

  // Check the existing items in briefcase to see if theres any collision
  const collided = briefcase.items.some(({ position, dimensions }) => {
    if (position === undefined) return false

    const filledCoords = calculateOccupyingSlots(indexToCoord(position), {
      x: indexToCoord(position).x + dimensions.w - 1,
      y: indexToCoord(position).y + dimensions.h - 1,
    })

    const filledIndexes = filledCoords.map(coordToIndex)

    return intersection(filledIndexes, dragging.occupying).length > 0
  })

  return !collided
}
