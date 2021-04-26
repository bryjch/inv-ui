import React from 'react'
import { entries } from 'lodash'
import { FiTrash2 } from 'react-icons/fi'

import { HoldButton } from './HoldButton'

import { dispatch, getState } from '@zus/minecraft/store'
import {
  addItemToHandAction,
  updateHeldItemQuantityAction,
  purgeInventoryAction,
} from '@zus/minecraft/actions'

import items from '../data/items.json'

export const Cheats = () => {
  const holding = getState().holding
  const itemOptions = entries(items).map(([key, value]) => ({ key, ...value }))

  //
  // ─── METHODS ────────────────────────────────────────────────────────────────────
  //

  const onMouseDown = (iid: string) => async (event: React.MouseEvent) => {
    event.preventDefault()

    if (event.shiftKey) {
      await dispatch(addItemToHandAction(iid, 999))
      return true
    }

    switch (event.button) {
      case 0: // Left mouse click
        if (holding.item && holding.item?.iid !== iid) {
          await dispatch(updateHeldItemQuantityAction('decrement', 999))
          break
        }

        if (iid) {
          await dispatch(addItemToHandAction(iid, 1))
          break
        }

        break

      default:
        break
    }
  }

  const onContextMenu = async (event: React.MouseEvent) => {
    event.preventDefault()

    if (!event.shiftKey) {
      await dispatch(updateHeldItemQuantityAction('decrement', 1))
    }
  }

  const onWheel = (iid: string) => async (event: React.MouseEvent) => {
    const wheelEvent = event.nativeEvent as WheelEvent

    // if (!holding.item) return false
    if (holding.item && holding.item.iid !== iid) return false

    let amount = event.shiftKey ? (holding?.item?.quantity === 1 ? 7 : 8) : 1

    if (!holding.item && wheelEvent.deltaY < 0) {
      await dispatch(addItemToHandAction(iid, amount))
      return true
    }

    if (wheelEvent.deltaY < 0) {
      await dispatch(updateHeldItemQuantityAction('increment', amount))
    } else {
      await dispatch(updateHeldItemQuantityAction('decrement', amount))
    }
  }

  const purgeInventory = () => {
    dispatch(purgeInventoryAction())
  }

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  return (
    <div className="cheats" onContextMenu={onContextMenu}>
      <div className="options item-options">
        {itemOptions.map(option => (
          <div
            key={`item-option-${option.key}`}
            className="option"
            onMouseDown={onMouseDown(option.key)}
            onWheel={onWheel(option.key)}
          >
            <img src={option.image} alt={option.displayName} />
          </div>
        ))}
      </div>

      <div className="options misc-options" onMouseDown={onMouseDown('')}>
        <HoldButton
          color="transparent"
          size={40}
          duration={350}
          progress={{ width: 4, color: 'red' }}
          onComplete={purgeInventory}
          disabled={!!holding.item}
        >
          <FiTrash2 size={22} />
        </HoldButton>
      </div>

      <style jsx>{`
        .cheats {
          position: relative;
          z-index: 300;
          border-radius: 4px;
          display: flex;
          flex-flow: row wrap;
          align-items: stretch;
          font-family: Minecraftia;

          button {
            background: none;
            border: none;
            cursor: pointer;
            user-select: none;
            color: #ffffff;
          }

          .options {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            margin: 0 0.25rem;

            .option {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 40px;
              height: 40px;
              margin: 0 0.2rem;
              padding: 4px;
              border-radius: 50%;
              transform: scale(0.9);
              transition: 0.1s ease all;

              &:hover {
                background-color: rgba(255, 255, 255, 0.3);
                transform: scale(1);
              }
            }
          }

          .item-options {
            .option {
              img {
                width: 100%;
                height: 100%;
                image-rendering: -webkit-optimize-contrast;
                user-select: none;
                -webkit-user-drag: none;
              }
            }
          }

          .misc-options {
          }
        }
      `}</style>
    </div>
  )
}
