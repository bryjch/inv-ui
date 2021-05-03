import { useEffect } from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

import { ItemPreview } from '../ItemPreview'
import { Item, DropType } from '../../data/definitions'

import { dispatch, useStore } from '@zus/re4/store'
import { updateDraggingAction, completedDraggingAction } from '@zus/re4/actions'

export interface BriefcaseItemProps {
  item: Item
}

export const BriefcaseItem = ({ item }: BriefcaseItemProps) => {
  const canOverlap = useStore(state => !!state.dragging.item)

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
    <div className="briefcase-item" ref={dragRef}>
      <ItemPreview item={item} fluid showGrid={false} />

      <style jsx>{`
        .briefcase-item {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 100;
          background: var(--briefcase-item-background-color);
          outline: 3px solid var(--briefcase-item-outline-color);
          outline-offset: -4px;
          width: calc(100% * ${item.dimensions.w});
          height: calc(100% * ${item.dimensions.h});
        }
      `}</style>

      <style jsx>{`
        .briefcase-item {
          pointer-events: ${canOverlap ? 'none' : 'auto'};
        }
      `}</style>
    </div>
  )
}
