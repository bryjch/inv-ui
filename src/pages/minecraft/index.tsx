import React from 'react'

import { Viewport } from './components/Viewport'

import './index.scss'

export const Minecraft = () => {
  return (
    <>
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
          background-color: #282c34;
          color: #e4e4e4;
        }
      `}</style>
    </>
  )
}

export default Minecraft
