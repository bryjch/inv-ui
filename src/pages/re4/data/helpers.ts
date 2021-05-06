import { Item, Dimensions, XYCoord } from '../data/definitions'

//
// ────────────────────────────────────────────────────────────────────────────────
//

/**
 * Return the {x,y} position of an item at position {index} in array
 */

export const indexToCoord = (index: number, gridDimensions: Dimensions): XYCoord => {
  return { x: index % gridDimensions.w, y: Math.floor(index / gridDimensions.w) }
}

//
// ────────────────────────────────────────────────────────────────────────────────
//

/**
 * Return the index position of an item at coord {x,y} on the grid
 */

export const coordToIndex = (coord: XYCoord, gridDimensions: Dimensions): number => {
  return coord.x + coord.y * gridDimensions.w
}

//
// ────────────────────────────────────────────────────────────────────────────────
//

/**
 * Return arrays of the slots that this item would take up at {position}
 * on a grid with {Dimensions}
 */

export const getItemOccupiedSlots = (
  item: Item,
  position: XYCoord | number | undefined,
  gridDimensions: Dimensions
) => {
  if (position === undefined) return []

  if (typeof position === 'number') {
    position = indexToCoord(position, gridDimensions)
  }

  return calculateSlotsFromEdges(
    position,
    {
      x: position.x + item.dimensions.w - 1,
      y: position.y + item.dimensions.h - 1,
    },
    gridDimensions
  )
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
  bottomRight: XYCoord,
  gridDimensions: Dimensions
): [number[], XYCoord[]] => {
  const slots = []

  for (let x = topLeft.x; x <= bottomRight.x; x++) {
    for (let y = topLeft.y; y <= bottomRight.y; y++) {
      const slot = { x: x, y: y }

      if (slot.x < 0 || slot.x > gridDimensions.w - 1) continue
      if (slot.y < 0 || slot.y > gridDimensions.h - 1) continue

      slots.push(slot)
    }
  }

  return [slots.map(slot => coordToIndex(slot, gridDimensions)), slots]
}
