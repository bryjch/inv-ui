import { useEffect } from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

import { ItemPreview } from '../ItemPreview'
import { Item } from '../../data/definitions'

import { dispatch, useStore } from '@zus/re4/store'
import { updateDraggingAction, completedDraggingAction } from '@zus/re4/actions'

export interface GridItemProps {
  item: Item
  gridId: string
}

export const GridItem = (props: GridItemProps) => {
  const canOverlap = useStore(state => !!state.dragging.item)

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  const [collectedProps, dragRef, preview] = useDrag(
    () => ({
      type: 'GridItem',
      end: () => dispatch(completedDraggingAction()),
      collect: monitor => ({ isDragging: monitor.isDragging() }),
    }),
    [props.gridId]
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
  if (canOverlap) cls.push('can-overlap')

  return (
    <div className={`briefcase-item ${cls.join(' ')}`} ref={dragRef}>
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
