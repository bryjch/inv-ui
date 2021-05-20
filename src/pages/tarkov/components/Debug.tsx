import { useStore } from '@zus/tarkov/store'

//////////////////////////
// Component definition //
//////////////////////////
export const Debug = () => {
  const dragging = useStore(state => state.dragging)

  return (
    <div id="debug">
      <div className="states">
        <pre>{JSON.stringify(dragging.item)}</pre>
        <pre>{`${dragging.from || 'null'} -> ${dragging.to || 'null'}`}</pre>
        <pre>{JSON.stringify(dragging.gridOffset)}</pre>
        <pre>
          {dragging.index !== null ? dragging.index : 'null'} | {JSON.stringify(dragging.hovering)}
        </pre>
      </div>

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
        }
      `}</style>
    </div>
  )
}
