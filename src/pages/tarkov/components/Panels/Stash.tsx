import { useTransition, animated } from 'react-spring'

import { Grid } from '../Grid'
import { FilterTabs } from '../Common'

//////////////////////////
// Component definition //
//////////////////////////
export const Stash = () => {
  const transitions = useTransition(true, {
    from: { opacity: 0, right: -30 },
    enter: { opacity: 1, right: 0 },
  })

  return transitions((transitionStyle: any) => (
    <animated.div id="stash" className="panel" style={transitionStyle}>
      <div className="panel-title">STASH</div>

      <div className="section">
        <FilterTabs />

        <Grid id="grid-stash" cols={10} rows={30} />
      </div>

      <style jsx global>{`
        #stash {
          .section {
            display: flex;
            min-height: 1px;
            flex-flow: row nowrap;
          }
        }
      `}</style>
    </animated.div>
  ))
}
