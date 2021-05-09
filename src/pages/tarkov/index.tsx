import { Helmet } from 'react-helmet-async'

import { Viewport } from './components/Viewport'
import { Debug } from './components/Debug'

import './index.scss'

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
          padding-left: 80px; /* Account for sidebar */
        }
      `}</style>

      <style jsx global>{`
        :root {
          --briefcase-background-color: #8b8b8b;
          --briefcase-grid-color: #bbbbbb;

          --briefcase-item-background-color: rgba(0, 0, 0, 0.8);
          --briefcase-item-outline-color: rgba(255, 255, 255, 0.9);
        }

        #tarkov {
          * {
            ::-webkit-scrollbar-track {
              background-color: #000000;
            }

            ::-webkit-scrollbar {
              width: 7px;
              background-color: #f5f5f5;
            }

            ::-webkit-scrollbar-thumb {
              background-color: #ffffff;
              border: 2px solid #000000;
            }
          }
        }
      `}</style>
    </>
  )
}

export default Tarkov
