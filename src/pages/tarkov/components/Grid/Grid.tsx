import React, { useState, useRef, useEffect, useCallback } from 'react'
import { range, clamp, isEmpty, difference, intersection } from 'lodash'

import { GridSlot } from './GridSlot'
import { XYCoord } from '../../data/definitions'
import { DEFAULT_GRID_SIZE } from '../../data/constants'
import { coordToIndex, getItemOccupiedSlots, getRotatedDimensions } from '../../data/helpers'

import { dispatch, useStore, getState } from '@zus/tarkov/store'
import {
  updateDraggingAction,
  updateDragHoveringSlotsAction,
  initializeGridAction,
} from '@zus/tarkov/actions'

export interface GridProps {
  id: string
  cols: number
  rows: number
  gridSize?: number
  onGridHover?: (args: { status: boolean }) => any
  onClickArea?: (event: React.MouseEvent, data: { [key: string]: any }) => any
  onHoverArea?: (event: React.MouseEvent, data: { [key: string]: any }) => any
}

export const Grid = (props: GridProps) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [mousePos, setMousePos] = useState<XYCoord>({ x: 0, y: 0 })
  const grid = useStore(useCallback(state => state.grids[props.id] || {}, [props.id]))
  const dragging = useStore(state => state.dragging)

  const [previewCoord, setPreviewCoord] = useState<XYCoord | null>(null)
  const isOver = dragging.to === props.id

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  useEffect(() => {
    dispatch(initializeGridAction(props.id, props.cols, props.rows))
  }, [props.id, props.cols, props.rows])

  useEffect(() => {
    if (!isOver) setPreviewCoord(null)
  }, [isOver])

  useEffect(() => {
    if (isOver) updateHoveringPreviewSlot(mousePos)
  }, [isOver, dragging.item?.rotated]) // eslint-disable-line react-hooks/exhaustive-deps

  const onMouseMove = (event: React.MouseEvent) => {
    setMousePos({ x: event.clientX, y: event.clientY })
    updateHoveringPreviewSlot({ x: event.clientX, y: event.clientY })
  }

  const updateHoveringPreviewSlot = useCallback(
    (pos: XYCoord) => {
      const { dragging } = getState() // Use getState() because of awkward dependency timings

      if (!dragging.item || !ref.current) return null

      const rect = ref.current.getBoundingClientRect()

      const gridSize = rect.width / grid.area.w
      const slotCenterOffset = { x: gridSize * 0.5, y: gridSize * 0.5 }
      // Clamp the coordinates to prevent selection going out of bounds
      const xPos = clamp(
        pos.x - rect.left - slotCenterOffset.x - dragging.gridOffset.x,
        0,
        rect.width - getRotatedDimensions(dragging.item).w * gridSize
      )
      const yPos = clamp(
        pos.y - rect.top - slotCenterOffset.y - dragging.gridOffset.y,
        0,
        rect.height - getRotatedDimensions(dragging.item).h * gridSize
      )

      // Convert screen mouse coordinates into grid coordinates
      const position = { x: Math.ceil(xPos / gridSize), y: Math.ceil(yPos / gridSize) }
      const hoveredIndex = coordToIndex(position, grid.area)

      if (props.id !== dragging.to || hoveredIndex !== dragging.index) {
        dispatch(updateDraggingAction({ index: hoveredIndex }))
        dispatch(updateDragHoveringSlotsAction(props.id, gridSize))
        setPreviewCoord(position)
      }
    },
    [grid, props.id]
  )

  //
  // ─── METHODS ────────────────────────────────────────────────────────────────────
  //

  const getPreviewStyle = useCallback(
    (from: string | null) => {
      const { item } = getState().dragging

      if (!item || !previewCoord || !isOver || !ref.current || !from) {
        return { opacity: 0 }
      }

      const rect = ref.current.getBoundingClientRect()
      const gridSize = rect.width / grid.area.w

      let actualFilledSlots = grid.occupied
      const [previewSlots] = getItemOccupiedSlots(item, previewCoord, grid.area)

      // If the item is being moved within the same grid, we need to
      // consider the item's "original occupying slots" and subtract
      // them from the "actual filled slots"
      if (from === props.id) {
        const originalItem = grid.items.find(({ uuid }) => uuid === item.uuid)
        if (!originalItem) throw new Error('Unable to find original item')

        const [originalSlots] = getItemOccupiedSlots(originalItem, item.position, grid.area)
        actualFilledSlots = difference(grid.occupied, originalSlots)
      }

      // TODO: this logic is duplicated in actions.ts -- consider making a helper func
      const overlappingSlots = intersection(actualFilledSlots, previewSlots)
      const enoughSlots = previewSlots.length === item.dimensions.w * item.dimensions.h
      const isValid = overlappingSlots.length === 0 && enoughSlots

      return {
        transform: `translate(${previewCoord.x * gridSize}px, ${previewCoord.y * gridSize}px)`,
        width: getRotatedDimensions(item).w * gridSize,
        height: getRotatedDimensions(item).h * gridSize,
        maxWidth: grid.area.w * gridSize,
        maxHeight: grid.area.h * gridSize,
        backgroundColor: isValid ? 'green' : 'red',
      }
    },
    [previewCoord, isOver, grid, props.id]
  )

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  return (
    <div className="grid-container">
      <div
        ref={ref}
        id={props.id}
        className="grid"
        onMouseMove={e => onMouseMove(e)}
        onMouseEnter={e => props.onHoverArea?.(e, { state: 'enter', target: props.id })}
        onMouseOut={e => props.onHoverArea?.(e, { state: 'exit', target: props.id })}
        onMouseDown={e => props.onClickArea?.(e, { item: null, target: props.id })}
        onContextMenu={e => e.preventDefault()}
      >
        {!isEmpty(grid) &&
          range(0, props.cols * props.rows).map(index => (
            <GridSlot
              key={`${props.id}-slot-${index}`}
              index={index}
              gridId={props.id}
              item={grid.items.find(({ position }) => position === index)}
              onClickArea={async (e, data) => {
                await props.onClickArea?.(e, data)
                onMouseMove(e) // Additionally call onMouseMove to trigger preview calculation
              }}
            />
          ))}

        {dragging.item && (
          <div className="slots-validity-preview" style={getPreviewStyle(dragging.from)} />
        )}
      </div>

      <style jsx>{`
        .grid-container {
          position: relative;
          max-height: 100%;
          overflow-y: auto;
          border: 2px solid rgba(160, 160, 160, 1);
          flex-shrink: 0;
        }

        .grid {
          position: relative;
          width: ${props.cols * (props.gridSize || DEFAULT_GRID_SIZE)}px;
          max-width: 100%;
          display: grid;
          grid-template-columns: repeat(${props.cols}, 1fr);
          grid-gap: 0px;

          .slots-validity-preview {
            position: absolute;
            pointer-events: none;
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}
