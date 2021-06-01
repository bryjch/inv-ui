import { Portal } from 'react-portal'

import { Holding } from './Holding'
import { Catalogue } from './Catalogue'

import { useStore } from '@zus/tarkov/store'
import { useMousePosition } from '@utils/hooks'
import { ItemPopupPanel } from './ItemPopupPanel'

//////////////////////////
// Component definition //
//////////////////////////
export const Overlay = () => {
  const holding = useStore(state => state.dragging)
  const itemPopupPanels = useStore(state => state.itemPopupPanels)

  const position = useMousePosition()

  return (
    <Portal node={document && document.getElementById('portal')}>
      <Catalogue />

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
