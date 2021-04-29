import React, { useState, useEffect } from 'react'
import { Portal } from 'react-portal'

import { Home } from '@shared/components/Home'
import { Sidebar } from '@shared/components/Sidebar'
import { Settings } from '@shared/components/Settings'
import { GlobalKeyHandler } from '@shared/components/GlobalKeyHandler'

import { dispatch, useStore } from '@zus/store'
import { setActiveGameAction, loadSettingsAction } from '@zus/actions'

import { GAMES } from '@constants/config'

const App = () => {
  const activeGame = useStore(state => state.app.activeGame)
  const [isReady, setIsReady] = useState(false)

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  useEffect(() => {
    // Add any initializations that should be run before rendering the main view here
    const init = async () => {
      await dispatch(loadGameFromUrl())

      await dispatch(loadSettingsAction())

      setIsReady(true)
    }

    init()
  }, [])

  //
  // ─── METHODS ────────────────────────────────────────────────────────────────────
  //

  const loadGameFromUrl = async () => {
    try {
      const path = window.location.pathname.replace(/\//g, '')

      if (!path) return null

      const game = GAMES.find(game => game.id === path)

      if (game) dispatch(setActiveGameAction(game))
    } catch (error) {
      console.error(error)
    }
  }

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  const MainContent: any = activeGame?.component || Home

  return (
    <div id="app">
      {isReady ? (
        <>
          <Sidebar />

          <MainContent />

          <GlobalKeyHandler />

          <Portal node={document && document.getElementById('portal')}>
            <Settings />
          </Portal>
        </>
      ) : null}

      <style jsx>{`
        #app {
          display: flex;
          width: 100vw;
          height: 100vh;
          min-height: 100vh;
          flex-flow: row nowrap;
          justify-content: center;
          align-items: stretch;
          background-color: #282c34;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default App
