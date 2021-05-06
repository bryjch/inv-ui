import { useDroppable } from '@dnd-kit/core'

import { ListingItem } from './ListingItem'

import { Item } from '../../data/definitions'
import items from '../../data/items.json'

let DUMMY_ITEMS = items as Item[]

export interface ListingProps {
  id: string
}

export const Listing = (props: ListingProps) => {
  const { setNodeRef } = useDroppable({ id: props.id, data: { target: props.id } })

  return (
    <div id={props.id} ref={setNodeRef}>
      {DUMMY_ITEMS.map((item, index) => (
        <ListingItem
          item={item}
          index={index}
          gridId={props.id}
          key={`listing-${props.id}-item-${index}`}
        />
      ))}

      <style jsx>{`
        #listing-catalogue {
          display: flex;
          flex-flow: column nowrap;
          align-items: flex-start;
          background: rgba(0, 0, 0, 0.2);
          max-height: 500px;
          overflow-y: auto;
          margin-left: 1rem;
        }
      `}</style>
    </div>
  )
}
