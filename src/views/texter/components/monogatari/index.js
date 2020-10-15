import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { default as monogatari, $_ready } from '@monogatari/core'

// Monogatari configs / helpers
import './options'
import './storage'
import './script'

const MonogatariCSS = React.lazy(() => import('./MonogatariCSS'))

export const MonogatariOverlay = () => {
  const active = useSelector(state => state.monogatari.active)

  useEffect(() => {
    $_ready(async () => {
      await monogatari.init('#monogatari')

      // Unbind default monotagari shortcuts
      const shortcuts = ['left', 'right', 'esc', 'shift+q', 'shift+s', 'shift+l']
      shortcuts.forEach(shortcut => monogatari.keyboardShortcut(shortcut, () => {}))
    })
  }, [])

  return (
    <div id="monogatari-core" className={active ? '' : 'hidden'}>
      <React.Suspense fallback={null}>
        <MonogatariCSS />
      </React.Suspense>

      <visual-novel>
        <game-screen>
          <text-box></text-box>
        </game-screen>
      </visual-novel>

      <style global jsx>{`
        html {
          font-size: 16px;
        }

        #monogatari-core {
          width: 100vw;
          height: 100vh;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: rgba(0, 0, 0, 0.3);
          transition: 0.4s all;

          &.hidden {
            opacity: 0;
            pointer-events: none;
          }

          game-screen {
            background: none;
          }

          text-box {
            width: auto;
            left: 0;
            right: 0;
            bottom: 0;
            padding: 0.5rem;
            font-family: PixelOperatorMono;

            & > [data-content='name'] {
              font-weight: bold;
            }

            & > [data-content='name'],
            & > [data-content='text'] {
              width: 100%;
              max-width: 900px;
              margin: 0 auto;
            }
          }
        }
      `}</style>
    </div>
  )
}
