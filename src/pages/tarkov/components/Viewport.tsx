import { Overlay } from './Overlay'
import { PlayerGear, PlayerStorages, Stash } from './Panels'

//////////////////////////
// Component definition //
//////////////////////////
export const Viewport = () => {
  return (
    <div id="viewport" onContextMenu={e => e.preventDefault()}>
      <PlayerGear />

      <PlayerStorages />

      <Stash />

      <Overlay />

      <style jsx>{`
        #viewport {
          position: relative;
          width: 100%;
          max-width: 1280px;
          height: 100vh;
          display: flex;
          flex-flow: row nowrap;
          justify-content: flex-start;
          align-items: center;
        }
      `}</style>
    </div>
  )
}

export default Viewport
