import React from 'react'
import { range } from 'lodash'

import { Slot } from './Slot'
import { SlotType } from '../data/definitions'

import { useStore } from '@zus/minecraft/store'

export const Inventory = () => {
  const numBackpackSlots = useStore(state => state.slots.backpack.length)
  const numHotbarSlots = useStore(state => state.slots.hotbar.length)

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
        {range(0, numBackpackSlots).map(index => (
          <Slot type={SlotType.BACKPACK} index={index} key={`backpack-slot-${index}`} />
        ))}
      </div>

      {/* Hotbar */}

      <div className="grid hotbar">
        {range(0, numHotbarSlots).map(index => (
          <Slot type={SlotType.HOTBAR} index={index} key={`hotbar-slot-${index}`} />
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
          padding: 2%;
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
            margin-bottom: 3%;
          }
        }
      `}</style>
    </div>
  )
}
