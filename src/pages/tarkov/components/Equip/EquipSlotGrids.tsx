import { useSpring, animated } from 'react-spring'
import { uniq } from 'lodash'

import { Grid } from '../Grid'

import { Item, EquipSlotType } from '../../data/definitions'
import { DEFAULT_GRID_SIZE } from '../../data/constants'

export interface EquipSlotGridsProps {
  item: Item | null
  slotType: EquipSlotType
}

export const EquipSlotGrids = (props: EquipSlotGridsProps) => {
  const wrapper = calculateTotalGridSizes(props.item?.grids || [[]])

  const springStyle = useSpring({
    from: { opacity: 0, marginLeft: 30, marginRight: 0, height: 0 },
    to: { opacity: 1, marginLeft: 0, marginRight: 30, height: wrapper.totalHeight },
    reverse: !props.item,
  })

  return (
    <animated.div className="equip-slot-grids" style={springStyle}>
      {props.item?.grids?.map((grid, index) => {
        const [cols, rows, xPos, yPos] = grid
        const id = `grid-${props.slotType}-${props.item?.uuid}-${index}`

        return (
          <div
            key={id}
            className="equip-slot-grid"
            style={{
              gridRow: `${yPos} / ${yPos + rows}`,
              gridColumn: `${xPos} / ${xPos + cols}`,
              justifyContent:
                cols === wrapper.w ? `center` : xPos < wrapper.w / 2 ? `flex-end` : `flex-start`,
            }}
          >
            <Grid cols={cols} rows={rows} id={id} />
          </div>
        )
      })}

      <style jsx>{`
        :global(.equip-slot-grids) {
          position: relative;
          display: grid;
          grid-gap: 3px;

          & > .equip-slot-grid {
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      `}</style>
    </animated.div>
  )
}

// Since {grids} contains an array of smaller grids, we need to determine what
// the total "internal grid size" is that contains all these smaller ones --
// taking into account grid borders & gaps as well
const calculateTotalGridSizes = (grids: [number[]]) => {
  let w = 0
  let h = 0

  grids.forEach(([cols, rows, xPos, yPos]) => {
    if (xPos + cols > w) w = xPos + cols
    if (yPos + rows > h) h = yPos + rows
  })

  const borderSize = 2 // Kinda hard coded but whatever
  const gridGapSize = 3 // Kinda hard coded but whatever
  const xGaps = uniq(grids.map(i => i[2])).length - 1
  const yGaps = uniq(grids.map(i => i[3])).length - 1

  return {
    w: w - 1,
    h: h - 1,
    xGaps: xGaps,
    yGaps: yGaps,
    totalWidth: (w - 1) * DEFAULT_GRID_SIZE + (xGaps + 1) * 2 * borderSize + xGaps * gridGapSize,
    totalHeight: (h - 1) * DEFAULT_GRID_SIZE + (yGaps + 1) * 2 * borderSize + yGaps * gridGapSize,
  }
}
