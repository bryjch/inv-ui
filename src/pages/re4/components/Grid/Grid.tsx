import { useRef, useState, useEffect, useCallback } from 'react'
import shallow from 'zustand/shallow'
import { DropTargetMonitor, useDrop } from 'react-dnd'
import { range, throttle, clamp, intersection, difference, isEmpty } from 'lodash'

import { GridSlot } from './GridSlot'
import { coordToIndex, getItemOccupiedSlots } from '../../data/helpers'

import { dispatch, getState, useStore } from '@zus/re4/store'
import {
  updateDraggingAction,
  updateDragHoveringSlotsAction,
  clearDragHoveringSlotsAction,
  initializeGridAction,
} from '@zus/re4/actions'

export interface GridProps {
  id: string
  cols: number
  rows: number
  gridSize?: number
  onGridHover?: (args: { status: boolean }) => any
}

export const Grid = (props: GridProps) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const grid = useStore(useCallback(state => state.grids[props.id] || {}, [props.id]))
  const dragging = useStore(
    useCallback(
      state => ({
        from: state.dragging.from,
        to: state.dragging.to,
        item: state.dragging.item,
        hovering: state.dragging.hovering,
      }),
      []
    ),
    shallow
  )

  const [collided, setCollided] = useState<number[]>([])

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  useEffect(() => {
    dispatch(initializeGridAction(props.id, props.cols, props.rows))
  }, [props.id, props.cols, props.rows])

  useEffect(() => {
    if (!grid || !dragging.item || dragging.to !== props.id) return

    // Slots of the destination grid that are filled
    let actualFilledSlots = getState().grids[dragging.to].occupied

    // If the item is being moved within the same grid, we need to
    // consider the item's "original occupying slots" and subtract
    // them from the "actual filled slots"
    if (dragging.from === props.id) {
      const [hoveredSlots] = getItemOccupiedSlots(dragging.item, grid.area)

      actualFilledSlots = difference(grid.occupied, hoveredSlots)
    }

    // Determine if the item being dragged is colliding with anything
    const colliding = intersection(actualFilledSlots, dragging.hovering)

    setCollided(colliding)
  }, [dragging, grid, props.id])

  const onGridHover = throttle((_: any, monitor: DropTargetMonitor) => {
    if (!ref.current || !grid) return null

    // Reset on hover out
    if (!monitor.isOver()) {
      dispatch(updateDraggingAction({ to: null }))
      dispatch(clearDragHoveringSlotsAction())
      return null
    }

    const clientOffset = monitor.getClientOffset()
    const initialClientOffset = monitor.getInitialClientOffset()
    const gridBoundingRect = ref.current.getBoundingClientRect()

    if (!clientOffset || !initialClientOffset) return null

    const { width, height, left, top } = gridBoundingRect
    const gridSize = gridBoundingRect.width / props.cols

    // Snap offset will be different depending on where the item is dragged from.
    //
    // If from another grid:
    //  Take into account the position of the mouse on the current slot such that
    //  when moving the item, it will only "snap" when moving in steps if {gridSize}
    //  relative to start of drag -- instead of relative to the visual grid
    //
    // If from anywhere else:
    //  Just offset to center of the slot
    const { grids, dragging } = getState()
    let snapOffset

    // Store the snap offset information in store so that it will be persistent
    // if dragging between different Grids
    if (!dragging.snapOffset.x && !dragging.snapOffset.y) {
      const useGridOffset = !!dragging.from && !!grids[dragging.from]

      if (useGridOffset) {
        snapOffset = {
          x: gridSize * -0.5 + ((initialClientOffset.x - left) % gridSize),
          y: gridSize * -0.5 + ((initialClientOffset.y - top) % gridSize),
        }
      } else {
        snapOffset = { x: gridSize * -0.5, y: gridSize * -0.5 }
      }

      dispatch(updateDraggingAction({ snapOffset: snapOffset }))
    } else {
      snapOffset = dragging.snapOffset
    }

    const xPos = clamp(clientOffset.x - left - snapOffset.x, 0, width - 1)
    const yPos = clamp(clientOffset.y - top - snapOffset.y, 0, height - 1)

    const gridOffset = {
      x: Math.floor(xPos / gridSize),
      y: Math.floor(yPos / gridSize),
    }

    if (coordToIndex(gridOffset, grid.area) !== dragging.index) {
      dispatch(updateDraggingAction({ to: props.id, index: coordToIndex(gridOffset, grid.area) }))
      dispatch(updateDragHoveringSlotsAction(props.id, gridSize))
    }
  }, 50)

  const [, connectDropRef] = useDrop(
    () => ({
      accept: ['GridItem', 'ListingItem'],
      hover: onGridHover,
    }),
    [grid]
  )

  connectDropRef(ref)

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  return (
    <div id={props.id} className="grid" ref={ref}>
      {!isEmpty(grid) &&
        range(0, props.cols * props.rows).map(index => {
          let status = []

          if (dragging.to === props.id && dragging.item && dragging.hovering.includes(index)) {
            // Account if item being dragged is partially out of bounds
            const slotsRequired = dragging.item.dimensions.w * dragging.item.dimensions.h

            status.push('hovered')

            if (collided.length > 0 || slotsRequired > dragging.hovering.length) {
              status.push('invalid')
            } else {
              status.push('valid')
            }
          }

          return (
            <GridSlot
              key={`${props.id}-slot-${index}`}
              index={index}
              gridId={props.id}
              item={grid.items.find(({ position }) => position === index)}
              status={status}
            />
          )
        })}

      <style jsx>{`
        .grid {
          position: relative;
          width: ${props.cols * (props.gridSize || 60)}px;
          max-width: 100%;
          display: grid;
          grid-template-columns: repeat(${props.cols}, 1fr);
          grid-gap: 0px;
        }
      `}</style>
    </div>
  )
}
