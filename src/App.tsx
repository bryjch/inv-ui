import React from 'react'

import { Fallout } from '@pages/fallout'
import { GlobalKeyHandler } from '@shared/components/GlobalKeyHandler'

function App() {
  return (
    <div id="app">
      <Fallout />

      <GlobalKeyHandler />

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