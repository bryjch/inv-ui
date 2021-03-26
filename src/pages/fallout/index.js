import React, { useEffect } from 'react'

import { Viewport } from './components/Viewport'
import { Settings } from './components/Settings'

import { SoundManager } from '@services/sounds'

export const Fallout = () => {
  useEffect(() => {
    // Sounds are preloaded otherwise there is a noticable delay between
    // the first time a sound is triggered & when the audio actually plays
    // (due to audio file still being downloaded)
    SoundManager.preload(['FALLOUT', 'MISC'])
  }, [])

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

export default Fallout
