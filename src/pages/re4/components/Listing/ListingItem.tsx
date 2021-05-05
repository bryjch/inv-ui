import { useEffect } from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

import { ItemPreview } from '../ItemPreview'
import { Item } from '../../data/definitions'

import { dispatch } from '@zus/re4/store'
import { updateDraggingAction, completedDraggingAction } from '@zus/re4/actions'

export interface ListingItemProps {
  item: Item
  gridId: string
}

export const ListingItem = (props: ListingItemProps) => {
  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  const [collectedProps, dragRef, preview] = useDrag(
    () => ({
      type: 'ListingItem',
      end: () => dispatch(completedDraggingAction()),
      collect: monitor => ({ isDragging: monitor.isDragging() }),
    }),
    []
  )

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  useEffect(() => {
    if (collectedProps.isDragging) {
      dispatch(updateDraggingAction({ item: props.item, from: props.gridId }))
    }
  }, [collectedProps.isDragging, props.item, props.gridId])

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  const cls = []
  if (collectedProps.isDragging) cls.push('dragging')

  return (
    <div className={`listing-item ${cls.join(' ')}`} ref={dragRef}>
      <ItemPreview item={props.item} slotSize={40} />

      <div className="name">{props.item.displayName}</div>

      <style jsx>{`
        .listing-item {
          position: relative;
          margin: 0.5rem;

          &.dragging {
            opacity: 0.3;
          }

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
