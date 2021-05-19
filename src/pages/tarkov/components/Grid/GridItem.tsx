import { ItemPreview } from '../ItemPreview'
import { Item } from '../../data/definitions'

import { useStore } from '@zus/tarkov/store'

export interface GridItemProps {
  item: Item
  gridId: string
  onClick?: (item: Item) => (e: React.MouseEvent) => any
}

export const GridItem = (props: GridItemProps) => {
  const draggingItem = useStore(state => state.dragging.item)
  const draggingSelf = draggingItem?.uuid === props.item.uuid

  const cls = []
  if (!!draggingItem) cls.push('can-overlap')
  if (!!draggingSelf) cls.push('dragging')
  if (!!props.item.rotated) cls.push('rotated')

  return (
    <div className={`grid-item ${cls.join(' ')}`} onMouseDown={props.onClick?.(props.item)}>
      <ItemPreview item={props.item} fluid showGrid={false} />

      <style jsx>{`
        .grid-item {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 100;
          pointer-events: auto;
          outline: 2px solid rgba(255, 255, 255, 0.2);
          outline-offset: -2px;
          transform-origin: bottom left;

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

          &.rotated {
            transform: rotateZ(-90deg);
            transform-origin: top left;
          }
        }
      `}</style>

      <style jsx>{`
        .grid-item {
          width: calc(100% * ${props.item.dimensions.w});
          height: calc(100% * ${props.item.dimensions.h});

          &.rotated {
            top: calc(100% * ${props.item.dimensions.w});
          }
        }
      `}</style>
    </div>
  )
}
