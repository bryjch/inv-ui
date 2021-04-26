import React from 'react'

import { useStore } from '@zus/minecraft/store'

export const Debug = () => {
  const holding = useStore(state => state.holding)
  const ui = useStore(state => state.ui)

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  return (
    <div className="debug">
      <pre>holding item: {JSON.stringify(holding.item)}</pre>

      <pre>dragging: {holding.isDragging || '-'}</pre>

      <pre>dragged to: {JSON.stringify(holding.draggedTo)}</pre>

      <pre>hovering: {JSON.stringify(ui.hovering)}</pre>

      <style jsx>{`
        .debug {
          position: relative;
          z-index: 500;
          width: 100%;
          padding: 1rem;

          pre {
            margin: 0.3rem;
          }
        }
      `}</style>
    </div>
  )
}
