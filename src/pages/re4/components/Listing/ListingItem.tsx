import { useDraggable } from '@dnd-kit/core'

import { ItemPreview } from '../ItemPreview'
import { Item } from '../../data/definitions'

export interface ListingItemProps {
  item: Item
  index: number
  gridId: string
}

export const ListingItem = (props: ListingItemProps) => {
  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  const { isDragging, setNodeRef, listeners, attributes } = useDraggable({
    id: props.item.uuid || props.item.iid,
    data: { item: props.item, target: props.gridId },
  })

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  const cls = []
  if (isDragging) cls.push('dragging')

  return (
    <div
      className={`listing-item ${cls.join(' ')}`}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      <ItemPreview item={props.item} slotSize={60} />

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
