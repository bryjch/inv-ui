import { EquipHeader } from './EquipHeader'
import { ItemPreview } from '../ItemPreview'
import { Grid } from '../Grid'

import { Item, Dimensions } from '../../data/definitions'
import { DEFAULT_GRID_SIZE } from '../../data/constants'

export interface EquipSlotProps {
  id: string
  label?: string
  item?: Item
  dimensions?: Dimensions
  areaMethods: { [key: string]: (...args: any[]) => any }
}

export const EquipSlot = (props: EquipSlotProps) => {
  const { w, h } = props.dimensions || { w: 2, h: 2 }

  const cls = []
  if (!props.item) cls.push('empty')

  return (
    <>
      {!!props.label && <EquipHeader label={props.label} />}

      <div className={`equip-slot ${cls.join(' ')}`}>
        <div className="item-container">
          <div
            className="item"
            style={{ width: w * DEFAULT_GRID_SIZE, height: h * DEFAULT_GRID_SIZE }}
          >
            {props.item && <ItemPreview item={props.item} fluid showGrid={false} />}
          </div>
        </div>

        <Grid id={`grid-${props.id}`} cols={4} rows={4} {...props.areaMethods} />

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
