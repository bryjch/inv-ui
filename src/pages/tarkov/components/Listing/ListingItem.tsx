import React from 'react'

import { ItemPreview } from '../ItemPreview'
import { Item } from '../../data/definitions'
import { getItemInfo } from '../../data/mappings'
import { DEFAULT_GRID_SIZE } from '../../data/constants'

////////////////
// Prop types //
////////////////
export type ListingItemProps = {
  item: Item
  index: number
  onClick?: (item: Item) => (e: React.MouseEvent) => any
}

//////////////////////////
// Component definition //
//////////////////////////
export const ListingItem = (props: ListingItemProps) => {
  const itemInfo = getItemInfo(props.item)

  return (
    <div className="listing-item" onMouseDown={props.onClick?.(props.item)}>
      <ItemPreview item={props.item} slotSize={DEFAULT_GRID_SIZE} showItemInfo={false} />

      <div className="details">
        <div className="icon">{itemInfo.icon({ size: 15 })}</div>
        <div className="name">{props.item.longName}</div>
      </div>

      <style jsx>{`
        .listing-item {
          position: relative;
          display: flex;
          flex-flow: column nowrap;
          align-items: flex-start;
          margin-bottom: 0.5rem;
          color: #ffffff;

          &:last-child {
            margin-bottom: 0;
          }

          .details {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            background-color: rgba(0, 0, 0, 0.9);

            .icon {
              padding: 3px;
              line-height: 0;
            }

            .name {
              padding: 3px 6px;
              font-size: 0.7rem;
              white-space: nowrap;
              pointer-events: none;
            }
          }
        }
      `}</style>

      <style jsx>{`
        .listing-item {
          .details {
            .icon {
              background-color: ${itemInfo.accent};
            }
          }
        }
      `}</style>
    </div>
  )
}
