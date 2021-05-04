import { useRef, useEffect, useCallback } from 'react'
import { useDragLayer } from 'react-dnd'

import { ItemPreview } from './ItemPreview'

import { dispatch, useStore } from '@zus/re4/store'
import { DropType } from '../data/definitions'

//
// ─── OVERLAY ────────────────────────────────────────────────────────────────────
//

export const Overlay = () => {
  return <Holding />
}

//
// ─── HOLDING ────────────────────────────────────────────────────────────────────
//

export const Holding = () => {
  const ref = useRef<HTMLDivElement | null>(null)

  const item = useStore(state => state.dragging.item)
  const dragFrom = useStore(state => state.dragging.from)

  const { currentMouse, isDragging, initialSource, initialMouse } = useDragLayer(monitor => ({
    currentMouse: monitor.getClientOffset(),
    initialSource: monitor.getInitialSourceClientOffset(),
    initialMouse: monitor.getInitialClientOffset(),
    isDragging: monitor.isDragging(),
  }))

  const getOffset = useCallback(() => {
    // If drag from briefcase, we should use the "drag started at" as offset
    if (dragFrom === DropType.Briefcase) {
      if (initialSource && initialMouse) {
        return { x: initialMouse.x - initialSource.x, y: initialMouse.y - initialSource.y }
      }
    }

    // Otherwise just use the center of the dragging item
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect()
      return { x: width / 2, y: height / 2 }
    }

    return { x: 0, y: 0 }
  }, [initialSource, initialMouse, dragFrom])

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  useEffect(() => {
    if (!initialMouse || !initialSource) return

    dispatch({
      type: 'SET_DRAG_MOUSE_OFFSET',
      offset: getOffset(),
    })
  }, [initialSource, initialMouse, getOffset])

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  let offset = getOffset()

  // Take into account the position on the "preview" of the image the
  // user clicked -- and apply additional offset

  if (!isDragging || !item) return null

  return (
    <div ref={ref} className="holding" style={getItemStyles({ currentMouse, offset })}>
      <ItemPreview item={item} showGrid={false} />

      <style jsx>{`
        .holding {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 200;
          color: #ffffff;
          pointer-events: none;
          background: var(--briefcase-item-background-color);
        }
      `}</style>
    </div>
  )
}

const getItemStyles = ({ currentMouse, offset }: any) => {
  if (!currentMouse || !offset) {
    return { display: 'none' }
  }

  if (offset.x === 0 && offset.y === 0) {
    return { opacity: 0 }
  }

  const x = currentMouse.x - offset.x
  const y = currentMouse.y - offset.y

  return {
    transform: `translate(${x}px, ${y}px)`,
    WebkitTransform: `translate(${x}px, ${y}px)`,
  }
}
