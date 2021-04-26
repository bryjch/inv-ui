import React, { useRef, useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { isEqual } from 'lodash'

import { dispatch, useStore } from '@zus/minecraft/store'
import {
  quickSwapSlotTypeAction,
  leftClickSlotAction,
  rightClickSlotAction,
  addHeldDraggedToSlotAction,
  quickCombineHeldIntoStackAction,
  setHoveredInventorySlotAction,
} from '@zus/minecraft/actions'

import { getItemInfo } from '@pages/minecraft/data/helpers'
import { Slot as SlotProps } from '@pages/minecraft/data/definitions'

export const Slot = (props: SlotProps) => {
  const { type, index, item } = props

  const ref = useRef<HTMLDivElement | null>(null)
  const [doubleClickable, setDoubleClickable] = useState(false)

  const holding = useStore(state => state.holding)
  const isDragged = holding.draggedTo.find(slot => isEqual({ type, index }, slot))
  const animated = true // TODO: provide settings option for this

  const imageAnim = useAnimation()
  const quantityAnim = useAnimation()

  const { iid, quantity } = item || {}

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  useEffect(() => {
    const scaleImage = async () => {
      await imageAnim.start({ scale: 1 }, { duration: 0.06 })
      await imageAnim.start({ scale: 1.1 }, { duration: 0.06 })
      await imageAnim.start({ scale: 1 }, { duration: 0.06 })
    }

    if (animated) scaleImage()
  }, [animated, imageAnim, iid])

  useEffect(() => {
    const jiggleQuantity = async () => {
      await quantityAnim.start({ fontSize: '1.6rem' }, { duration: 0.06 })
      await quantityAnim.start({ fontSize: '1.7rem' }, { duration: 0.06 })
      await quantityAnim.start({ fontSize: '1.6rem' }, { duration: 0.06 })
    }

    if (animated) jiggleQuantity()
  }, [animated, quantityAnim, quantity])

  useEffect(() => {
    if (doubleClickable) {
      setTimeout(() => {
        setDoubleClickable(false)
      }, 200)
    }
  }, [doubleClickable])

  //
  // ─── METHODS ────────────────────────────────────────────────────────────────────
  //

  const onItemHover = (state: 'enter' | 'exit') => (event: React.MouseEvent) => {
    if (state === 'enter' && item && item.iid) {
      dispatch(setHoveredInventorySlotAction(props))
    }

    if (state === 'exit') {
      dispatch(setHoveredInventorySlotAction(null))
    }
  }

  const onMouseDown = async (event: React.MouseEvent) => {
    if (event.shiftKey) {
      // Shift click (left or right have same behaviour)
      dispatch(quickSwapSlotTypeAction(props.type, props.index))
      return true
    }

    if (doubleClickable) {
      await dispatch(quickCombineHeldIntoStackAction())
      return true
    }

    switch (event.button) {
      case 0: // Left mouse click
        event.preventDefault()
        await dispatch(leftClickSlotAction(props.type, props.index))
        setDoubleClickable(true)
        break

      case 2: // Right mouse click
        event.preventDefault()
        await dispatch(rightClickSlotAction(props.type, props.index))
        setDoubleClickable(true)
        break

      default:
        break
    }
  }

  const onMouseOver = () => {
    if (!!holding.isDragging) {
      dispatch(addHeldDraggedToSlotAction(props.type, props.index))
    }
  }

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  const fullItemInfo = getItemInfo(item)

  const renderItem = (item: any) => {
    return (
      <div ref={ref} className="item" onMouseEnter={onItemHover('enter')}>
        {item.image ? (
          <motion.img
            initial={{ scale: 1 }}
            animate={imageAnim}
            src={item.image}
            alt={item.displayName}
            className="no-select"
          />
        ) : (
          <div className="name no-select">{item.displayName}</div>
        )}

        {item.stackable && (
          <div className="quantity">
            <motion.div
              initial={{ fontSize: 'inherit' }}
              animate={quantityAnim}
              className="no-select"
            >
              {item.quantity}
            </motion.div>
          </div>
        )}

        <style jsx>{`
          .item {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            & > :global(img) {
              position: absolute;
              width: 100%;
              height: 100%;
              padding: 5%;
              image-rendering: -webkit-optimize-contrast; // pixelated
            }

            div.name {
              font-size: 0.8rem;
              line-height: 1;
              font-weight: bold;
              text-align: center;
            }

            div.quantity {
              position: absolute;
              right: -2px;
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
    <div
      className={`slot ${isDragged ? 'dragged' : ''}`}
      onMouseDown={onMouseDown}
      onMouseOver={onMouseOver}
      onMouseLeave={onItemHover('exit')}
    >
      {item && fullItemInfo && renderItem(fullItemInfo)}

      <style jsx>{`
        .slot {
          position: relative;
          min-width: 0;
          width: 100%;
          flex: 1;
          aspect-ratio: 1;
          border-top: 3px solid #383838;
          border-left: 3px solid #383838;
          border-right: 2px solid #ffffff;
          border-bottom: 2px solid #ffffff;
          background-color: #8b8b8b;
          display: flex;
          justify-content: center;
          align-items: center;

          &:hover {
            background: rgba(255, 255, 255, 0.4);
          }

          &.dragged {
            background: rgba(255, 255, 255, 0.6);
          }

          &.held {
            background: rgba(255, 255, 255, 0.8);
          }
        }
      `}</style>
    </div>
  )
}
