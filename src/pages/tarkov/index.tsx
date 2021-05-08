import { Helmet } from 'react-helmet-async'

import { Viewport } from './components/Viewport'
import { Debug } from './components/Debug'

export const Tarkov = () => {
  return (
    <>
      <Helmet>
        <title>invUI // Escape from Tarkov</title>
      </Helmet>

      <div id="tarkov">
        <Debug />
        <Viewport />
      </div>

      <style jsx>{`
        #tarkov {
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

      <style jsx global>{`
        :root {
          --briefcase-background-color: #8b8b8b;
          --briefcase-grid-color: #bbbbbb;

          --briefcase-item-background-color: rgba(0, 0, 0, 0.8);
          --briefcase-item-outline-color: rgba(255, 255, 255, 0.9);
        }
      `}</style>
    </>
  )
}

export default Tarkov
