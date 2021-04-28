import { useRef, useEffect, useState } from 'react'

/**
 * Hook for easily adding element event listeners which will gracefully cleanup
 * itself when necessary and also update itself if {handler} dependencies change
 *
 * Reference: https://usehooks.com/useEventListener/
 */
export function useEventListener(
  eventName: string,
  handler: (...args: any[]) => any,
  element: HTMLElement | (Window & typeof globalThis) = window
) {
  // Create a ref that stores handler
  const savedHandler = useRef<any>()

  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler
  // without us needing to pass it in effect deps array
  // and potentially cause effect to re-run every render
  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(
    () => {
      // Make sure element supports addEventListener
      const isSupported = element && element.addEventListener
      if (!isSupported) return

      // Create event listener that calls handler function stored in ref
      const eventListener = (event: any) => savedHandler.current(event)

      // Add event listener
      element.addEventListener(eventName, eventListener)

      // Remove event listener on cleanup
      return () => {
        element.removeEventListener(eventName, eventListener)
      }
    },
    [eventName, element] // Re-run if eventName or element changes
  )
}

/**
 * Hook for tracking the position of user's mouse on the screen
 *
 * Reference: https://gist.github.com/whoisryosuke/99f23c9957d90e8cc3eb7689ffa5757c
 */

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const updateMousePosition = (event: MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY })
  }

  useEffect(() => {
    window.addEventListener('mousemove', updateMousePosition)

    return () => window.removeEventListener('mousemove', updateMousePosition)
  }, [])

  return mousePosition
}
