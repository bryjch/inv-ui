import { ListingItem } from './ListingItem'

import { Item } from '../../data/definitions'
import consumables from '../../data/consumables.json'
import storages from '../../data/storages.json'
import weapons from '../../data/weapons.json'
import gear from '../../data/gear.json'

import { onClickDragArea, onClickDragAreaItem, onMouseOverDragArea } from '../../utils/mouseEvents'

// TODO: probably do this better
let DUMMY_ITEMS = [...weapons, ...consumables, ...gear, ...storages] as Item[]

////////////////
// Prop types //
////////////////
export type ListingProps = {
  id: string
  filter?: string
}

//////////////////////////
// Component definition //
//////////////////////////
export const Listing = (props: ListingProps) => {
  const items = DUMMY_ITEMS.filter(
    item =>
      props.filter === undefined ||
      props.filter === 'all' ||
      [item.type, ...item.tags].includes(props.filter)
  )

  return (
    <div
      id={props.id}
      onMouseEnter={onMouseOverDragArea(props.id, 'enter')}
      onMouseLeave={onMouseOverDragArea(props.id, 'exit')}
      onMouseDown={onClickDragArea(props.id)}
    >
      {items.map((item, index) => (
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
