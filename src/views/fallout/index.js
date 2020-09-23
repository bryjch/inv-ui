import React from 'react'

import { Viewport } from './components/Viewport'
import { Settings } from './components/Settings'

const Index = () => {
  return (
    <>
      <div id="fallout">
        <Viewport />
        <Settings />
      </div>

      <style jsx>{`
        #fallout {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          min-height: 100vh;
          background-color: #282c34;
          color: #e4e4e4;
        }
      `}</style>
    </>
  )
}

export default Index
