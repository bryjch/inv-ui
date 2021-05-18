import { Overlay } from './Overlay'
import { Catalogue, PlayerGear, PlayerStorages, Stash } from './Panels'
import { parseMouseEvent } from '../data/helpers'

import { dispatch, useStore } from '@zus/tarkov/store'
import {
  updateDraggingAction,
  completedDraggingAction,
  clearDragHoveringSlotsAction,
} from '@zus/tarkov/actions'

export const Viewport = () => {
  const dragging = useStore(state => state.dragging)

  //
  // ─── METHODS ────────────────────────────────────────────────────────────────────
  //

  const onHoverArea = (event: React.MouseEvent, data: { [key: string]: any }) => {
    try {
      const { state, target } = data

      if (!(event.relatedTarget instanceof Element)) return null

      if (state === 'enter') {
        if (dragging.item) {
          dispatch(updateDraggingAction({ to: target, index: null }))
        } else {
          dispatch(updateDraggingAction({ from: target, index: null }))
        }
      }

      if (state === 'exit' && event.relatedTarget.id === 'viewport') {
        dispatch(updateDraggingAction({ to: null, index: null }))
        dispatch(clearDragHoveringSlotsAction())
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onClickArea = async (event: React.MouseEvent, data: { [key: string]: any }) => {
    const { item, target } = data

    if (!(event.target instanceof Element)) return null

    event.stopPropagation()

    const { clientOffset, rect } = parseMouseEvent(event, item ? undefined : `#${target}`)

    if (dragging.item) {
      dispatch(completedDraggingAction())
      dispatch(updateDraggingAction({ from: target }))
      return true
    }

    if (item && rect) {
      const gridOffset = { x: clientOffset.x - rect.left, y: clientOffset.y - rect?.top }

      await dispatch(
        updateDraggingAction({ item: item, from: target, to: target, gridOffset: gridOffset })
      )
      return true
    }

    try {
    } catch (error) {
      console.error(error)
    }
  }

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  // TODO: this can probably exist directly in the Grid component / a service
  const areaMethods = { onClickArea, onHoverArea }

  return (
    <div id="viewport">
      <Catalogue areaMethods={areaMethods} />

      <PlayerGear areaMethods={areaMethods} />

      <PlayerStorages areaMethods={areaMethods} />

      <Stash areaMethods={areaMethods} />

      <Overlay />

      <style jsx>{`
        #viewport {
          position: relative;
          width: 100%;
          max-width: 1300px;
          height: 100vh;
          display: flex;
          flex-flow: row nowrap;
          justify-content: flex-start;
          align-items: center;
        }
      `}</style>
    </div>
  )
}

export default Viewport
