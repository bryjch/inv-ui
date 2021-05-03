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
    } else {
      dispatch(completedDraggingAction())
    }
  }, [collectedProps.isDragging, item])

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  return (
    <div className="storage-item" ref={dragRef}>
      <ItemPreview item={item} slotSize={40} />

      <style jsx>{`
        .storage-item {
          margin: 0.5rem;
          opacity: ${collectedProps.isDragging ? 0.33 : 1};
        }
      `}</style>
    </div>
  )
}
