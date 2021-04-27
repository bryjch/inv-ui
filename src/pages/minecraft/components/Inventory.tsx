import React from 'react'

import { Slot } from './Slot'

import { useStore } from '@zus/minecraft/store'

export const Inventory = () => {
  const slots = useStore(state => state.slots)

  //
  // ─── METHODS ────────────────────────────────────────────────────────────────────
  //

  const onRightClickInventory = (event: React.MouseEvent) => {
    event.preventDefault()
  }

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
            grid-gap: 0px;
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
