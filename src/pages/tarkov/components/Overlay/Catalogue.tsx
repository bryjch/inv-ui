import { useState } from 'react'

import { DragPanel } from './DragPanel'
import { Listing } from '../Listing'
import { FilterTabs } from '../Common'

//////////////////////////
// Component definition //
//////////////////////////
export const Catalogue = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all')

  return (
    <DragPanel title="CATALOGUE" backgroundColor="rgba(75, 30, 30, 0.95)">
      <div id="catalogue">
        <div className="filters">
          <FilterTabs onChange={filter => setActiveFilter(filter.value)} />
        </div>

        <div className="listing">
          <Listing id="listing-catalogue" filter={activeFilter} />
        </div>

        <style jsx global>{`
          #catalogue {
            position: relative;
            display: flex;
            flex-flow: row nowrap;
            align-items: flex-start;
            height: 500px;
            width: 400px;
            max-height: 75vh;
            max-width: 75vw;

            .filters {
              height: 100%;
              background: rgba(255, 255, 255, 0.2);
              padding: 2px 0 2px 2px;
              flex-shrink: 0;
            }

            .listing {
              flex: 1;
              height: 100%;
              overflow-y: auto;
              padding: 0.5rem;
            }
          }
        `}</style>
      </div>
    </DragPanel>
  )
}
