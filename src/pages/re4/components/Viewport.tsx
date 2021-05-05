import { Listing } from './Listing'
import { Overlay } from './Overlay'

import { Grid } from './Grid'

export const Viewport = () => {
  return (
    <div id="viewport">
      <Grid id="grid-backpack" cols={10} rows={6} />

      <div style={{ width: '1rem' }} />

      <div>
        <Grid id="grid-briefcase" cols={6} rows={2} />

        <div style={{ height: '1rem' }} />

        <Grid id="grid-pouch" cols={6} rows={2} />

        <div style={{ height: '1rem' }} />

        <Grid id="grid-pockets" cols={6} rows={1} />
      </div>

      <Listing id="listing-catalogue" />

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
