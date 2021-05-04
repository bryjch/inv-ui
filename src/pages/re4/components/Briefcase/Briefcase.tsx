import { useEffect, useRef } from 'react'
import { DropTargetMonitor, useDrop } from 'react-dnd'
import { range, throttle, clamp } from 'lodash'

import { BriefcaseSlot } from './BriefcaseSlot'
import { DropType } from '../../data/definitions'
import { getItem, coordToIndex } from '../../data/helpers'

import { dispatch } from '@zus/re4/store'
import {
  updateDraggingAction,
  addItemToBriefcaseAction,
  clearOccupyingSlotsAction,
  updateOccupyingSlotsAction,
} from '@zus/re4/actions'

export const NUM_COLUMNS = 10
export const NUM_ROWS = 6

export const Briefcase = () => {
  const ref = useRef<HTMLDivElement | null>(null)

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  const onBriefcaseHover = throttle((_: any, monitor: DropTargetMonitor) => {
    if (!ref.current || !monitor.isOver()) return null

    const clientOffset = monitor.getClientOffset()
    const initialClientOffset = monitor.getInitialClientOffset()
    const hoverBoundingRect = ref.current.getBoundingClientRect()

    if (!clientOffset || !initialClientOffset) return null

    const { width, height, left, top, x, y } = hoverBoundingRect
    const gridSize = hoverBoundingRect.width / NUM_COLUMNS

    // Take into account the position of the mouse on the current slot such that
    // when moving the item, it will only "snap" when moving in steps if {gridSize}
    // relative to start of drag -- instead of relative to the visual grid
    let snapOffset = {
      x: gridSize * -0.5 + ((initialClientOffset.x - x) % gridSize),
      y: gridSize * -0.5 + ((initialClientOffset.y - y) % gridSize),
    }

    const xPos = clamp(clientOffset.x - left - snapOffset.x, 0, width - 1)
    const yPos = clamp(clientOffset.y - top - snapOffset.y, 0, height - 1)

    const gridOffset = {
      x: Math.floor(xPos / gridSize),
      y: Math.floor(yPos / gridSize),
    }

    dispatch(updateDraggingAction({ index: coordToIndex(gridOffset) }))
    dispatch(updateOccupyingSlotsAction(gridSize))
  }, 50)

  const [collectedProps, connectDropRef] = useDrop(() => {
    return {
      accept: [DropType.Briefcase, DropType.Storage],
      hover: onBriefcaseHover,
      collect: monitor => ({ isOver: monitor.isOver(), didDrop: monitor.didDrop() }),
    }
  })

  useEffect(() => {
    if (collectedProps.isOver) {
      dispatch(updateDraggingAction({ to: DropType.Briefcase }))
      return
    }

    if (!collectedProps.didDrop) {
      dispatch(updateDraggingAction({ to: null }))
      dispatch(clearOccupyingSlotsAction())
      return
    }
  }, [collectedProps.isOver, collectedProps.didDrop])

  // TODO: Do this better
  // TODO: Do this better
  // TODO: Do this better
  useEffect(() => {
    dispatch(addItemToBriefcaseAction(getItem('sniperAIAM'), 0))
  }, [])

  connectDropRef(ref)

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  return (
    <div id="briefcase" ref={ref}>
      <div className="grid-container">
        <div className="grid">
          {range(0, NUM_COLUMNS * NUM_ROWS).map(index => (
            <BriefcaseSlot key={`briefcase-slot-${index}`} index={index} />
          ))}
        </div>
      </div>

      <style jsx>{`
        #briefcase {
          position: relative;
          width: 100%;
          max-width: 600px;

          /* Container is used to ensure 6/10 aspect ratio (works with both x & y resizing) */
          .grid-container {
            position: relative;
            width: 100%;
            max-width: 167vh; // 6:10 ratio
            margin: auto;
            height: 0;
            padding-bottom: 60%; // 6:10 ratio
            background-color: var(--briefcase-background-color);

            .grid {
              display: grid;
              grid-template-columns: repeat(${NUM_COLUMNS}, 1fr);
              grid-gap: 0px;
            }
          }
        }
      `}</style>
    </div>
  )
}
