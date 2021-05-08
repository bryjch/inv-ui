import { Portal } from 'react-portal'

import { Holding } from './Holding'

import { useStore } from '@zus/tarkov/store'
import { useMousePosition } from '@utils/hooks'

//
// ─── OVERLAY ────────────────────────────────────────────────────────────────────
//

export const Overlay = () => {
  const holding = useStore(state => state.dragging)

  const position = useMousePosition()

  return (
    <Portal node={document && document.getElementById('portal')}>
      {holding.item && <Holding item={holding.item} position={position} />}
      <div />
    </Portal>
  )
}
