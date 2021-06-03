import { Portal } from 'react-portal'
import keycode from 'keycode'

import { Holding } from './Holding'
import { Catalogue } from './Catalogue'
import { ItemPopupPanel } from './ItemPopupPanel'

import { useStore, dispatch } from '@zus/tarkov/store'
import { deleteItemAction } from '@zus/tarkov/actions'
import { useMousePosition, useEventListener } from '@utils/hooks'

//////////////////////////
// Component definition //
//////////////////////////
export const Overlay = () => {
  const focused = useStore(state => state.focused)
  const holding = useStore(state => state.dragging)
  const itemPopupPanels = useStore(state => state.itemPopupPanels)
  const catalogueVisible = useStore(state => state.miscPanels.includes('catalogue'))

  const position = useMousePosition()

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  const onKeyDown = async (event: KeyboardEvent) => {
    switch (keycode(event)) {
      case 'delete':
        if (holding.item) return null
        if (!holding.from) return null
        if (!focused.item) return null
        dispatch(deleteItemAction(holding.from, focused.item))
        break

      default:
        break
    }
  }

  useEventListener('keydown', onKeyDown, window)

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  return (
    <Portal node={document && document.getElementById('portal')}>
      {catalogueVisible && (
        <Catalogue defaultPosition={{ x: position.x - 12, y: position.y - 12 }} />
      )}

      {itemPopupPanels.map(item => (
        <ItemPopupPanel
          key={`item-popup-panel-${item.uuid}`}
          item={item}
          defaultPosition={{ x: position.x - 12, y: position.y - 12 }}
        />
      ))}

      {holding.item && <Holding item={holding.item} position={position} />}

      <div />
    </Portal>
  )
}
