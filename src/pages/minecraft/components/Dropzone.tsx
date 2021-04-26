import React from 'react'

import { dispatch } from '@zus/minecraft/store'
import { leftClickDropzoneAction } from '@zus/minecraft/actions'

export const Dropzone = () => {
  //
  // ─── METHODS ────────────────────────────────────────────────────────────────────
  //

  const onLeftClickDropzone = (event: React.MouseEvent) => {
    dispatch(leftClickDropzoneAction())
  }

  const onRightClickDropzone = (event: React.MouseEvent) => {
    event.preventDefault()
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
