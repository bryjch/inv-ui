import { useState } from 'react'
import { useTransition, animated } from 'react-spring'

import { Grid } from '../Grid'

// TODO: do this better
const FILTERS = [
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'C', value: 'C' },
  { label: 'D', value: 'D' },
]

//////////////////////////
// Component definition //
//////////////////////////
export const Stash = () => {
  const [activeFilter, setActiveFilter] = useState<string>(FILTERS[0].value)

  const transitions = useTransition(true, {
    from: { opacity: 0, right: -30 },
    enter: { opacity: 1, right: 0 },
  })

  return transitions((transitionStyle: any) => (
    <animated.div id="stash" className="panel" style={transitionStyle}>
      <div className="panel-title">STASH</div>

      <div className="section">
        <div className="filters">
          {FILTERS.map(filter => (
            <div
              key={`stash-filter-${filter.value}`}
              className={`filter ${activeFilter === filter.value ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </div>
          ))}
        </div>

        <Grid id="grid-stash" cols={10} rows={30} />
      </div>

      <style jsx global>{`
        $stash-filter-button-size: 26px;
        $stash-filter-button-color: rgba(150, 150, 150, 1);
        $stash-filter-cutout-size: 6px;

        #stash {
          .section {
            display: flex;
            min-height: 1px;
            flex-flow: row nowrap;

            .filters {
              display: flex;
              flex-flow: column;
              align-items: flex-end;

              .filter {
                position: relative;
                width: #{$stash-filter-button-size - $stash-filter-cutout-size};
                height: #{$stash-filter-button-size};
                line-height: #{$stash-filter-button-size};
                text-align: center;
                background: #{$stash-filter-button-color};
                padding-right: #{$stash-filter-cutout-size};
                margin-right: 2px;
                margin-bottom: 2px;
                cursor: pointer;
                font-weight: 900;
                color: #ffffff;
                opacity: 0.3;
                transition: 0.1s ease opacity;

                &:before {
                  content: '';
                  position: absolute;
                  left: -#{$stash-filter-cutout-size};
                  top: #{$stash-filter-cutout-size};
                  bottom: 0;
                  width: #{$stash-filter-cutout-size};
                  background: #{$stash-filter-button-color};
                }

                &:after {
                  content: '';
                  position: absolute;
                  top: 0px;
                  left: -#{$stash-filter-cutout-size};
                  border-color: transparent;
                  border-style: solid;
                  border-width: #{$stash-filter-cutout-size / 2};
                  border-right-color: #{$stash-filter-button-color};
                  border-bottom-color: #{$stash-filter-button-color};
                }

                &:hover {
                  opacity: 0.6;
                }

                &.active {
                  opacity: 1;
                  margin-right: 0;
                  width: 100%;
                }
              }
            }
          }
        }
      `}</style>
    </animated.div>
  ))
}
