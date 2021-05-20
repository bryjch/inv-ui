import { useCallback } from 'react'

import { EquipSlotGrids } from './EquipSlotGrids'
import { EquipHeader } from './EquipHeader'
import { ItemPreview } from '../ItemPreview'

import { DEFAULT_GRID_SIZE } from '../../data/constants'
import { Dimensions, EquipSlotType } from '../../data/definitions'
import { onClickDragArea, onClickDragAreaItem, onMouseOverDragArea } from '../../utils/mouseEvents'

import { useStore } from '@zus/tarkov/store'

export interface EquipSlotProps {
  type: EquipSlotType
  label?: string
  dimensions?: Dimensions
}

export const EquipSlot = (props: EquipSlotProps) => {
  const id = `equipSlot-${props.type}`
  const { w, h } = props.dimensions || { w: 2, h: 2 }
  const item = useStore(useCallback(state => state.equipSlots[props.type] || null, [props.type]))

  const cls = []
  if (!item) cls.push('empty')

  return (
    <>
      {!!props.label && <EquipHeader label={props.label} />}

      <div
        className={`equip-slot ${cls.join(' ')}`}
        onMouseEnter={onMouseOverDragArea(id, 'enter')}
        onMouseLeave={onMouseOverDragArea(id, 'exit')}
        onMouseDown={onClickDragArea(id)}
      >
        <div className="item-container">
          <div
            className="item"
            style={{ width: w * DEFAULT_GRID_SIZE, height: h * DEFAULT_GRID_SIZE }}
            onMouseDown={item ? onClickDragAreaItem(id, item, { offsetType: 'center' }) : undefined}
          >
            {item && <ItemPreview item={item} fluid showGrid={false} />}
          </div>
        </div>

        <EquipSlotGrids item={item} slotType={props.type} />

        <style jsx>{`
          .equip-slot {
            position: relative;
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            align-items: flex-start;

            .item-container {
              border: var(--grid-border-width) solid var(--grid-border-color);
              outline: 1px solid #000000;
              margin-right: 2px;

              .item {
                display: flex;
                justify-content: center;
                align-items: center;
                margin: auto;
                width: 100%;
                height: 100%;
              }
            }

            &.empty {
              .item-container {
                border: 2px solid rgba(55, 55, 55, 0.9);
                background: repeating-linear-gradient(
                  45deg,
                  rgba(60, 60, 60, 0.1),
                  rgba(60, 60, 60, 0.1) 5px,
                  rgba(160, 160, 160, 0.1) 5px,
                  rgba(160, 160, 160, 0.1) 10px
                );
              }
            }
          }
        `}</style>
      </div>
    </>
  )
}
