import { useRef } from 'react'
import { Portal } from 'react-portal'
import { XYCoord, useDragLayer } from 'react-dnd'

import { useStore } from '@zus/re4/store'

const SLOT_SIZE = 60

//
// ─── OVERLAY ────────────────────────────────────────────────────────────────────
//

export const Overlay = () => {
  return (
    <Portal node={document && document.getElementById('portal')}>
      <Holding />
    </Portal>
  )
}

//
// ─── HOLDING ────────────────────────────────────────────────────────────────────
//

export interface HoldingProps {}

export const Holding = (props: HoldingProps) => {
  const ref = useRef<HTMLDivElement | null>(null)

  const item = useStore(state => state.dragging.item)

  const { currentMouse, isDragging } = useDragLayer(monitor => ({
    currentMouse: monitor.getClientOffset(),
    isDragging: monitor.isDragging(),
  }))

  if (!isDragging || !item) {
    return null
  }

  return (
    <div
      className="holding"
      ref={ref}
      style={getItemStyles({ currentMouse, centerOffset: calcElementCenter(ref?.current) })}
    >
      <div>{item.name}</div>

      <style jsx>{`
        .holding {
          position: absolute;
          color: #ffffff;
          pointer-events: none;
          background-color: pink;
          opacity: 0.8;
          width: ${SLOT_SIZE * item.dimensions.w}px;
          height: ${SLOT_SIZE * item.dimensions.h}px;
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

  const x = currentMouse.x - centerOffset.x
  const y = currentMouse.y - centerOffset.y

  return {
    transform: `translate(${x}px, ${y}px)`,
    WebkitTransform: `translate(${x}px, ${y}px)`,
  }
}
