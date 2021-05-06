import { get, throttle } from 'lodash'
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core'

import { Listing } from './Listing'
import { Overlay } from './Overlay'
import { Grid } from './Grid'

import { dispatch } from '@zus/re4/store'
import {
  updateDraggingAction,
  completedDraggingAction,
  clearDragHoveringSlotsAction,
} from '@zus/re4/actions'

export const Viewport = () => {
  //
  // ─── METHODS ────────────────────────────────────────────────────────────────────
  //

  const onDragStart = (event: DragStartEvent) => {
    try {
      const activeData = get(event, 'active.data.current', {})

      if (!activeData) throw new Error("Drag item doesn't have any data!")

      dispatch(updateDraggingAction({ item: activeData.item, from: activeData.target }))
    } catch (error) {
      console.error(error)
    }
  }

  const onDragOver = (event: DragOverEvent) => {
    try {
      const overData = get(event, 'over.data.current', {})

      dispatch(updateDraggingAction({ to: overData.target || null, index: null }))
      dispatch(clearDragHoveringSlotsAction())
    } catch (error) {
      console.error(error)
    }
  }

  const onDragMove = throttle((event: DragMoveEvent) => {
    try {
      const overData = get(event, 'over.data.current', {})

      if (event.active.rect.current.initial && overData.onDragMove) {
        const clientOffset = {
          x: event.active.rect.current.initial.offsetLeft + event.delta.x,
          y: event.active.rect.current.initial.offsetTop + event.delta.y,
        }

        overData.onDragMove(clientOffset)
      }
    } catch (error) {
      console.error(error)
    }
  }, 50)

  const onDragEnd = (event: DragEndEvent) => {
    try {
      dispatch(completedDraggingAction())
    } catch (error) {
      console.error(error)
    }
  }

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
    >
      <div id="viewport">
        <Grid id="grid-backpack" cols={10} rows={6} />

        <div style={{ width: '1rem' }} />

        <div>
          <Grid id="grid-briefcase" cols={6} rows={2} />

          <div style={{ height: '1rem' }} />

          <Grid id="grid-pouch" cols={6} rows={2} />

          <div style={{ height: '1rem' }} />

          <Grid id="grid-pockets" cols={6} rows={1} />
        </div>

        <Listing id="listing-catalogue" />

        <Overlay />

        <style jsx>{`
          #viewport {
            position: relative;
            width: 100%;
            height: 100vh;
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            align-items: center;
          }
        `}</style>
      </div>
    </DndContext>
  )
}

export default Viewport
