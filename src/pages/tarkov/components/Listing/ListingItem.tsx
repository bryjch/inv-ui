import React from 'react'

import { ItemPreview } from '../ItemPreview'
import { Item } from '../../data/definitions'
import { DEFAULT_GRID_SIZE } from '../../data/constants'

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
      <ItemPreview item={props.item} slotSize={DEFAULT_GRID_SIZE} />

      <div className="name">{props.item.displayName}</div>

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
