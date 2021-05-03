import { useEffect } from 'react'
import { useDrop } from 'react-dnd'

import { StorageItem } from './StorageItem'

import { Item, DropType } from '../../data/definitions'
import { getItem } from '../../data/helpers'

import { dispatch } from '@zus/re4/store'
import { updateDraggingAction } from '@zus/re4/actions'

const DUMMY_ITEMS: Item[] = [
  getItem('sniperAIAM'),
  getItem('arAKTR3'),
  getItem('smgAHB'),
  getItem('pistolSWMP'),
  getItem('pistolSWM629'),
]

export const Storage = () => {
  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  const [collectedProps, dropRef] = useDrop(() => {
    return {
      accept: [DropType.Briefcase, DropType.Storage],
      collect: monitor => ({ isOver: monitor.isOver() }),
    }
  })

  useEffect(() => {
    if (collectedProps.isOver) {
      dispatch(updateDraggingAction({ to: DropType.Storage }))
    } else {
      dispatch(updateDraggingAction({ to: null }))
    }
  }, [collectedProps.isOver])

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  return (
    <div id="storage" ref={dropRef}>
      {DUMMY_ITEMS.map((item, index) => (
        <StorageItem item={item} key={`storage-item-${index}`} />
      ))}

      <style jsx>{`
        #storage {
          background: rgba(0, 0, 0, 0.2);
          max-height: 500px;
          overflow-y: auto;
          margin-left: 1rem;
        }
      `}</style>
    </div>
  )
}

export default Storage
