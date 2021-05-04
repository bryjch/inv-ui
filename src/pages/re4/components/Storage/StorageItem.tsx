import { useEffect } from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

import { ItemPreview } from '../ItemPreview'
import { Item, DropType } from '../../data/definitions'

import { dispatch } from '@zus/re4/store'
import { updateDraggingAction, completedDraggingAction } from '@zus/re4/actions'

export interface StorageItemProps {
  item: Item
}

export const StorageItem = ({ item }: StorageItemProps) => {
  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  const [collectedProps, dragRef, preview] = useDrag(
    () => ({
      type: DropType.Storage,
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
      dispatch(updateDraggingAction({ item: item, from: DropType.Storage }))
    }
  }, [collectedProps.isDragging, item])

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  const cls = []
  if (collectedProps.isDragging) cls.push('dragging')

  return (
    <div className={`storage-item ${cls.join(' ')}`} ref={dragRef}>
      <ItemPreview item={item} slotSize={40} />

      <style jsx>{`
        .storage-item {
          margin: 0.5rem;

          &.dragging {
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  )
}
