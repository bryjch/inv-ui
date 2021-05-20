import React from 'react'

import { ItemPreview } from '../ItemPreview'
import { Item } from '../../data/definitions'
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
  return (
    <div className="listing-item" onMouseDown={props.onClick?.(props.item)}>
      <ItemPreview item={props.item} slotSize={DEFAULT_GRID_SIZE} showItemInfo={false} />

      <div className="name">{props.item.longName}</div>

      <style jsx>{`
        .listing-item {
          position: relative;
          margin-bottom: 0.5rem;

          &:last-child {
            margin-bottom: 0;
          }

          & > .name {
            position: absolute;
            bottom: 0;
            left: 0;
            color: #ffffff;
            background-color: rgba(0, 0, 0, 0.9);
            padding: 3px 5px;
            font-size: 0.7rem;
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  )
}
