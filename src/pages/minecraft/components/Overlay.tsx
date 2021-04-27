import React from 'react'
import keycode from 'keycode'
import { toNumber, isFinite } from 'lodash'

import { Image } from './Image'

import { getItemInfo } from '@pages/minecraft/data/helpers'
import { Item } from '@pages/minecraft/data/definitions'

import { useStore } from '@zus/minecraft/store'
import { useMousePosition, useEventListener } from '@utils/hooks'

//
// ─── OVERLAY ────────────────────────────────────────────────────────────────────
//

export const Overlay = () => {
  const position = useMousePosition()

  const holding = useStore(state => state.holding)
  const hovering = useStore(state => state.hovering)

  //
  // ─── METHODS ────────────────────────────────────────────────────────────────────
  //

  const onKeyDown = (event: KeyboardEvent) => {
    const key = keycode(event)

    if (isFinite(toNumber(key))) {
      console.log(`move ${hovering?.type}${hovering?.index} to hotbar${key}`)
    }
  }

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  useEventListener('keydown', onKeyDown, window)

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  const holdingItemInfo = getItemInfo(holding?.item || null)

  return (
    <div className="overlay">
      {holding.item && holdingItemInfo && <Holding position={position} item={holding.item} />}
      {!holding.item && hovering?.item && <Tooltip position={position} item={hovering.item} />}

      <style jsx>{`
        .overlay {
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

//
// ─── TOOLTIP ────────────────────────────────────────────────────────────────────
//

export interface TooltipProps {
  item: Item
  position: { x: number; y: number }
}

export const Tooltip = (props: TooltipProps) => {
  const BORDER_SIZE = '3px'
  const MOUSE_OFFSET = { X: 20, Y: -40 }

  const fullItemInfo = getItemInfo(props.item)
  if (!fullItemInfo) return null

  const { displayName } = fullItemInfo

  return (
    <div
      className="tooltip"
      style={{
        left: props.position.x + MOUSE_OFFSET.X,
        top: props.position.y + MOUSE_OFFSET.Y,
      }}
    >
      <div className="name no-select">{displayName}</div>

      <style jsx>{`
        .tooltip {
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

//
// ─── HOLDING ────────────────────────────────────────────────────────────────────
//

export interface HoldingProps {
  item: Item
  position: { x: number; y: number }
}

export const Holding = (props: HoldingProps) => {
  const ICON_PREVIEW_SIZE = 50
  const MOUSE_OFFSET = { X: ICON_PREVIEW_SIZE * -0.5, Y: ICON_PREVIEW_SIZE * -0.5 }

  const fullItemInfo = getItemInfo(props.item)
  if (!fullItemInfo) return null

  const { image, displayName, stackable, quantity } = fullItemInfo

  return (
    <div
      className="holding"
      style={{
        left: props.position.x + MOUSE_OFFSET.X,
        top: props.position.y + MOUSE_OFFSET.Y,
      }}
    >
      <Image
        src={image}
        fallback="/minecraft/images/missing.png"
        alt={displayName}
        className="no-select"
      />

      {stackable && <div className="quantity">{quantity}</div>}

      <style jsx>{`
        .holding {
          position: absolute;

          & > :global(img) {
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
