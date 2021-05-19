import { Overlay } from './Overlay'
import { Catalogue, PlayerGear, PlayerStorages, Stash } from './Panels'

export const Viewport = () => {
  return (
    <div id="viewport" onContextMenu={e => e.preventDefault()}>
      <Catalogue />

      <PlayerGear />

      <PlayerStorages />

      <Stash />

      <Overlay />

      <style jsx>{`
        #viewport {
          position: relative;
          width: 100%;
          max-width: 1300px;
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
