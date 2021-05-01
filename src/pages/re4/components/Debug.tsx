import { XYCoord } from 'react-dnd'

import { Quadrants } from '../data/definitions'

import { useStore } from '@zus/re4/store'

export const Debug = () => {
  const dragging = useStore(state => state.dragging)
  const quadrants = useStore(state => state.quadrants)

  const { top, left, right, bottom } = quadrants

  const calculateCenter = (w: number, h: number, quadrants: Quadrants) => {
    const wFunc = quadrants.left ? Math.ceil : Math.floor
    const hFunc = quadrants.top ? Math.ceil : Math.floor

    const offset: XYCoord = { x: wFunc((w - 1) / 2), y: hFunc((h - 1) / 2) }

    return offset.x + ',' + offset.y
  }

  return (
    <div id="debug">
      <pre>{JSON.stringify(dragging)}</pre>

      <pre>
        {dragging.item &&
          calculateCenter(dragging.item?.dimensions.w, dragging.item?.dimensions.h, quadrants)}
      </pre>

      <pre className="quadrants">
        <div style={{ backgroundColor: top && left ? 'green' : 'red' }} />
        <div style={{ backgroundColor: top && right ? 'green' : 'red' }} />
        <div style={{ backgroundColor: bottom && left ? 'green' : 'red' }} />
        <div style={{ backgroundColor: bottom && right ? 'green' : 'red' }} />
      </pre>

      <style jsx>{`
        #debug {
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;

          .quadrants {
            position: relative;

            & > div {
              position: absolute;
              width: 15px;
              height: 15px;

              &:nth-child(1) {
                background-color: red;
                top: 0px;
                left: 0px;
              }

              &:nth-child(2) {
                background-color: red;
                top: 0px;
                left: 15px;
              }

              &:nth-child(3) {
                background-color: red;
                top: 15px;
                left: 0px;
              }

              &:nth-child(4) {
                background-color: red;
                top: 15px;
                left: 15px;
              }
            }
          }
        }
      `}</style>
    </div>
  )
}
