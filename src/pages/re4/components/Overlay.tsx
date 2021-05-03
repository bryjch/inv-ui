import { useRef } from 'react'
import { XYCoord, useDragLayer } from 'react-dnd'

import { ItemPreview } from './ItemPreview'

import { useStore } from '@zus/re4/store'

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

  const { currentMouse, isDragging } = useDragLayer(monitor => ({
    currentMouse: monitor.getClientOffset(),
    isDragging: monitor.isDragging(),
  }))

  if (!isDragging || !item) return null

  const centerOffset = calcElementCenter(ref?.current)

  return (
    <div ref={ref} className="holding" style={getItemStyles({ currentMouse, centerOffset })}>
      <ItemPreview item={item} showGrid={false} />

      <style jsx>{`
        .holding {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 200;
          color: #ffffff;
          pointer-events: none;
          opacity: 0.8;
          outline: 3px solid #ffffff;
          outline-offset: -4px;
        }
      `}</style>
    </div>
  )
}

const calcElementCenter = (target: HTMLDivElement | null): XYCoord => {
  if (!target) return { x: 0, y: 0 }

  const rect: DOMRect = target.getBoundingClientRect()

  return { x: rect.width / 2, y: rect.height / 2 }
}

const getItemStyles = (props: any) => {
  const { currentMouse, centerOffset } = props

  if (!currentMouse || !centerOffset) {
    return { display: 'none' }
  }

  if (centerOffset.x === 0 && centerOffset.y === 0) {
    return { opacity: 0 }
  }

  const x = currentMouse.x - centerOffset.x
  const y = currentMouse.y - centerOffset.y

  return {
    transform: `translate(${x}px, ${y}px)`,
    WebkitTransform: `translate(${x}px, ${y}px)`,
  }
}
