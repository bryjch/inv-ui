import React from 'react'
import keycode from 'keycode'
import { toNumber, isFinite } from 'lodash'

import { Slot } from './Slot'

import { useStore } from '@zus/minecraft/store'
import { useEventListener } from '@utils/hooks'

export const Inventory = () => {
  const slots = useStore(state => state.slots)
  const hovering = useStore(state => state.ui.hovering)

  //
  // ─── METHODS ────────────────────────────────────────────────────────────────────
  //

  const onRightClickInventory = (event: React.MouseEvent) => {
    event.preventDefault()
  }

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

  return (
    <div className="inventory" onContextMenu={onRightClickInventory}>
      {/* Backpack */}

      <div className="grid backpack">
        {slots.backpack.map(slot => (
          <Slot {...slot} key={`backpack-slot-${slot.index}`} />
        ))}
      </div>

      {/* Hotbar */}

      <div className="grid hotbar">
        {slots.hotbar.map(slot => (
          <Slot {...slot} key={`hotbar-slot-${slot.index}`} />
        ))}
      </div>

      <style jsx>{`
        .inventory {
          position: relative;
          z-index: 200;
          width: 100%;
          max-width: 600px;
          display: flex;
          flex-flow: column nowrap;
          margin: 1rem;
          padding: 14px;
          padding: clamp(3px, 2%, 14px);
          border-radius: 4px;
          border-top: 4px solid #ffffff;
          border-left: 4px solid #ffffff;
          border-right: 4px solid #545454;
          border-bottom: 4px solid #545454;
          background-color: #c6c6c6;

          .grid {
            display: grid;
            grid-template-columns: repeat(9, 1fr);
            grid-gap: 3px; // Percentage value doesn't seem to work correctly
          }

          .backpack {
            margin-bottom: 18px;
            margin-bottom: clamp(5px, 3%, 20px);
          }
        }
      `}</style>
    </div>
  )
}
