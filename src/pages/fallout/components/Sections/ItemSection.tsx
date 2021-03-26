import React, { useState } from 'react'
import { intersection } from 'lodash'

import { InventoryViewer } from '../InventoryViewer'
import { InventoryStatus } from '../InventoryStatus'

import weapons from '@pages/fallout/data/weapons.json'
import apparel from '@pages/fallout/data/apparel.json'
import aid from '@pages/fallout/data/aid.json'
import misc from '@pages/fallout/data/misc.json'

const ALL_ITEMS = [...weapons, ...apparel, ...aid, ...misc, ...weapons, ...apparel, ...aid, ...misc]

interface ItemSectionProps {
  tab: string
}

export const ItemSection = (props: ItemSectionProps) => {
  const [items] = useState(ALL_ITEMS)
  const { tab } = props

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────────
  //

  const filters: string[] = []
  if (tab !== 'all') filters.push(tab)

  let itemsFiltered = items
  if (filters.length > 0) {
    itemsFiltered = items.filter(item => intersection(item.tags, filters).length > 0)
  }

  return (
    <section id="item-section">
      <InventoryViewer items={itemsFiltered} />
      <InventoryStatus items={items} />

      <style jsx>{`
        #item-section {
          display: flex;
          flex-flow: column nowrap;
          flex: 1;
          overflow: hidden;
        }
      `}</style>
    </section>
  )
}
