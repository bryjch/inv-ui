import { Item } from '../data/definitions'

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
  return (
    <div className="item-info" style={props.style}>
      {props.showShortName && <div className="short-name">{props.item.shortName}</div>}

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
            top: 2px;
            right: 4px;
            color: #ffffff;
            font-size: 0.8rem;
            pointer-events: none;
            text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
          }
        }
      `}</style>
    </div>
  )
}

ItemInfo.defaultProps = defaultProps
