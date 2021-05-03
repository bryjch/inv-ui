import { useEffect } from 'react'
import { useDrop } from 'react-dnd'

import { StorageItem } from './StorageItem'

import { Item, DropType } from '../../data/definitions'

import { dispatch } from '@zus/re4/store'
import { updateDraggingAction, clearOccupyingSlotsAction } from '@zus/re4/actions'

import items from '../../data/items.json'

const DUMMY_ITEMS = items as Item[]

export const Storage = () => {
  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  const [collectedProps, dropRef] = useDrop(() => {
    return {
      accept: [DropType.Briefcase, DropType.Storage],
      collect: monitor => ({ isOver: monitor.isOver(), didDrop: monitor.didDrop() }),
    }
  })

  useEffect(() => {
    if (collectedProps.isOver) {
      dispatch(updateDraggingAction({ to: DropType.Storage }))
      return
    }

    if (!collectedProps.didDrop) {
      dispatch(updateDraggingAction({ to: null }))
      dispatch(clearOccupyingSlotsAction())
      return
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
