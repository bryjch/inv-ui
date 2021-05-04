import { XYCoord } from 'react-dnd'
import { intersection } from 'lodash'

import { NUM_COLUMNS, NUM_ROWS } from '../components/Briefcase'
import { ItemConfig, Item, Dimensions } from '../data/definitions'
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
 */

export const calculateSlotBounds = (
  currentIndex: number,
  dimensions: Dimensions,
  mouseOffset: XYCoord,
  gridSize: number = 60
): [topLeft: XYCoord, bottomRight: XYCoord] => {
  // Convert the 1D index to 2D slot coordinate
  const currentCoord = indexToCoord(currentIndex)

  const offset: XYCoord = {
    x: Math.floor((mouseOffset.x / (dimensions.w * gridSize)) * dimensions.w),
    y: Math.floor((mouseOffset.y / (dimensions.h * gridSize)) * dimensions.h),
  }

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

export const calculateSlotsFromEdges = (
  topLeft: XYCoord,
  bottomRight: XYCoord
): [number[], XYCoord[]] => {
  const slots = []

  for (let x = topLeft.x; x <= bottomRight.x; x++) {
    for (let y = topLeft.y; y <= bottomRight.y; y++) {
      const slot = { x: x, y: y }

      if (slot.x < 0 || slot.x > NUM_COLUMNS - 1) continue
      if (slot.y < 0 || slot.y > NUM_ROWS - 1) continue

      slots.push(slot)
    }
  }

  return [slots.map(coordToIndex), slots]
}

//
// ────────────────────────────────────────────────────────────────────────────────
//

// TODO: delete this function if remains unused

export function getFilledBriefcaseSlots(): number[] {
  const { briefcase } = getState()

  const slots: number[] = []

  briefcase.items.forEach(({ position, dimensions }) => {
    if (position === undefined) return false

    const [occupyingSlots] = calculateSlotsFromEdges(indexToCoord(position), {
      x: indexToCoord(position).x + dimensions.w - 1,
      y: indexToCoord(position).y + dimensions.h - 1,
    })

    slots.push(...occupyingSlots)
  })

  return slots
}

//
// ────────────────────────────────────────────────────────────────────────────────
//

// TODO: delete this function if remains unused

export function canBeBriefcased(item: Item, position: XYCoord): boolean
export function canBeBriefcased(item: Item, index: number): boolean
export function canBeBriefcased(item: Item, at: any): boolean {
  const { dragging } = getState()

  // Right now the {at} value isn't being used -- using {dragging.occupying} instead
  if (typeof at === 'number') at = indexToCoord(at)

  // Check if user is hovering enough briefcase slots
  const numSlotsNeeded = item.dimensions.w * item.dimensions.h

  if (dragging.index && dragging.occupying.length < numSlotsNeeded) return false

  const filledBriefcaseSlots = getFilledBriefcaseSlots()

  return intersection(filledBriefcaseSlots, dragging.occupying).length === 0
}
