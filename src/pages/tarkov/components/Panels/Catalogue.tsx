import { useTransition, animated } from 'react-spring'

import { Listing } from '../Listing'

export interface CatalogueProps {}

export const Catalogue = (props: CatalogueProps) => {
  const transitions = useTransition(true, {
    from: { opacity: 0, left: -30 },
    enter: { opacity: 1, left: 0 },
  })

  return transitions((transitionStyle: any) => (
    <animated.div id="catalogue" className="panel" style={transitionStyle}>
      <div className="panel-title">CATALOGUE</div>

      <div className="listings">
        <Listing id="listing-catalogue" />
      </div>

      <style jsx global>{`
        #catalogue {
          flex: 1;

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
  ))
}
