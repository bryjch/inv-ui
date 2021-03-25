import { useCallback } from 'react'
import keycode from 'keycode'

import { useStore, dispatch } from '@zus/store'
import { popUIPanelAction } from '@zus/actions'

import { useEventListener } from '@utils/hooks'

/**
 * This is just a null object to make it easier for us to handle
 * any global key press behaviour
 */
export const GlobalKeyHandler = () => {
  const activePanels: any = useStore((state: any) => state.ui.activePanels)

  const popUIPanel = () => dispatch(popUIPanelAction())

  const canvasKeyDown = useCallback(
    (event: KeyboardEvent) => {
      try {
        switch (keycode(event)) {
          case 'esc':
            popUIPanel()
            break

          default:
            break
        }
      } catch (error) {
        console.error(error)
      }
    },
    [activePanels] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const canvasKeyUp = useCallback((event: KeyboardEvent) => {
    switch (keycode(event)) {
      default:
        break
    }
  }, [])

  useEventListener('keydown', canvasKeyDown, window)
  useEventListener('keyup', canvasKeyUp, window)

  return null
}
