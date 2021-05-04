import { Briefcase } from './Briefcase'
import { Storage } from './Storage'
import { Overlay } from './Overlay'

export const Viewport = () => {
  return (
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
  )
}

export default Viewport
