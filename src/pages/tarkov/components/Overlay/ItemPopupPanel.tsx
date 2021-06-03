import { DragPanel } from './DragPanel'
import { EquipSlotGrids } from '../Equip'
import { Item } from '../../data/definitions'

import { dispatch } from '@zus/tarkov/store'
import { reorderItemPopupPanelAction, toggleItemPopupPanelAction } from '@zus/tarkov/actions'

////////////////
// Prop types //
////////////////
export type ItemPopupPanelProps = {
  item: Item
  defaultPosition?: { x: number; y: number }
} & typeof defaultProps

const defaultProps = {
  defaultPosition: { x: 0, y: 0 },
}

//////////////////////////
// Component definition //
//////////////////////////
export const ItemPopupPanel = (props: ItemPopupPanelProps) => {
  return (
    <DragPanel
      title={props.item.shortName}
      defaultPosition={props.defaultPosition}
      onClose={() => dispatch(toggleItemPopupPanelAction(props.item, false))}
      onMouseDown={() => dispatch(reorderItemPopupPanelAction(props.item, 'top'))}
    >
      <div className="content">
        <EquipSlotGrids item={props.item} animated={false} />
      </div>

      <style jsx>{`
        .content {
          padding: 4px;
        }
      `}</style>
    </DragPanel>
  )
}
