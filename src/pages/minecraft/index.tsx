import React from 'react'
import Helmet from 'react-helmet'

import { Viewport } from './components/Viewport'

export const Minecraft = () => {
  return (
    <>
      <Helmet>
        <title>invUI // Minecraft</title>
      </Helmet>

      <div id="minecraft">
        <Viewport />
      </div>

      <style jsx>{`
        #minecraft {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          min-height: 100vh;
          color: #e4e4e4;
        }
      `}</style>
    </>
  )
}

export default Minecraft
