import React, { useState, useEffect } from 'react'

import { Fallout } from '@pages/fallout'
import { GlobalKeyHandler } from '@shared/components/GlobalKeyHandler'

import { dispatch } from '@zus/store'
import { loadSettingsAction } from '@zus/actions'

const App = () => {
  const [isReady, setIsReady] = useState(false)

  //
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────────
  //

  useEffect(() => {
    // Add any initializations that should be run before rendering the main view here
    const init = async () => {
      await dispatch(loadSettingsAction())

      setIsReady(true)
    }

    init()
  }, [])

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //
  return (
    <div id="app">
      {isReady ? (
        <>
          <Fallout />
          <GlobalKeyHandler />
        </>
      ) : null}

      <style jsx>{`
        #app {
          display: flex;
          width: 100vw;
          height: 100%;
          min-height: 100vh;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  )
}

export default App
