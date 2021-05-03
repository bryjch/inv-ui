import { useEffect, useRef } from 'react'
import { DropTargetMonitor, useDrop } from 'react-dnd'

import { DropType } from '../../data/definitions'

import { dispatch, useStore } from '@zus/re4/store'
import { updateDraggingAction, updateQuadrantsAction } from '@zus/re4/actions'

export const BriefcaseSlot = (props: { index: number }) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const occupied = useStore(state => state.dragging.occupying.includes(props.index))

  //
  // ─── METHODS ────────────────────────────────────────────────────────────────────
  //

  // Reference: https://github.com/react-dnd/react-dnd/issues/1413
  const onSlotHover = (_: any, monitor: DropTargetMonitor) => {
    try {
      if (!ref.current) return null

      // Determine the drop target xy coordinates on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect()

      // Determine the mouse position xy coordinates on screen
      const clientOffset = monitor.getClientOffset()

      if (!clientOffset) return null

      // Determine the width and height of the drop target
      const width = hoverBoundingRect.right - hoverBoundingRect.left
      const height = hoverBoundingRect.bottom - hoverBoundingRect.top

      // Determine the distance from the mouse position to the drop target locations
      const distToTop = clientOffset.y - hoverBoundingRect.top
      const distToLeft = clientOffset.x - hoverBoundingRect.left
      const distToRight = hoverBoundingRect.right - clientOffset.x
      const distToBottom = hoverBoundingRect.bottom - clientOffset.y

      // Pick the closest of the valid drop target locations
      const minX = Math.min(distToLeft, distToRight)
      const minY = Math.min(distToTop, distToBottom)

      const quadrants: any = {}

      quadrants.top = minY === distToTop && distToTop < height / 2
      quadrants.left = minX === distToLeft && distToLeft < width / 2
      quadrants.right = minX === distToRight && distToRight < width / 2
      quadrants.bottom = minY === distToBottom && distToBottom < height / 2

      dispatch(updateQuadrantsAction(quadrants))
    } catch (error) {
      console.error(error)
    }
  }

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  const [collectedProps, connectDropRef] = useDrop(() => {
    return {
      accept: [DropType.Briefcase, DropType.Storage],
      hover: onSlotHover,
      collect: monitor => ({
        isOver: monitor.isOver(),
      }),
    }
  })

  useEffect(() => {
    if (collectedProps.isOver) {
      dispatch(updateDraggingAction({ index: props.index }))
    }
  }, [collectedProps.isOver, props.index])

  connectDropRef(ref)

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  return (
    <div className="slot" ref={ref}>
      {/* <div>{props.index}</div> */}

      {/* <small>
        {props.index % 10},{Math.floor(props.index / 10)}
      </small> */}

      <style jsx>{`
        .slot {
          position: relative;
          min-width: 0;
          width: 100%;
          flex: 1;
          aspect-ratio: 1;
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;
          background-color: ${occupied ? 'green' : '#8b8b8b'};

          &:before {
            position: absolute;
            width: 100%;
            height: 100%;
            content: '';
          }
        }
      `}</style>
    </div>
  )
}
