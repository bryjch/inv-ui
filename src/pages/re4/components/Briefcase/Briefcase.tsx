import { useEffect } from 'react'
import { useDrop } from 'react-dnd'
import { range } from 'lodash'

import { BriefcaseSlot } from './BriefcaseSlot'

import { dispatch } from '@zus/re4/store'
import { updateDraggingAction } from '@zus/re4/actions'

const NUM_COLUMNS = 10
const NUM_ROWS = 6

//
// ─── DEFINITION ─────────────────────────────────────────────────────────────────
//

export const Briefcase = () => {
  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  const [collectedProps, dropRef] = useDrop(() => {
    return {
      accept: ['StorageItem', 'BriefcaseItem'],
      collect: monitor => ({
        isOver: monitor.isOver(),
      }),
    }
  })

  useEffect(() => {
    dispatch(updateDraggingAction({ to: collectedProps.isOver ? 'briefcase' : null }))
  }, [collectedProps.isOver])

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  return (
    <div id="briefcase" ref={dropRef}>
      <div className="grid-container">
        <div className="grid">
          {range(0, NUM_COLUMNS * NUM_ROWS).map(index => (
            <BriefcaseSlot key={`briefcase-slot-${index}`} index={index} />
          ))}
        </div>
      </div>

      <style jsx>{`
        #briefcase {
          position: relative;
          width: 100%;
          max-width: 600px;

          /* Container is used to ensure 6/10 aspect ratio (works with both x & y resizing) */
          .grid-container {
            position: relative;
            width: 100%;
            max-width: 167vh; // 6:10 ratio
            margin: auto;
            height: 0;
            padding-bottom: 60%; // 6:10 ratio
            background-color: #1b1b1b;

            .grid {
              display: grid;
              grid-template-columns: repeat(${NUM_COLUMNS}, 1fr);
              grid-gap: 2px;
            }
          }
        }
      `}</style>
    </div>
  )
}
