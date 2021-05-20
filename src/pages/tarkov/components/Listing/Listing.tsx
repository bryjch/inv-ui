import { ListingItem } from './ListingItem'

import { Item } from '../../data/definitions'
import consumables from '../../data/consumables.json'
import storages from '../../data/storages.json'
import weapons from '../../data/weapons.json'

import { onClickDragArea, onClickDragAreaItem, onMouseOverDragArea } from '../../utils/mouseEvents'

let DUMMY_ITEMS = [...weapons, ...storages, ...consumables] as Item[]

////////////////
// Prop types //
////////////////
export type ListingProps = {
  id: string
}

//////////////////////////
// Component definition //
//////////////////////////
export const Listing = (props: ListingProps) => {
  return (
    <div
      id={props.id}
      onMouseEnter={onMouseOverDragArea(props.id, 'enter')}
      onMouseLeave={onMouseOverDragArea(props.id, 'exit')}
      onMouseDown={onClickDragArea(props.id)}
    >
      {DUMMY_ITEMS.map((item, index) => (
        <ListingItem
          item={item}
          index={index}
          key={`listing-${props.id}-item-${index}`}
          onClick={() => onClickDragAreaItem(props.id, item)}
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
