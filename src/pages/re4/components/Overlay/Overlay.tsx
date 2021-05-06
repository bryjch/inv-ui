import { DragOverlay } from '@dnd-kit/core'

import { Holding } from './Holding'

import { useStore } from '@zus/re4/store'

//
// ─── OVERLAY ────────────────────────────────────────────────────────────────────
//

export const Overlay = () => {
  const holding = useStore(state => state.dragging)

  return (
    <DragOverlay
      dropAnimation={{ duration: holding.from?.includes('listing') ? 0 : 100, easing: 'ease' }}
    >
      {holding.item && <Holding item={holding.item} />}
    </DragOverlay>
  )
}
