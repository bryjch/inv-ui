import { useRef } from 'react'

import { ItemPreview } from '../ItemPreview'
import { Item } from '@pages/re4/data/definitions'

export interface HoldingProps {
  item: Item
}

export const Holding = (props: HoldingProps) => {
  const ref = useRef<HTMLDivElement | null>(null)

  return (
    <div className="holding">
      {props.item && <ItemPreview ref={ref} item={props.item} showGrid={false} />}

      <style jsx>{`
        .holding {
          z-index: 200;
          color: #ffffff;
          pointer-events: none;
          outline: 2px dashed rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  )
}
