import { forwardRef } from 'react'

import { Item, Dimensions } from '../data/definitions'
import { DEFAULT_GRID_SIZE } from '../data/constants'

export interface ItemPreviewProps {
  item: Item
  slotSize?: number
  fitTo?: Dimensions
  showGrid?: boolean
  showShortName?: boolean
}

export const ItemPreview = forwardRef<HTMLDivElement, ItemPreviewProps>(
  (
    {
      item,
      slotSize = DEFAULT_GRID_SIZE,
      fitTo = undefined,
      showGrid = true,
      showShortName = true,
    },
    ref
  ) => {
    const cls = []
    if (showGrid) cls.push('grid')
    if (item.rotated) cls.push('rotated')
    if (!!fitTo) cls.push('fitted')

    let src = ''
    switch (item.type) {
      case 'weapon':
        src = 'url(/assets/tarkov/images/weapons.png)'
        break

      case 'storage':
        src = 'url(/assets/tarkov/images/storages.png)'
        break

      case 'consumable':
        src = 'url(/assets/tarkov/images/consumables.png)'
        break

      default:
        break
    }

    let fitted = getFittedDimensions(item, fitTo)

    return (
      <div ref={ref} className={`preview ${cls.join(' ')}`}>
        <div className="image-overlay" style={getSpriteBackgroundOffset(item)} />

        {showShortName && <div className="short-name">{item.shortName}</div>}

        <style jsx>{`
          @import 'assets/css/mixins.scss';

          .preview {
            position: relative;
            pointer-events: none;

            &.grid {
              @include background-image-gridlines(2px, rgba(255, 255, 255, 0.2));
              border-color: rgba(255, 255, 255, 0.05);
            }

            & > .image-overlay {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-image: ${src};
              image-rendering: -webkit-optimize-contrast;
            }

            & > .short-name {
              position: absolute;
              top: 2px;
              right: 4px;
              color: #ffffff;
              font-size: 0.8rem;
              text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
            }

            &.rotated {
              & > .short-name {
                transform: rotateZ(90deg);
                transform-origin: bottom right;
                top: unset;
                right: 1rem;
                bottom: 4px;
              }
            }
          }
        `}</style>

        <style jsx>{`
          .preview {
            width: ${slotSize * item.dimensions.w}px;
            height: ${slotSize * item.dimensions.h}px;

            &.grid {
              background-size: ${`${slotSize}px ${slotSize}px`};
            }

            &.fitted {
              height: ${fitted.h};
              width: ${fitted.w};
              aspect-ratio: ${fitted.aspectRatio};
            }
          }
        `}</style>
      </div>
    )
  }
)

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
  const backgroundPosX = (100 * spriteOffset[0]) / (SPRITESHEET_COLS - w)
  const backgroundPosY = (100 * spriteOffset[1]) / (SPRITESHEET_ROWS - h)

  return {
    backgroundPosition: `${backgroundPosX}% ${backgroundPosY}%`,
    backgroundSize: `${(100 * SPRITESHEET_COLS) / w}% ${(100 * SPRITESHEET_ROWS) / h}%`,
  }
}

// The purpose of this function is to work similarly to CSS object-fit, but for normal
// divs. Depending on dimensions of the {fitTo} container, the "restiction" needs to
// either be the container's width or height
const getFittedDimensions = (item: Item, fitTo: Dimensions | undefined) => {
  let fittedWidth, fittedHeight
  let fittedAspectRatio = item.dimensions.w / item.dimensions.h

  if (!!fitTo) {
    // Determine whether container width or height should be the "restriction"
    fittedWidth = fitTo.w === fitTo.h ? '100%' : fitTo.w < fitTo.h ? '100%' : 'auto'
    fittedHeight = fitTo.w === fitTo.h ? '100%' : fitTo.w > fitTo.h ? '100%' : 'auto'

    // If container is the same size, check the item width or height as "restriction"
    if (fittedWidth === fittedHeight && item.dimensions.w !== item.dimensions.h) {
      fittedWidth = item.dimensions.w > item.dimensions.h ? '100%' : 'auto'
      fittedHeight = item.dimensions.w < item.dimensions.h ? '100%' : 'auto'
    }
  }

  return { w: fittedWidth, h: fittedHeight, aspectRatio: fittedAspectRatio }
}
