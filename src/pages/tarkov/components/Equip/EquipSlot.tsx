import React, { useCallback } from 'react'

import { EquipSlotGrids } from './EquipSlotGrids'
import { EquipHeader } from './EquipHeader'
import { ItemPreview } from '../ItemPreview'
import { ItemInfo } from '../ItemInfo'

import { DEFAULT_GRID_SIZE } from '../../data/constants'
import { Dimensions, EquipSlotType } from '../../data/definitions'
import {
  onClickDragArea,
  onClickDragAreaItem,
  onMouseOverDragAreaItem,
  onMouseOverDragArea,
} from '../../utils/mouseEvents'

import { useStore } from '@zus/tarkov/store'

////////////////
// Prop types //
////////////////
export type EquipSlotProps = {
  type: EquipSlotType
  label?: string
  dimensions?: Dimensions
} & typeof defaultProps

const defaultProps = {
  label: '',
  dimensions: { w: 2, h: 2 },
}

//////////////////////////
// Component definition //
//////////////////////////
export const EquipSlot = (props: EquipSlotProps) => {
  const id = `equipSlot-${props.type}`

  const dragging = useStore(state => state.dragging)
  const equippedItem = useStore(
    useCallback(state => state.equipSlots[props.type] || null, [props.type])
  )

  //
  // ─── METHODS ────────────────────────────────────────────────────────────────────
  //

  const onMouseDownItem = useCallback(
    (event: React.MouseEvent) =>
      equippedItem && onClickDragAreaItem(id, equippedItem, { offsetType: 'center' })(event),
    [id, equippedItem]
  )

  const onMouseEnterItem = useCallback(
    (event: React.MouseEvent) =>
      equippedItem && onMouseOverDragAreaItem(equippedItem, 'enter')(event),
    [equippedItem]
  )

  const onMouseLeaveItem = useCallback(
    (event: React.MouseEvent) =>
      equippedItem && onMouseOverDragAreaItem(equippedItem, 'exit')(event),
    [equippedItem]
  )

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  const cls = []
  if (!equippedItem) cls.push('empty')
  if (dragging.to === id) cls.push('is-over')
  if (dragging.item?.tags.includes?.(props.type)) cls.push('is-valid-type')

  return (
    <div className="equip-slot-container">
      {!!props.label && <EquipHeader label={props.label} />}

      <div className={`equip-slot ${cls.join(' ')}`}>
        <div
          className="equipped-item-container"
          onMouseEnter={onMouseOverDragArea(id, 'enter')}
          onMouseLeave={onMouseOverDragArea(id, 'exit')}
          onMouseDown={onClickDragArea(id)}
        >
          <div
            className="equipped-item"
            style={{
              width: props.dimensions.w * DEFAULT_GRID_SIZE,
              height: props.dimensions.h * DEFAULT_GRID_SIZE,
            }}
            onMouseEnter={onMouseEnterItem}
            onMouseLeave={onMouseLeaveItem}
            onMouseDown={onMouseDownItem}
          >
            {equippedItem && (
              <ItemPreview
                item={equippedItem}
                fitTo={props.dimensions}
                showGrid={false}
                showItemInfo={false}
              />
            )}

            {/* Explicitly render ItemInfo here because its outer container
                may have different dimensions to the actual ItemPreview */}
            {equippedItem && <ItemInfo item={equippedItem} />}
          </div>
        </div>

        {equipSlotTypeHasGrid(props.type) && <EquipSlotGrids item={equippedItem} />}

        <style jsx>{`
          .equip-slot {
            position: relative;
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            align-items: flex-start;

            .equipped-item-container {
              position: relative;
              border: var(--grid-border-width) solid var(--grid-border-color);
              outline: 1px solid #000000;
              margin-right: 2px;

              .equipped-item {
                display: flex;
                justify-content: center;
                align-items: center;
                margin: auto;
                width: 100%;
                height: 100%;
              }
            }

            &.is-over {
              .equipped-item-container {
                .equipped-item {
                  background: rgba(255, 0, 0, 0.3);
                }
              }

              &.is-valid-type {
                .equipped-item-container {
                  .equipped-item {
                    background: rgba(0, 255, 0, 0.3);
                  }
                }
              }
            }

            &.empty {
              .equipped-item-container {
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

            &.is-valid-type {
              .equipped-item-container {
                .equipped-item {
                  background: rgba(255, 167, 0, 0.2);
                }

                /***********************************/
                /* Emphasis border animation stuff */
                /***********************************/

                $emphasis-loop-time: 3s;
                $emphasis-path-width: 3px;
                $emphasis-path-color: rgba(255, 167, 0, 1);

                &::before,
                &::after {
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  content: '';
                  margin: $emphasis-path-width * -1;
                  pointer-events: none;
                  box-shadow: inset 0 0 0 $emphasis-path-width $emphasis-path-color;
                  animation: is-valid-emphasis $emphasis-loop-time linear infinite;
                }

                &::before {
                  animation-delay: $emphasis-loop-time * -0.5;
                }

                @keyframes is-valid-emphasis {
                  0%,
                  100% {
                    clip-path: inset(90% 0% 0% 0%);
                  }
                  25% {
                    clip-path: inset(0% 90% 0% 0%);
                  }
                  50% {
                    clip-path: inset(0% 0% 90% 0%);
                  }
                  75% {
                    clip-path: inset(0% 0% 0% 90%);
                  }
                }
              }
            }
          }
        `}</style>
      </div>
    </div>
  )
}

EquipSlot.defaultProps = defaultProps

//
// ─── HELPERS ────────────────────────────────────────────────────────────────────
//

// Only certain EquipSlotTypes actually need to have internal grids
// (i.e. "Storage" type equip slots)
export const equipSlotTypeHasGrid = (equipSlotType: EquipSlotType) => {
  return [EquipSlotType.RIG, EquipSlotType.BACKPACK, EquipSlotType.POUCH].includes(equipSlotType)
}
