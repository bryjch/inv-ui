import { GridItem } from './GridItem'

import { Item } from '../../data/definitions'

export interface GridSlotProps {
  index: number
  gridId: string
  item?: Item
  status?: string[]
}

export const GridSlot = (props: GridSlotProps) => {
  let cls = props.status || []

  return (
    <div className={`slot ${cls.join(' ')}`}>
      {props.item && <GridItem item={props.item} gridId={props.gridId} />}

      <style jsx>{`
        .slot {
          position: relative;
          min-width: 0;
          width: 100%;
          flex: 1;
          aspect-ratio: 1;
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;
          outline: 1px solid rgba(80, 80, 80, 1);

          &:before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background-image: url(/assets/re4/images/grid_square.png);
            background-size: cover;
            opacity: 0.8;
            z-index: 0;
          }

          &:after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 0;
          }

          &.hovered.valid {
            outline: 1px solid rgba(80, 80, 80, 0.2);

            &:before {
              background-image: none;
              background-color: green;
              opacity: 0.5;
            }
          }

          &.hovered.invalid {
            outline: 1px solid rgba(80, 80, 80, 0.2);

            &:before {
              background-image: none;
              background-color: red;
              opacity: 0.2;
            }
          }
        }
      `}</style>
    </div>
  )
}
