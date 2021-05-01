import Helmet from 'react-helmet'

import { Viewport } from './components/Viewport'

export const ResidentEvil4 = () => {
  return (
    <>
      <Helmet>
        <title>invUI // Resident Evil 4</title>
      </Helmet>

      <div id="re4">
        <Viewport />
      </div>

      <style jsx>{`
        #re4 {
          position: relative;
          display: flex;
          flex-flow: column nowrap;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
          height: 100%;
          min-height: 100vh;
          overflow: auto;
        }
      `}</style>
    </>
  )
}

export default ResidentEvil4
