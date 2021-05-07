import { useRef } from 'react'

import { ItemPreview } from '../ItemPreview'

import { useStore } from '@zus/re4/store'
import { Item, XYCoord } from '@pages/re4/data/definitions'

export interface HoldingProps {
  item: Item
  position: XYCoord
}

export const Holding = ({ position, item }: HoldingProps) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const gridOffset = useStore(state => state.dragging.gridOffset)

  const transform = `translate(${position.x - gridOffset.x}px, ${position.y - gridOffset.y}px)`

  return (
    <div
      className="holding"
      style={{
        transform: transform,
      }}
    >
      {item && <ItemPreview ref={ref} item={item} showGrid={false} />}

      <style jsx>{`
        .holding {
          position: absolute;
          z-index: 200;
          color: #ffffff;
          pointer-events: none;
          outline: 2px dashed rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  )
}
