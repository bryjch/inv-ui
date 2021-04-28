import React from 'react'

import { dispatch } from '@zus/minecraft/store'
import { updateHeldItemQuantityAction } from '@zus/minecraft/actions'

export const Dropzone = () => {
  //
  // ─── METHODS ────────────────────────────────────────────────────────────────────
  //

  const onLeftClickDropzone = async () => {
    await dispatch(updateHeldItemQuantityAction('decrement', 9999))
  }

  const onRightClickDropzone = async (event: React.MouseEvent) => {
    event.preventDefault()
    await dispatch(updateHeldItemQuantityAction('decrement', 1))
  }

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  return (
    <div className="dropzone" onClick={onLeftClickDropzone} onContextMenu={onRightClickDropzone}>
      <style jsx>{`
        .dropzone {
          position: absolute;
          z-index: 100;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  )
}
