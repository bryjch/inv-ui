import { useEffect, useState } from 'react'

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
