import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'

import { Viewport } from './components/Viewport'
import { Debug } from './components/Debug'

import { dispatch } from '@zus/store'
import { loadSavedInventoryAction } from '@zus/tarkov/actions'
import { AssetManager } from '@services/assets'

import './index.scss'

export const Tarkov = () => {
  const [isReady, setIsReady] = useState(false)

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  useEffect(() => {
    const init = async () => {
      await AssetManager.preload([
        '/assets/tarkov/images/guns.png',
        '/assets/tarkov/images/consumables.png',
        '/assets/tarkov/images/wallpaper.jpg',
        '/assets/tarkov/images/grid_square.png',
      ])

      await dispatch(loadSavedInventoryAction())

      setIsReady(true)
    }

    init()
  }, [])

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  return (
    <>
      <Helmet>
        <title>invUI // Escape from Tarkov</title>
      </Helmet>

      {
        isReady ? (
          <div id="tarkov">
            <Viewport />
          </div>
        ) : null // TODO: loading screen
      }

      <style jsx>{`
        #tarkov {
          position: relative;
          display: flex;
          flex-flow: column nowrap;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
          height: 100%;
          min-height: 100vh;
          overflow: auto;
          padding-left: 80px; /* Account for sidebar */
        }
      `}</style>

      <style jsx global>{`
        :root {
          --briefcase-background-color: #8b8b8b;
          --briefcase-grid-color: #bbbbbb;

          --briefcase-item-background-color: rgba(0, 0, 0, 0.8);
          --briefcase-item-outline-color: rgba(255, 255, 255, 0.9);

          --grid-border-width: 2px;
          --grid-border-color: rgba(130, 130, 130, 1);
        }

        html {
          * {
            ::-webkit-scrollbar-track {
              background-color: #000000;
            }

            ::-webkit-scrollbar {
              width: 7px;
              background-color: #f5f5f5;
            }

            ::-webkit-scrollbar-thumb {
              background-color: #ffffff;
              border: 2px solid #000000;
            }

            user-select: none;
            scrollbar-width: thin;
            scrollbar-color: #ffffff #000000;
          }

          &:before {
            position: absolute;
            content: '';
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url(/assets/tarkov/images/wallpaper.jpg);
            background-size: cover;
            animation: sway 4s ease 0s infinite alternate;
          }
        }

        @keyframes sway {
          0% {
            background-position: 55% 55%;
            opacity: 0.6;
          }
          100% {
            background-position: 45% 45%;
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}

export default Tarkov
