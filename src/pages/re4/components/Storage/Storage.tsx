import { useRef } from 'react'
import { throttle } from 'lodash'
import { useDrop, DropTargetMonitor } from 'react-dnd'

import { StorageItem } from './StorageItem'

import { Item, DropType } from '../../data/definitions'

import { dispatch } from '@zus/re4/store'
import { updateDraggingAction, clearOccupyingSlotsAction } from '@zus/re4/actions'

import items from '../../data/items.json'

const DUMMY_ITEMS = items as Item[]

export const Storage = () => {
  const ref = useRef<HTMLDivElement | null>(null)

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  const onStorageHover = throttle((_: any, monitor: DropTargetMonitor) => {
    // Reset on hover out
    if (!monitor.isOver()) {
      dispatch(updateDraggingAction({ to: null }))
      dispatch(clearOccupyingSlotsAction())
      return null
    }

    dispatch(updateDraggingAction({ to: DropType.Storage }))
  }, 50)

  const [, connectDropRef] = useDrop(() => ({
    accept: [DropType.Briefcase, DropType.Storage],
    hover: onStorageHover,
  }))

  connectDropRef(ref)

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  return (
    <div id="storage" ref={ref}>
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
