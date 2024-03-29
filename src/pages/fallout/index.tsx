import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'

import { Viewport } from './components/Viewport'

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
      <Helmet>
        <title>invUI // Fallout</title>
      </Helmet>

      <div id="fallout">
        <Viewport />
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
          color: #e4e4e4;
        }
      `}</style>
    </>
  )
}

export default Fallout
