import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { Briefcase } from './Briefcase'
import { Storage } from './Storage'
import { Overlay } from './Overlay'
import { Debug } from './Debug'

export const Viewport = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Debug />

      <div id="viewport">
        <Briefcase />

        <Storage />

        <Overlay />

        <style jsx>{`
          #viewport {
            position: relative;
            width: 100%;
            height: 100vh;
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            align-items: center;
          }
        `}</style>
      </div>
    </DndProvider>
  )
}

export default Viewport
