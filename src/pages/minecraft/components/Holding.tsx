import React from 'react'

import { getItemInfo } from '@pages/minecraft/data/helpers'
import { useStore } from '@zus/minecraft/store'
import { useMousePosition } from '@utils/hooks'

const ICON_PREVIEW_SIZE = 50
const MOUSE_OFFSET = { X: ICON_PREVIEW_SIZE * -0.5, Y: ICON_PREVIEW_SIZE * -0.5 }

export const Holding = () => {
  const { x, y } = useMousePosition()

  const holding = useStore(state => state.holding)
  const itemInfo = getItemInfo(holding.item)

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  const renderItem = (item: any) => {
    const { image, displayName, stackable, quantity } = item

    return (
      <div className="preview" style={{ left: x + MOUSE_OFFSET.X, top: y + MOUSE_OFFSET.Y }}>
        {image ? (
          <img src={image} alt={displayName} className="no-select" />
        ) : (
          <div className="name no-select">{displayName}</div>
        )}

        {stackable && <div className="quantity">{quantity}</div>}

        <style jsx>{`
          .preview {
            position: absolute;

            img {
              width: ${ICON_PREVIEW_SIZE}px;
              height: ${ICON_PREVIEW_SIZE}px;
              image-rendering: -webkit-optimize-contrast;
            }

            .name {
              font-size: 1.5rem;
              line-height: 1;
              font-weight: bold;
              text-align: center;
              padding: 0.1rem 0.3rem;
              margin-right: 34px;
              margin-bottom: 10px;
              background-color: rgba(0, 0, 0, 0.8);
            }

            .quantity {
              position: absolute;
              right: -4px;
              bottom: 1px;
              line-height: 1;
              font-size: 1.66rem;
              font-family: Minecraftia;
              text-align: center;
              text-shadow: 2px 2px 0 #3f3f3f;
            }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="holding">
      {itemInfo && renderItem(itemInfo)}

      <style jsx>{`
        .holding {
          position: absolute;
          width: 100%;
          height: 100vh;
          z-index: 400;
          overflow: hidden;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
