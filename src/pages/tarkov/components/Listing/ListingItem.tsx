import React from 'react'

import { ItemPreview } from '../ItemPreview'
import { Item } from '../../data/definitions'

export interface ListingItemProps {
  item: Item
  index: number
  gridId: string
  onClickArea: (e: React.MouseEvent, data: { [key: string]: any }) => any
}

export const ListingItem = (props: ListingItemProps) => {
  return (
    <div
      className="listing-item"
      onMouseDown={e => props.onClickArea(e, { item: props.item, target: props.gridId })}
    >
      <ItemPreview item={props.item} slotSize={60} />

      <div className="name">{props.item.displayName}</div>

      <style jsx>{`
        .listing-item {
          position: relative;
          margin: 0.5rem;

          & > .name {
            position: absolute;
            bottom: 0;
            left: 0;
            color: #ffffff;
            background-color: rgba(0, 0, 0, 0.9);
            padding: 4px 6px;
            font-size: 0.7rem;
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  )
}
