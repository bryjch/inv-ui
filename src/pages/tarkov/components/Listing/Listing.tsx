import React from 'react'

import { ListingItem } from './ListingItem'

import { Item } from '../../data/definitions'
import consumables from '../../data/consumables.json'
import storages from '../../data/storages.json'
import weapons from '../../data/weapons.json'

let DUMMY_ITEMS = [...weapons, ...storages, ...consumables] as Item[]

export interface ListingProps {
  id: string
  onClickArea?: (event: React.MouseEvent, data: { [key: string]: any }) => any
  onHoverArea?: (event: React.MouseEvent, data: { [key: string]: any }) => any
}

export const Listing = (props: ListingProps) => {
  return (
    <div
      id={props.id}
      onMouseEnter={e => props.onHoverArea?.(e, { state: 'enter', target: props.id })}
      onMouseOut={e => props.onHoverArea?.(e, { state: 'exit', target: props.id })}
      onMouseDown={e => props.onClickArea?.(e, { item: null, target: props.id })}
    >
      {DUMMY_ITEMS.map((item, index) => (
        <ListingItem
          item={item}
          index={index}
          gridId={props.id}
          key={`listing-${props.id}-item-${index}`}
          onClickArea={(e, data) => props.onClickArea?.(e, data)}
        />
      ))}

      <style jsx>{`
        #listing-catalogue {
          display: flex;
          flex-flow: column nowrap;
          align-items: flex-start;
        }
      `}</style>
    </div>
  )
}
