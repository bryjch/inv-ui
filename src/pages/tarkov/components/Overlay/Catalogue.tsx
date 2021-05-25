import { useTransition, animated } from 'react-spring'

import { DragPanel } from './DragPanel'
import { Listing } from '../Listing'

//////////////////////////
// Component definition //
//////////////////////////
export const Catalogue = () => {
  const transitions = useTransition(true, {
    from: { opacity: 0, left: -30 },
    enter: { opacity: 1, left: 0 },
  })

  return transitions((transitionStyle: any) => (
    <DragPanel title="CATALOGUE" backgroundColor="rgba(60,60,60,0.9)">
      <animated.div id="catalogue" className="drag-panel" style={transitionStyle}>
        <div className="listings">
          <Listing id="listing-catalogue" />
        </div>

        <style jsx global>{`
          #catalogue {
            flex: 1;
            padding: 0.5rem;
            max-height: 400px;
            overflow-y: auto;

            .listings {
              display: flex;
              flex-flow: column nowrap;
              align-items: flex-start;
              width: 100%;
              overflow-y: auto;
              padding-right: 1rem;
            }
          }
        `}</style>
      </animated.div>
    </DragPanel>
  ))
}
