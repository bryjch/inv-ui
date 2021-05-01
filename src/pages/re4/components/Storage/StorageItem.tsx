import { useEffect } from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

import { Item } from '../../data/definitions'

import { dispatch } from '@zus/re4/store'
import { updateDraggingAction } from '@zus/re4/actions'

const SLOT_SIZE = 60

export interface StorageItemProps {
  item: Item
}

export const StorageItem = ({ item }: StorageItemProps) => {
  const [collectedProps, dragRef, preview] = useDrag(
    () => ({
      type: 'StorageItem',
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    []
  )

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  useEffect(() => {
    if (collectedProps.isDragging) {
      dispatch(updateDraggingAction({ item: item }))
    } else {
      dispatch(updateDraggingAction({ item: null, from: null, to: null }))
    }
  }, [collectedProps.isDragging, item])

  return (
    <div className="storage-item" ref={dragRef}>
      <div>{item.name}</div>

      <div className="drag-overlay" />

      <style jsx>{`
        .storage-item {
          position: relative;
          background-color: pink;
          width: ${SLOT_SIZE * item.dimensions.w}px;
          height: ${SLOT_SIZE * item.dimensions.h}px;
          margin: 8px;
          padding: 5px;
          opacity: ${collectedProps.isDragging ? 0.5 : 1};

          & > .drag-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
        }
      `}</style>
    </div>
  )
}
