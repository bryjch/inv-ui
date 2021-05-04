import { Portal } from 'react-portal'

import { useMousePosition } from '@utils/hooks'

export const MousePosition = () => {
  const { x, y } = useMousePosition()

  return (
    <Portal node={document && document.getElementById('portal')}>
      <div
        className="debug-mouse-position"
        style={{ transform: `translate(${x + 30}px, ${y + 10}px)` }}
      >
        <pre>
          {x},{y}
        </pre>
      </div>

      <style jsx global>{`
        .debug-mouse-position {
          position: fixed;
          pointer-events: none;

          pre {
            font-weight: bold;
            line-height: 1;
            padding: 5px 10px;
            color: rgba(255, 255, 255, 1);
            background-color: rgba(0, 0, 0, 0.7);
          }
        }
      `}</style>
    </Portal>
  )
}
