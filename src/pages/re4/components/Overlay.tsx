import { useRef, useEffect, useCallback } from 'react'
import { useDragLayer } from 'react-dnd'

import { ItemPreview } from './ItemPreview'

import { dispatch, useStore } from '@zus/re4/store'
import { updateDraggingAction } from '@zus/re4/actions'

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
  const useGridOffset = useStore(
    state => !!state.dragging.from && !!state.grids[state.dragging.from]
  )

  const { currentMouse, isDragging, initialSource, initialMouse } = useDragLayer(monitor => ({
    currentMouse: monitor.getClientOffset(),
    initialSource: monitor.getInitialSourceClientOffset(),
    initialMouse: monitor.getInitialClientOffset(),
    isDragging: monitor.isDragging(),
  }))

  const getOffset = useCallback(() => {
    // If dragged from a grid, we should use the "drag started at" as grid offset
    if (useGridOffset) {
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
  }, [initialSource, initialMouse, useGridOffset])

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  useEffect(() => {
    if (!initialMouse || !initialSource || !ref.current) return

    dispatch(updateDraggingAction({ mouseOffset: getOffset() }))
  }, [initialSource, initialMouse, getOffset, ref.current]) // eslint-disable-line react-hooks/exhaustive-deps

  // TODO: handle this ref.current dependency properly

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  let offset = getOffset()

  return (
    <div className="holding" style={getItemStyles({ currentMouse, offset })}>
      {isDragging && item && <ItemPreview ref={ref} item={item} showGrid={false} />}

      <style jsx>{`
        .holding {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 200;
          color: #ffffff;
          pointer-events: none;
          outline: 2px dashed rgba(255, 255, 255, 0.2);
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
