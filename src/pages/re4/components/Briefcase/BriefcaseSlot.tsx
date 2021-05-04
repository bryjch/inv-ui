import { BriefcaseItem } from './BriefcaseItem'

import { useStore } from '@zus/re4/store'

export const BriefcaseSlot = (props: { index: number }) => {
  const hovered = useStore(state => state.dragging.occupying.includes(props.index))
  const item = useStore(state =>
    state.briefcase.items.find(({ position }) => position === props.index)
  )

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  return (
    <div className="slot">
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
        }
      `}</style>

      <style jsx>{`
        .slot {
          background-color: ${hovered ? 'green' : '#8b8b8b'};
        }
      `}</style>
    </div>
  )
}
