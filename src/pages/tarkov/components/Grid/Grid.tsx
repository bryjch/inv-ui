import React, { useState, useRef, useEffect, useCallback } from 'react'
import { range, clamp, isEmpty } from 'lodash'

import { GridSlot } from './GridSlot'
import { XYCoord } from '../../data/definitions'
import { DEFAULT_GRID_SIZE } from '../../data/constants'
import { coordToIndex, getRotatedDimensions } from '../../data/helpers'
import { onClickDragArea, onClickDragAreaItem, onMouseOverDragArea } from '../../utils/mouseEvents'

import { dispatch, useStore, getState } from '@zus/tarkov/store'
import {
  updateDraggingAction,
  updateDragHoveringSlotsAction,
  initializeGridAction,
  isValidGridPlacement,
} from '@zus/tarkov/actions'

////////////////
// Prop types //
////////////////
export type GridProps = {
  id: string
  cols: number
  rows: number
  gridSize?: number
} & typeof defaultProps

const defaultProps = {
  gridSize: DEFAULT_GRID_SIZE,
}

//////////////////////////
// Component definition //
//////////////////////////
export const Grid = (props: GridProps) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const mousePos = useRef<XYCoord>({ x: 0, y: 0 }) // Don't use useState because it tanks performance
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
    if (isOver) updateHoveringPreviewSlot(mousePos.current)
  }, [isOver, dragging.item?.rotated]) // eslint-disable-line react-hooks/exhaustive-deps

  const onMouseMove = (event: React.MouseEvent) => {
    mousePos.current = { x: event.clientX, y: event.clientY }
    updateHoveringPreviewSlot(mousePos.current)
  }

  //
  // ─── METHODS ────────────────────────────────────────────────────────────────────
  //

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

  const getPreviewStyle = useCallback(
    (from: string | null) => {
      const { item } = getState().dragging

      if (!item || !previewCoord || !isOver || !ref.current || !from) {
        return { opacity: 0 }
      }

      const rect = ref.current.getBoundingClientRect()
      const gridSize = rect.width / grid.area.w
      const isValid = isValidGridPlacement(props.id, item, previewCoord)

      return {
        transform: `translate(${previewCoord.x * gridSize}px, ${previewCoord.y * gridSize}px)`,
        width: getRotatedDimensions(item).w * gridSize,
        height: getRotatedDimensions(item).h * gridSize,
        maxWidth: grid.area.w * gridSize,
        maxHeight: grid.area.h * gridSize,
        backgroundColor: isValid ? 'rgba(0,255,0,0.3)' : 'rgba(255,0,0,0.3)',
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
        onMouseEnter={onMouseOverDragArea(props.id, 'enter')}
        onMouseLeave={onMouseOverDragArea(props.id, 'exit')}
        onMouseDown={onClickDragArea(props.id)}
        onMouseMove={onMouseMove}
      >
        {!isEmpty(grid) &&
          range(0, props.cols * props.rows).map(index => (
            <GridSlot
              key={`${props.id}-slot-${index}`}
              index={index}
              gridId={props.id}
              item={grid.items.find(({ position }) => position === index)}
              onClickItem={item => onClickDragAreaItem(props.id, item)}
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
          border: var(--grid-border-width) solid var(--grid-border-color);
          outline: 1px solid #000000;
          flex-shrink: 0;
        }

        .grid {
          position: relative;
          width: ${props.cols * props.gridSize}px;
          max-width: 100%;
          display: grid;
          grid-template-columns: repeat(${props.cols}, 1fr);
          grid-gap: 0px;

          .slots-validity-preview {
            position: absolute;
            pointer-events: none;
          }
        }
      `}</style>
    </div>
  )
}

Grid.defaultProps = defaultProps
