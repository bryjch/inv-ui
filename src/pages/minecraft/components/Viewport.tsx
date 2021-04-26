import React from 'react'

import { Inventory } from './Inventory'
import { Dropzone } from './Dropzone'
import { Holding } from './Holding'
import { Tooltip } from './Tooltip'
import { Cheats } from './Cheats'
import { Debug } from './Debug'

import { dispatch, useStore } from '@zus/minecraft/store'
import { setHeldDraggingAction, resetHeldDraggedToSlotsAction } from '@zus/minecraft/actions'

export const Viewport = () => {
  const holding = useStore(state => state.holding)

  //
  // ─── METHODS ────────────────────────────────────────────────────────────────────
  //

  const onMouseDown = (event: React.MouseEvent) => {
    if (holding.item && !holding.isDragging) {
      const mapping: any = { 0: 'lmb', 2: 'rmb' }
      dispatch(setHeldDraggingAction(mapping[event.button]))
    }
  }

  const onMouseUp = () => {
    dispatch(setHeldDraggingAction(null))
    dispatch(resetHeldDraggedToSlotsAction())
  }

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  return (
    <div id="viewport" onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
      <Dropzone />

      <Inventory />

      <Cheats />

      <Holding />

      <Tooltip />

      {false && <Debug />}

      <style jsx>{`
        #viewport {
          position: relative;
          width: 100%;
          height: 100vh;
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  )
}

export default Viewport
