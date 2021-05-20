import { useRef, useState } from 'react'
import keycode from 'keycode'

import { ItemPreview } from '../ItemPreview'
import { DEFAULT_GRID_SIZE } from '../../data/constants'

import { useStore, dispatch } from '@zus/tarkov/store'
import { rotateDraggingItemAction } from '@zus/tarkov/actions'
import { Item, XYCoord } from '@pages/tarkov/data/definitions'
import { useEventListener } from '@utils/hooks'

export interface HoldingProps {
  item: Item
  position: XYCoord
}

export const Holding = ({ position, item }: HoldingProps) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [hasRotated, setHasRotated] = useState<boolean>(false)
  const gridOffset = useStore(state => state.dragging.gridOffset)

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  const onKeyDown = async (event: KeyboardEvent) => {
    switch (keycode(event)) {
      case 'r':
        dispatch(rotateDraggingItemAction())
        setHasRotated(true)
        break

      default:
        break
    }
  }

  useEventListener('keydown', onKeyDown, window)

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  // We have a special condition we check when dragging an item:
  // The initial dragging will use the client's mouse position as offset
  // but if the user rotates the item, it will use the center of item as offset
  // instead. As a result, there are certain unique conditions / styling that
  // we need to account for.

  let holdingStyle = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    top: -gridOffset.y,
    left: -gridOffset.x,
  }

  if (item.rotated && hasRotated) {
    holdingStyle.top = -gridOffset.x
    holdingStyle.left = -gridOffset.y
  }

  let rotationStyle = {
    transform: item.rotated ? `rotateZ(-90deg)` : `rotateZ(0deg)`,
    transformOrigin: `center`,
    top: `unset`,
  }

  if (item.rotated && !hasRotated) {
    rotationStyle.transformOrigin = `top left`
    rotationStyle.top = `${DEFAULT_GRID_SIZE * item.dimensions.w}px`
  }

  return (
    <div className="holding" style={holdingStyle}>
      <div className="rotation" style={rotationStyle}>
        {item && <ItemPreview ref={ref} item={item} showGrid={false} />}
      </div>

      <style jsx>{`
        .holding {
          position: absolute;
          z-index: 200;
          color: #ffffff;
          pointer-events: none;
          opacity: 0.8;

          .rotation {
            position: relative;
            transition: 0.1s ease transform;
            outline: 2px dashed rgba(255, 255, 255, 0.2);
          }
        }
      `}</style>
    </div>
  )
}
