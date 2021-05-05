import { useRef } from 'react'
import { throttle } from 'lodash'
import { useDrop, DropTargetMonitor } from 'react-dnd'

import { ListingItem } from './ListingItem'

import { Item } from '../../data/definitions'
import items from '../../data/items.json'

import { dispatch } from '@zus/re4/store'
import { updateDraggingAction, clearDragHoveringSlotsAction } from '@zus/re4/actions'

const DUMMY_ITEMS = items as Item[]

export interface ListingProps {
  id: string
}

export const Listing = (props: ListingProps) => {
  const ref = useRef<HTMLDivElement | null>(null)

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  const onListingHover = throttle((_: any, monitor: DropTargetMonitor) => {
    // Reset on hover out
    if (!monitor.isOver()) {
      dispatch(updateDraggingAction({ to: null }))
      dispatch(clearDragHoveringSlotsAction())
      return null
    }

    dispatch(updateDraggingAction({ to: props.id }))
  }, 50)

  const [, connectDropRef] = useDrop(() => ({
    accept: ['GridItem', 'ListingItem'],
    hover: onListingHover,
  }))

  connectDropRef(ref)

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  return (
    <div id={props.id} ref={ref}>
      {DUMMY_ITEMS.map((item, index) => (
        <ListingItem item={item} gridId={props.id} key={`listing-item-${index}`} />
      ))}

      <style jsx>{`
        #listing-catalogue {
          background: rgba(0, 0, 0, 0.2);
          max-height: 500px;
          overflow-y: auto;
          margin-left: 1rem;
        }
      `}</style>
    </div>
  )
}
