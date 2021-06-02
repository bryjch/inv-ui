import { BsGrid3X3 } from 'react-icons/bs'

import { Item } from '../data/definitions'

import { dispatch } from '@zus/tarkov/store'
import { toggleItemPopupPanelAction } from '@zus/tarkov/actions'

////////////////
// Prop types //
////////////////
export type ItemInfoProps = {
  item: Item
  showShortName?: boolean
  style?: React.CSSProperties
} & typeof defaultProps

const defaultProps = {
  showShortName: true,
  style: {},
}

//////////////////////////
// Component definition //
//////////////////////////
export const ItemInfo = (props: ItemInfoProps) => {
  const onClickGrid = (event: React.MouseEvent) => {
    try {
      event.stopPropagation()
      event.preventDefault()

      switch (event.button) {
        case 0:
        case 1:
          dispatch(toggleItemPopupPanelAction(props.item))
          break
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="item-info" style={props.style}>
      {/* Short Name */}

      {props.showShortName && <div className="short-name">{props.item.shortName}</div>}

      {/* Grids */}

      {!!props.item.grids && (
        <div
          className="grid"
          title="View internal storage (Middle mouse click)"
          onMouseDown={onClickGrid}
        >
          <BsGrid3X3 />
        </div>
      )}

      <style jsx>{`
        .item-info {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          pointer-events: none;

          & > .short-name {
            position: absolute;
            top: 4px;
            right: 4px;
            color: #ffffff;
            font-size: 0.8rem;
            line-height: 0.8rem;
            pointer-events: none;
            text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
          }

          & > .grid {
            position: absolute;
            bottom: 4px;
            right: 4px;
            line-height: 0;
            color: #ffffff;
            opacity: 0.6;
            pointer-events: auto;

            &:hover {
              opacity: 0.8;
            }
          }
        }
      `}</style>
    </div>
  )
}

ItemInfo.defaultProps = defaultProps
