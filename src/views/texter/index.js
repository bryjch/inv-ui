import React, { useEffect } from 'react'

import { Viewport } from './components/Viewport'

import { SoundManager } from '@services/sounds'

const Index = () => {
  useEffect(() => {
    // Sounds are preloaded otherwise there is a noticable delay between
    // the first time a sound is triggered & when the audio actually plays
    // (due to audio file still being downloaded)
    SoundManager.preload(['TEXTER', 'MISC'])
  }, [])

  return (
    <>
      <div id="texter">
        <Viewport />
      </div>

      <style jsx>{`
        #texter {
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