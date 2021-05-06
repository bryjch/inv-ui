import { useDraggable } from '@dnd-kit/core'

import { ItemPreview } from '../ItemPreview'
import { Item } from '../../data/definitions'

import { useStore } from '@zus/re4/store'

export interface GridItemProps {
  item: Item
  gridId: string
}

export const GridItem = (props: GridItemProps) => {
  const canOverlap = useStore(state => !!state.dragging.item)

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  const { isDragging, setNodeRef, listeners, attributes } = useDraggable({
    id: props.item.uuid,
    data: { item: props.item, target: props.gridId },
  })

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  const cls = []
  if (isDragging) cls.push('dragging')
  if (canOverlap) cls.push('can-overlap')

  return (
    <div
      className={`briefcase-item ${cls.join(' ')}`}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      <ItemPreview item={props.item} fluid showGrid={false} />

      <style jsx>{`
        .briefcase-item {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 100;
          width: calc(100% * ${props.item.dimensions.w});
          height: calc(100% * ${props.item.dimensions.h});
          pointer-events: auto;
          outline: 2px solid rgba(255, 255, 255, 0.2);
          outline-offset: -2px;

          &:before {
            position: absolute;
            content: '';
            top: 1px;
            left: 1px;
            right: 1px;
            bottom: 1px;
            background: rgba(15, 15, 15, 0.8);
          }

          &:hover {
            &:before {
              background: rgba(255, 255, 255, 0.4);
            }
          }

          &.dragging {
            opacity: 0;

            &:before {
              background: none;
            }
          }

          &.can-overlap {
            pointer-events: none;
          }
        }
      `}</style>
    </div>
  )
}
