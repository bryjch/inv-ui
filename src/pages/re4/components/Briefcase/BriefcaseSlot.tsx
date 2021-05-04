import { intersection, difference } from 'lodash'

import { BriefcaseItem } from './BriefcaseItem'
import { getItemOccupiedSlots } from '../../data/helpers'

import { useStore } from '@zus/re4/store'

export const BriefcaseSlot = (props: { index: number }) => {
  const status = useStore(state => getSlotStatus(props, state))

  const item = useStore(state =>
    state.briefcase.items.find(({ position }) => position === props.index)
  )

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  return (
    <div className={`slot ${status}`}>
      {item && <BriefcaseItem item={item} />}

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
          outline: 2px solid var(--briefcase-grid-color);

          &.hovered.valid {
            background-color: green;
          }

          &.hovered.invalid {
            background-color: red;
          }
        }
      `}</style>
    </div>
  )
}

const getSlotStatus = ({ index }: any, { dragging, briefcase }: any) => {
  const cls = []

  if (!dragging.item) return ''
  if (!dragging.occupying.includes(index)) return ''

  cls.push('hovered')

  const [occupyingSlots] = getItemOccupiedSlots(dragging.item)

  const actualFilledSlots = difference(briefcase.occupied, occupyingSlots)

  const colliding = intersection(actualFilledSlots, dragging.occupying)

  const slotsRequired = dragging.item.dimensions.w * dragging.item.dimensions.h

  if (colliding.length > 0 || slotsRequired > dragging.occupying.length) {
    cls.push('invalid')
  } else {
    cls.push('valid')
  }

  return cls.join(' ')
}
