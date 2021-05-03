import { useStore } from '@zus/re4/store'

export const Debug = () => {
  const dragging = useStore(state => state.dragging)
  const quadrants = useStore(state => state.quadrants)
  const briefcase = useStore(state => state.briefcase)

  const { top, left, right, bottom } = quadrants

  return (
    <div id="debug">
      <div className="states">
        <pre>{JSON.stringify(dragging.item)}</pre>
        <pre>{`${dragging.from || 'null'} -> ${dragging.to || 'null'}`}</pre>
        <pre>{JSON.stringify(dragging.occupying)}</pre>
        <pre>{JSON.stringify(briefcase.occupied)}</pre>
      </div>

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

          .states {
            max-width: 90vw;
            color: #ffffff;
            overflow: hidden;
            text-align: center;

            pre {
              font-size: 0.75rem;
              height: 1.5rem;
              line-height: 1.5rem;
              margin: 0;
            }
          }

          .quadrants {
            position: relative;

            & > div {
              position: absolute;
              background-color: red;
              width: 15px;
              height: 15px;

              &:nth-child(1) {
                top: 0px;
                left: 0px;
              }

              &:nth-child(2) {
                top: 0px;
                left: 15px;
              }

              &:nth-child(3) {
                top: 15px;
                left: 0px;
              }

              &:nth-child(4) {
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
