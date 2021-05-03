import { Item } from '../data/definitions'
import { getSpriteBackgroundOffset } from '../data/helpers'

export interface ItemPreviewProps {
  item: Item
  slotSize?: number
  showGrid?: boolean
}

export const ItemPreview = ({ item, slotSize = 60, showGrid = true }: ItemPreviewProps) => {
  return (
    <div className={`preview ${showGrid ? 'grid' : ''}`}>
      <div
        className="image-overlay"
        style={getSpriteBackgroundOffset(item.spriteOffset, slotSize)}
      />

      <div className="name">{item.displayName}</div>

      <style jsx>{`
        @import 'assets/css/mixins.scss';

        .preview {
          position: relative;
          width: ${slotSize * item.dimensions.w}px;
          height: ${slotSize * item.dimensions.h}px;
          background-size: ${`${slotSize}px ${slotSize}px`};

          &.grid {
            @include background-image-gridlines(2px, rgba(255, 255, 255, 0.2));
            border-color: rgba(255, 255, 255, 0.05);
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

          & > .image-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-size: ${slotSize * 10}px;
            background-image: url(/assets/re4/images/guns.png);
            image-rendering: -webkit-optimize-contrast;
          }
        }
      `}</style>
    </div>
  )
}
