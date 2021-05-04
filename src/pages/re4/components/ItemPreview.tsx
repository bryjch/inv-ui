import { Item } from '../data/definitions'

export interface ItemPreviewProps {
  item: Item
  slotSize?: number
  fluid?: boolean
  showGrid?: boolean
}

export const ItemPreview = ({
  item,
  slotSize = 60,
  fluid = false,
  showGrid = true,
}: ItemPreviewProps) => {
  const cls = []
  if (fluid) cls.push('fluid')
  if (showGrid) cls.push('grid')

  return (
    <div className={`preview ${cls.join(' ')}`}>
      <div className="image-overlay" style={getSpriteBackgroundOffset(item)} />

      <style jsx>{`
        @import 'assets/css/mixins.scss';

        .preview {
          position: relative;
          width: ${slotSize * item.dimensions.w}px;
          height: ${slotSize * item.dimensions.h}px;

          &.grid {
            @include background-image-gridlines(2px, rgba(255, 255, 255, 0.2));
            background-size: ${`${slotSize}px ${slotSize}px`};
            border-color: rgba(255, 255, 255, 0.05);
          }

          &.fluid {
            width: 100%;
            height: 100%;
          }

          & > .image-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url(/assets/re4/images/guns.png);
            image-rendering: -webkit-optimize-contrast;
          }
        }
      `}</style>
    </div>
  )
}

const getSpriteBackgroundOffset = (item: Item) => {
  // Note: values need to be updated if spritesheet dimensions are changes
  // TODO: make these values dynamic based on the spritesheet image being loaded

  const SPRITESHEET_GRID_SIZE = 60 // px
  const SPRITESHEET_WIDTH = 600 // px
  const SPRITESHEET_HEIGHT = 1200 // px

  const SPRITESHEET_COLS = SPRITESHEET_WIDTH / SPRITESHEET_GRID_SIZE
  const SPRITESHEET_ROWS = SPRITESHEET_HEIGHT / SPRITESHEET_GRID_SIZE

  const { spriteOffset, dimensions } = item
  const { w, h } = dimensions

  // Due to how background-position works, the denominator value needs to be subtracted
  const backgroundPosX = (100 * spriteOffset[0]) / (SPRITESHEET_COLS - h)
  const backgroundPosY = (100 * spriteOffset[1]) / (SPRITESHEET_ROWS - h)

  return {
    backgroundPosition: `${backgroundPosX}% ${backgroundPosY}%`,
    backgroundSize: `${(100 * SPRITESHEET_COLS) / w}% ${(100 * SPRITESHEET_ROWS) / h}%`,
  }
}
