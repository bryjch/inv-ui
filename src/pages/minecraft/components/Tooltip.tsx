import React from 'react'

import { useStore } from '@zus/minecraft/store'

import { getItemInfo } from '@pages/minecraft/data/helpers'
import { useMousePosition } from '@utils/hooks'

const MOUSE_OFFSET = { X: 20, Y: -40 }
const BORDER_SIZE = '3px'

export const Tooltip = () => {
  const { x, y } = useMousePosition()

  const holding = useStore(state => state.holding)
  const hovering = useStore(state => state.ui.hovering)

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  const fullItemInfo = getItemInfo(hovering?.item || null)

  const renderItem = (item: any) => {
    return (
      <div className="preview" style={{ left: x + MOUSE_OFFSET.X, top: y + MOUSE_OFFSET.Y }}>
        <div className="name no-select">{item.displayName}</div>

        <style jsx>{`
          .preview {
            position: absolute;
            background-color: rgba(16, 0, 16, 0.94);
            padding: 0.75rem 0.5rem;

            &:before {
              content: '';
              position: absolute;
              top: ${BORDER_SIZE};
              right: -${BORDER_SIZE};
              bottom: ${BORDER_SIZE};
              left: -${BORDER_SIZE};
              border: ${BORDER_SIZE} solid #100010;
              border-width: ${BORDER_SIZE};
              border-style: none solid;
              border-color: rgba(16, 0, 16, 0.94);
            }

            &:after {
              content: '';
              position: absolute;
              top: ${BORDER_SIZE};
              right: 0;
              bottom: ${BORDER_SIZE};
              left: 0;
              border: ${BORDER_SIZE} solid #2d0a63;
              border-width: ${BORDER_SIZE};
              border-image: linear-gradient(rgba(80, 0, 255, 0.31), rgba(40, 0, 127, 0.31)) 1;
            }

            .name {
              font-family: Minecraftia, monospace;
              font-size: 1.2rem;
              line-height: 1;
              text-align: center;
              white-space: nowrap;
            }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="tooltip">
      {!holding.item && fullItemInfo && renderItem(fullItemInfo)}

      <style jsx>{`
        .tooltip {
          position: absolute;
          width: 100%;
          height: 100vh;
          z-index: 401;
          overflow: hidden;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
