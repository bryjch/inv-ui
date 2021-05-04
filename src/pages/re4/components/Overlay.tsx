import { useRef, useEffect } from 'react'
import { useDragLayer } from 'react-dnd'

import { ItemPreview } from './ItemPreview'

import { dispatch, useStore } from '@zus/re4/store'

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

  const { currentMouse, isDragging, initialSource, initialMouse } = useDragLayer(monitor => ({
    currentMouse: monitor.getClientOffset(),
    initialSource: monitor.getInitialSourceClientOffset(),
    initialMouse: monitor.getInitialClientOffset(),
    isDragging: monitor.isDragging(),
  }))

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  useEffect(() => {
    if (!initialMouse || !initialSource) return

    dispatch({
      type: 'SET_DRAG_MOUSE_OFFSET',
      offset: { x: initialMouse.x - initialSource.x, y: initialMouse.y - initialSource.y },
    })
  }, [initialSource, initialMouse])

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  // Take into account the position on the "preview" of the image the
  // user clicked -- and apply additional offset
  let offset

  if (initialSource && initialMouse) {
    offset = { x: initialMouse.x - initialSource.x, y: initialMouse.y - initialSource.y }
  }

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
